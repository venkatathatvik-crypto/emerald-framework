import { useSyncExternalStore } from "react";

/**
 * A basket held entirely in the browser.
 *
 * Augmont's own cart endpoints are not usable in our model: their only exit is
 * check-out-cart → verify-block → send-otp → verify-otp → POST /order, and that
 * OTP chain is explicitly out of scope for the non-assisted merchant flow we're
 * integrated against (confirmed by Augmont). Their cart also rejects multi-item
 * EMI outright ("Emi Payment cannot have multiple products quantity!").
 *
 * So the basket lives here, and checkout places one POST /order/create per line.
 * That keeps the one-order-per-product shape our own Order table already has —
 * sending several products in a single call makes Augmont split them into
 * independent orders anyway, and only the first would be recorded our side.
 */

/** Augmont's paymentTypeId 4 is spot; 1/2/3 are the 3/6/9-month EMI plans. */
const SPOT_PAYMENT_TYPE_ID = 4;

export interface CartLine {
  /** Product + tenure identifies a line: the same product on two plans is two lines. */
  key: string;
  augmontProductId: number;
  productName: string;
  productSku: string;
  productWeight: number;
  paymentTypeId: number;
  quantity: number;
  /** Always computed at add-time, so these are real numbers not optionals. */
  finalOrderPrice: number;
  initialPayment: number;
  monthlyAmount?: number;
  thumbnail?: string | null;
}

export function lineKey(augmontProductId: number, paymentTypeId: number): string {
  return `${augmontProductId}:${paymentTypeId}`;
}

export function isSpot(paymentTypeId: number): boolean {
  return paymentTypeId === SPOT_PAYMENT_TYPE_ID;
}

/**
 * EMI is single-quantity at Augmont's end — their cart rejects a quantity above
 * one on an EMI plan. Spot orders have no such limit.
 */
export function maxQuantityFor(paymentTypeId: number): number {
  return isSpot(paymentTypeId) ? 99 : 1;
}

// ── Storage ────────────────────────────────────────────────────────────────
// Scoped per user so a shared browser can't leak one customer's basket into
// the next session. Anonymous falls back to a shared key, which is fine —
// nothing can be checked out without logging in anyway.

const KEY_PREFIX = "gemi.cart.v1";
/** Stable identity: returning a fresh [] from the store would spin the subscriber. */
const EMPTY: CartLine[] = [];

let scope = "anon";
let lines: CartLine[] = EMPTY;
let loadedScope: string | null = null;
const listeners = new Set<() => void>();

function storageKey(): string {
  return `${KEY_PREFIX}.${scope}`;
}

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(storageKey());
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartLine[]) : EMPTY;
  } catch {
    // Corrupt or unavailable storage shouldn't take the shop down.
    return EMPTY;
  }
}

function writeStorage(next: CartLine[]) {
  if (typeof window === "undefined") return;
  try {
    if (next.length === 0) window.localStorage.removeItem(storageKey());
    else window.localStorage.setItem(storageKey(), JSON.stringify(next));
  } catch {
    // Quota or private-mode failures are non-fatal; the in-memory cart still works.
  }
}

function emit() {
  for (const l of listeners) l();
}

function setLines(next: CartLine[]) {
  lines = next.length === 0 ? EMPTY : next;
  writeStorage(lines);
  emit();
}

/** Point the cart at a given user's basket. Call once the session is known. */
export function setCartScope(userKey: string | null | undefined) {
  const next = userKey || "anon";
  if (next === scope && loadedScope === next) return;
  scope = next;
  loadedScope = next;
  lines = readStorage();
  emit();
}

function ensureLoaded() {
  if (loadedScope === null && typeof window !== "undefined") {
    loadedScope = scope;
    lines = readStorage();
  }
}

// ── Mutations ──────────────────────────────────────────────────────────────

export function addLine(line: Omit<CartLine, "key" | "quantity">, quantity = 1) {
  ensureLoaded();
  const key = lineKey(line.augmontProductId, line.paymentTypeId);
  const cap = maxQuantityFor(line.paymentTypeId);
  const existing = lines.find((l) => l.key === key);

  if (existing) {
    setLines(
      lines.map((l) =>
        l.key === key ? { ...l, quantity: Math.min(cap, l.quantity + quantity) } : l,
      ),
    );
    return;
  }
  setLines([...lines, { ...line, key, quantity: Math.min(cap, quantity) }]);
}

export function removeLine(key: string) {
  ensureLoaded();
  setLines(lines.filter((l) => l.key !== key));
}

export function setLineQuantity(key: string, quantity: number) {
  ensureLoaded();
  if (quantity < 1) {
    removeLine(key);
    return;
  }
  setLines(
    lines.map((l) =>
      l.key === key ? { ...l, quantity: Math.min(maxQuantityFor(l.paymentTypeId), quantity) } : l,
    ),
  );
}

export function clearCart() {
  ensureLoaded();
  setLines([]);
}

// ── Reads ──────────────────────────────────────────────────────────────────

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CartLine[] {
  ensureLoaded();
  return lines;
}

/** Server render has no localStorage — always an empty basket, hydrated on the client. */
function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useCartCount(): number {
  const cart = useCart();
  return cart.reduce((n, l) => n + l.quantity, 0);
}

/** Payable now: the down payment on EMI lines, the full price on spot lines. */
export function cartDueToday(cart: CartLine[]): number {
  return cart.reduce((sum, l) => sum + l.initialPayment * l.quantity, 0);
}

/** Total contract value across the basket, EMI interest included. */
export function cartTotalValue(cart: CartLine[]): number {
  return cart.reduce((sum, l) => sum + l.finalOrderPrice * l.quantity, 0);
}
