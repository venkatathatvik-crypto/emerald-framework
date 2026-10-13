/**
 * Loading visuals recreated from `docs/Emerald Loading Spinner (standalone).html`.
 *
 * That file is a frame-driven render harness — every value was computed from a
 * JS clock each frame. These are the same motions expressed declaratively so
 * they cost nothing on the main thread. Geometry, palette and the 4s loop are
 * taken from the original; keyframes live in styles.css.
 *
 * One visual ships here, deliberately: <Spinner/>, the orbiting gold-and-emerald
 * ring, with <LoadingState/> wrapping it for panel- and route-level waits. The
 * bobbing-ingot scene that used to live here was a second, unrelated loading
 * language for the same job, so every wait now looks the same.
 */
const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F1D67A";
const EMERALD = "#0B4F3A";
const EMERALD_LIGHT = "#1E8A63";

/** Source's LOOP constant. `speed` divides it, exactly as the original did. */
const LOOP_MS = 4000;
const PARTICLE_COUNT = 10;

export type SpinnerVariant = "balanced" | "gold" | "emerald";

const RING_STOPS: Record<SpinnerVariant, string> = {
  gold: `${GOLD_LIGHT} 0deg, ${GOLD} 70deg, transparent 150deg, transparent 210deg, ${EMERALD} 300deg, ${GOLD_LIGHT} 360deg`,
  emerald: `${EMERALD_LIGHT} 0deg, ${EMERALD} 90deg, transparent 160deg, transparent 220deg, ${GOLD} 300deg, ${EMERALD_LIGHT} 360deg`,
  balanced: `${GOLD_LIGHT} 0deg, ${GOLD} 60deg, ${EMERALD_LIGHT} 150deg, transparent 210deg, transparent 260deg, ${EMERALD} 320deg, ${GOLD_LIGHT} 360deg`,
};

const OCTAGON =
  "polygon(50% 2%, 76% 15%, 98% 50%, 76% 85%, 50% 98%, 24% 85%, 2% 50%, 24% 15%)";

interface SpinnerProps {
  /** Diameter in px. 22 matches the source's in-button spinner. */
  size?: number;
  variant?: SpinnerVariant;
  /** Faceted centre stone. Off below ~28px, where it just muddies the ring. */
  showGem?: boolean;
  /** Multiplies the base 4s rotation — >1 is faster. */
  speed?: number;
  className?: string;
  /** Screen-reader text; omit only when an adjacent label already says it. */
  label?: string;
}

export function Spinner({
  size = 22,
  variant = "balanced",
  showGem = false,
  speed = 1,
  className = "",
  label = "Loading",
}: SpinnerProps) {
  const thickness = Math.max(2, size * 0.07);
  const radius = size / 2 - thickness / 2;
  const duration = LOOP_MS / speed;
  // Carves the filled disc down to just its outer band.
  const ringMask = `radial-gradient(closest-side, transparent calc(100% - ${thickness + 2}px), #000 calc(100% - ${thickness}px), #000 100%)`;

  return (
    <span
      data-emerald-loader=""
      role="status"
      aria-live="polite"
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {label && <span className="sr-only">{label}</span>}

      {/* Ambient halo */}
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          inset: -size * 0.28,
          background:
            "radial-gradient(circle, rgba(212,175,55,0.18), rgba(11,79,58,0.12) 55%, transparent 72%)",
          filter: `blur(${size * 0.06}px)`,
        }}
      />

      {/* Unfilled track */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ border: `${thickness}px solid rgba(11,79,58,0.10)` }}
      />

      {/* Ring + particles orbit together, so one rotation drives both */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          animation: `emerald-spinner-rotate ${duration}ms linear infinite`,
        }}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${RING_STOPS[variant]})`,
            WebkitMaskImage: ringMask,
            maskImage: ringMask,
            filter: `drop-shadow(0 0 ${size * 0.05}px rgba(212,175,55,0.35))`,
          }}
        />

        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
          const angle = (i * (360 / PARTICLE_COUNT) * Math.PI) / 180;
          const isGold = i % 2 === 0;
          const dot = size * 0.065;
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                width: dot,
                height: dot,
                marginLeft: -dot / 2,
                marginTop: -dot / 2,
                transform: `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`,
              }}
            >
              <span
                className="block h-full w-full rounded-full"
                style={{
                  background: isGold ? GOLD_LIGHT : EMERALD_LIGHT,
                  filter: `drop-shadow(0 0 ${dot * 0.9}px ${
                    isGold ? "rgba(212,175,55,0.8)" : "rgba(30,138,99,0.75)"
                  })`,
                  // Staggered so the pulse travels around the ring.
                  animation: `emerald-spinner-particle ${duration}ms ease-in-out infinite`,
                  animationDelay: `${(-i * duration) / PARTICLE_COUNT}ms`,
                }}
              />
            </span>
          );
        })}
      </span>

      {showGem && (
        <span
          aria-hidden
          className="absolute inset-0 grid place-items-center"
          style={{
            animation: `emerald-spinner-gem ${duration}ms ease-in-out infinite`,
          }}
        >
          <span
            className="relative block"
            style={{
              width: size * 0.34,
              height: size * 0.34,
              filter: `drop-shadow(0 0 ${size * 0.075}px rgba(11,79,58,0.45))`,
            }}
          >
            <span
              className="absolute inset-0"
              style={{
                clipPath: OCTAGON,
                background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD} 60%, #9c7a1f)`,
              }}
            />
            <span
              className="absolute"
              style={{
                inset: size * 0.02,
                clipPath: OCTAGON,
                background: `linear-gradient(145deg, ${EMERALD_LIGHT} 0%, ${EMERALD} 55%, #062f22 100%)`,
              }}
            />
          </span>
        </span>
      )}
    </span>
  );
}

/**
 * The everyday "this panel is fetching" state — ring plus its caption. Sized to
 * sit happily inside a table cell or a small dashboard panel, where the ingot
 * scene below would be far too heavy.
 */
export function LoadingState({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-10 ${className}`}
    >
      <Spinner size={26} showGem label={label} />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
