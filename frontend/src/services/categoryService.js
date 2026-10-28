import apiClient from "./apiClient";

export const categoryService = {
  getTree: async () => (await apiClient.get("/categories/tree")).data.result || [],
  getStats: async () => (await apiClient.get("/categories/admin/stats")).data.result || {},
  create: async (payload) => (await apiClient.post("/categories", payload)).data.result,
  update: async (id, payload) => (await apiClient.put(`/categories/${id}`, payload)).data.result,
  importCsv: async (file) => {
    const body = new FormData();
    body.append("file", file);
    return (await apiClient.post("/categories/admin/import", body)).data.result;
  },
};
