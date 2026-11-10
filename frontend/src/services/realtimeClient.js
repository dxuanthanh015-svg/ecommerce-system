import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let activeClient = null;

export function createRealtimeClient(accessToken, onConnect) {
  const apiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  if (!apiUrl) throw new Error("Thiếu VITE_API_URL để kết nối WebSocket");

  const client = new Client({
    webSocketFactory: () => new SockJS(`${apiUrl}/ws`),
    connectHeaders: { Authorization: `Bearer ${accessToken}` },
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: () => {
      activeClient = client;
      onConnect(client);
    },
    onStompError: (frame) => console.error("STOMP error:", frame.headers),
    onWebSocketError: (error) => console.error("WebSocket error:", error),
  });

  client.onWebSocketClose = () => {
    if (activeClient === client) activeClient = null;
  };

  client.activate();
  return client;
}

export function publishRealtime(destination, payload) {
  if (!activeClient?.connected) return false;
  activeClient.publish({ destination, body: JSON.stringify(payload) });
  return true;
}
