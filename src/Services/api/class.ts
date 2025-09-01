import api from "./api"; // axios instance

export const getAllClasses = async () => {
  const res = await api.get("/class");
  return res.data;
};

export const createClass = async (data: { name: string; description: string; price: number }) => {
  const res = await api.post("/class", data);
  return res.data;
};

export const updateClass = async (id: string, data: { name: string; description: string; price: number }) => {
  const res = await api.put(`/class/${id}`, data);
  return res.data;
};

export const deleteClass = async (id: string) => {
  const res = await api.delete(`/class/${id}`);
  return res.data;
};
