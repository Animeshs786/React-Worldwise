import { useSearchParams } from "react-router-dom";

function usePosition() {
  const [queryParams] = useSearchParams();
  const lat = queryParams.get("lat");
  const lng = queryParams.get("lng");
  return [lat, lng];
}

export { usePosition };
