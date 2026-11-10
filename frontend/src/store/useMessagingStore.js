import { create } from "zustand";

export const useMessagingStore = create((set) => ({
  unreadByAudience: { customer: 0, storeManager: 0 },
  activeConversationByAudience: { customer: null, storeManager: null },
  setUnreadCount: (audience, count) => set((state) => ({
    unreadByAudience: { ...state.unreadByAudience, [audience]: Math.max(0, Number(count) || 0) },
  })),
  incrementUnread: (audience, amount = 1) => set((state) => ({
    unreadByAudience: {
      ...state.unreadByAudience,
      [audience]: Math.max(0, (state.unreadByAudience[audience] || 0) + amount),
    },
  })),
  clearUnread: (audience) => set((state) => ({
    unreadByAudience: { ...state.unreadByAudience, [audience]: 0 },
  })),
  setActiveConversation: (audience, conversationId) => set((state) => ({
    activeConversationByAudience: {
      ...state.activeConversationByAudience,
      [audience]: conversationId,
    },
  })),
  receiveMessage: (message, audience) => set((state) => {
    const activeId = state.activeConversationByAudience[audience];
    if (activeId && activeId === message.conversationId) return state;
    return {
      unreadByAudience: {
        ...state.unreadByAudience,
        [audience]: (state.unreadByAudience[audience] || 0) + 1,
      },
    };
  }),
}));
