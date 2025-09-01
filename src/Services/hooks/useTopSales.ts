import { useQuery } from "@tanstack/react-query";

import { fetchTopSales,type SalesItem } from "../api/sales";

export const useTopSales = () => {
  return useQuery<SalesItem[]>({
    queryKey: ["topSales"],
    queryFn: fetchTopSales,
    staleTime: 5 * 60 * 1000,  // cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};
