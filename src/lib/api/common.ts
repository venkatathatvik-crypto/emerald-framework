import { apiFetch } from "./client";
import type { MasCity, MasState } from "./types";

/** Public — every Indian state/UT, alphabetical. */
export function listStates(): Promise<MasState[]> {
  return apiFetch<MasState[]>("/api/v1/common/states");
}

/** Public — cities under a state, alphabetical. */
export function listCities(stateId: number): Promise<MasCity[]> {
  return apiFetch<MasCity[]>("/api/v1/common/cities", { query: { stateId } });
}
