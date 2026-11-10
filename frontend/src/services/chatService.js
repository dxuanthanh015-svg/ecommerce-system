import apiClient from "./apiClient";

export const chatService = {
  async openConversation(storeId) {
    const response = await apiClient.post("/messages/conversations", null, {
      params: { storeId },
    });
    return response.data.result;
  },

  async getConversations(audience = "customer") {
    const response = await apiClient.get("/messages/conversations", {
      params: { audience },
    });
    return response.data.result || [];
  },

  async getMessages(conversationId, page = 0, size = 50) {
    const response = await apiClient.get(
      `/messages/conversations/${conversationId}/messages`,
      { params: { page, size } }
    );
    return response.data.result;
  },

  async uploadAttachment(conversationId, file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/messages/attachments", formData, {
      params: { conversationId },
    });
    return response.data.result;
  },

  async markConversationRead(conversationId) {
    await apiClient.patch(`/messages/conversations/${conversationId}/read`);
  },

  async getUnreadCount() {
    const response = await apiClient.get("/messages/unread-count");
    return Number(response.data.result || 0);
  },
};
