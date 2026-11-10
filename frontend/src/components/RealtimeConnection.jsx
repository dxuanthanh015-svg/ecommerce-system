import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import { useAuthStore } from "../store/useAuthStore";
import { useMessagingStore } from "../store/useMessagingStore";
import { createRealtimeClient } from "../services/realtimeClient";
import { chatService } from "../services/chatService";

export default function RealtimeConnection() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const queryClient = useQueryClient();
  const roles = Array.isArray(user?.roles) ? user.roles : [user?.role].filter(Boolean);
  const audience = roles.includes("STORE_MANAGER")
    ? "storeManager"
    : roles.includes("CUSTOMER") ? "customer" : null;
  const unreadQuery = useQuery({
    queryKey: QUERY_KEYS.CHAT_UNREAD(userId),
    queryFn: chatService.getUnreadCount,
    enabled: Boolean(isAuthenticated && userId && audience),
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (audience && unreadQuery.data !== undefined) {
      useMessagingStore.getState().setUnreadCount(audience, unreadQuery.data);
    }
  }, [audience, unreadQuery.data]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken || !userId) return undefined;

    const client = createRealtimeClient(accessToken, (connectedClient) => {
      connectedClient.subscribe("/user/queue/notifications", () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION });
      });

      if (!audience) return;
      connectedClient.subscribe("/user/queue/chat", (frame) => {
        try {
          const message = JSON.parse(frame.body);
          if (message.senderId !== userId) {
            useMessagingStore.getState().receiveMessage(message, audience);
          }
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_CONVERSATIONS });
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.CHAT_MESSAGES(message.conversationId),
          });
          const activeConversationId = useMessagingStore.getState()
            .activeConversationByAudience[audience];
          if (activeConversationId === message.conversationId) {
            void chatService.markConversationRead(message.conversationId)
              .catch((error) => console.error("Không đánh dấu được tin chat đã đọc:", error))
              .finally(() => {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_UNREAD(userId) });
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_CONVERSATIONS });
              });
          } else {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_UNREAD(userId) });
          }
        } catch (error) {
          console.error("Không đọc được chat message realtime:", error);
        }
      });
    });

    return () => {
      void client.deactivate();
    };
  }, [isAuthenticated, accessToken, userId, audience, queryClient]);

  return null;
}
