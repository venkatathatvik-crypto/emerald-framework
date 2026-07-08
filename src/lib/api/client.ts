import { ApiError, type ApiResponse } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/goldemi-api";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/**
 * Thin fetch wrapper for gold-emi-api. Auth is cookie-based (HttpOnly
 * access_token/refresh_token set by the server) — every request sends
 * credentials so the browser attaches those cookies automatically.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload: ApiResponse<T> | undefined = isJson ? await res.json() : undefined;

  if (!res.ok || payload?.success === false) {
    const fieldErrors =
      payload?.data && typeof payload.data === "object" && !Array.isArray(payload.data)
        ? (payload.data as Record<string, string>)
        : undefined;
    throw new ApiError(res.status, payload?.message ?? res.statusText, fieldErrors);
  }

  return payload?.data as T;
}
