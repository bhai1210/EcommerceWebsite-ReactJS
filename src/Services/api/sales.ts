
import api from "./api";

export type SalesItem = {
  name: string;
  value: number;
};

export const fetchTopSales = async (): Promise<SalesItem[]> => {
  const res = await api.get("/sales/top-items");
  return res.data;
};
