import { useQuery } from "@tanstack/react-query";
import { listCities, listStates } from "@/lib/api/common";
import { getAugmontStates, getAugmontCities } from "@/lib/api/augmont";

/** Reference data — states/cities essentially never change within a session. */
const STALE_TIME = 60 * 60 * 1000;

export function useStates() {
  return useQuery({
    queryKey: ["common", "states"],
    queryFn: listStates,
    staleTime: STALE_TIME,
  });
}

/**
 * Cities for a state, looked up by STATE NAME (not id) — forms store/submit
 * the plain city/state name strings to match the existing branch/lead API
 * contracts, so this resolves the id from the states list internally.
 */
export function useCities(stateName: string | undefined) {
  const { data: states } = useStates();
  const stateId = states?.find((s) => s.name === stateName)?.id;

  return useQuery({
    queryKey: ["common", "cities", stateId],
    queryFn: () => listCities(stateId!),
    enabled: !!stateId,
    staleTime: STALE_TIME,
  });
}

/**
 * Augmont's own state/city master data — use these (not useStates/useCities)
 * for any form whose values get submitted to /api/v1/augmont/orders, since
 * order creation validates cityName/stateName against Augmont's own list,
 * not ours (confirmed live: our "Bengaluru" 422'd as "incorrect city name";
 * Augmont only has "Bengaluru Urban"/"Bengaluru Rural" etc).
 */
export function useAugmontStates() {
  return useQuery({
    queryKey: ["augmont", "states"],
    queryFn: getAugmontStates,
    staleTime: STALE_TIME,
  });
}

export function useAugmontCities(stateName: string | undefined) {
  const { data: states } = useAugmontStates();
  const stateId = states?.find((s) => s.name === stateName)?.id;

  return useQuery({
    queryKey: ["augmont", "cities", stateId],
    queryFn: () => getAugmontCities(stateId!),
    enabled: !!stateId,
    staleTime: STALE_TIME,
  });
}
