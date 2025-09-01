import api from "./api";

export const TransactionByhour = async () => {
  const res = await api.get("/heatmap");
  return res.data;
};
