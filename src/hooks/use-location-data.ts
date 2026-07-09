import { useQuery } from "@tanstack/react-query";
import { listCities, listStates } from "@/lib/api/common";

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
