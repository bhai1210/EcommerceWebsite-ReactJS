import { useQuery } from "@tanstack/react-query";
import { TransactionByhour } from "../api/transactionbyhour";

export type HeatmapData = {
  data: number[][];
  days: string[];
  timeSlots: string[];
};

export const UseTransactionByhourdata = () => {
  return useQuery<HeatmapData>({
    queryKey: ["heatmap"],
    queryFn: TransactionByhour,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};
