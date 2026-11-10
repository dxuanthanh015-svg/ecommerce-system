import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SearchIcon from "@mui/icons-material/Search";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import { useMessagingStore } from "../../store/useMessagingStore";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { chatService } from "../../services/chatService";
import { publishRealtime } from "../../services/realtimeClient";

const EMPTY_CONVERSATIONS = [];

const getDisplayName = (conversation, isManager) =>
  isManager ? conversation.customerName : conversation.storeName;

const getInitials = (value = "Cửa hàng") =>
  value.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "C";

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

const ConversationInbox = ({ audience = "customer" }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const requestedStoreId = searchParams.get("storeId");
  const isManager = audience === "storeManager";
  const userId = useAuthStore((state) => state.user?.id);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setActiveConversation = useMessagingStore((state) => state.setActiveConversation);
  const openedStoreRef = useRef(null);
  const attachmentInputRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const conversationsQuery = useQuery({
    queryKey: [...QUERY_KEYS.CHAT_CONVERSATIONS, userId, audience],
    queryFn: () => chatService.getConversations(audience),
    enabled: Boolean(isAuthenticated && userId),
  });
  const conversations = conversationsQuery.data ?? EMPTY_CONVERSATIONS;

  const openConversation = useMutation({
    mutationFn: chatService.openConversation,
    onSuccess: (conversation) => {
      queryClient.setQueryData(
        [...QUERY_KEYS.CHAT_CONVERSATIONS, userId, audience],
        (current = []) => [
          conversation,
          ...current.filter((item) => item.id !== conversation.id),
        ]
      );
      setActiveId(conversation.id);
      setMobileChatOpen(true);
      void queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.CHAT_CONVERSATIONS, userId, audience],
      });
    },
    onError: (error) => {
      openedStoreRef.current = null;
      toast.error(error.response?.data?.message || "Không mở được cuộc trò chuyện");
    },
  });
  const mutateOpenConversation = openConversation.mutate;

  useEffect(() => {
    if (!requestedStoreId || isManager || openedStoreRef.current === requestedStoreId) return;
    openedStoreRef.current = requestedStoreId;
    mutateOpenConversation(requestedStoreId);
  }, [requestedStoreId, isManager, mutateOpenConversation]);

  useEffect(() => {
    if (requestedStoreId || activeId || !conversations.length) return;
    setActiveId(conversations[0].id);
  }, [requestedStoreId, activeId, conversations]);

  useEffect(() => {
    setActiveConversation(audience, activeId);
    if (activeId) {
      void chatService.markConversationRead(activeId)
        .then(() => Promise.all([
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_CONVERSATIONS }),
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_UNREAD(userId) }),
        ]))
        .catch((error) => console.error("Không đánh dấu được tin nhắn đã đọc:", error));
    }
    return () => setActiveConversation(audience, null);
  }, [audience, activeId, setActiveConversation, queryClient, userId]);

  const messagesQuery = useQuery({
    queryKey: QUERY_KEYS.CHAT_MESSAGES(activeId),
    queryFn: () => chatService.getMessages(activeId, 0, 50),
    enabled: Boolean(isAuthenticated && activeId),
  });

  const activeConversation = conversations.find((item) => item.id === activeId)
    || (openConversation.data?.id === activeId ? openConversation.data : null);
  const displayName = activeConversation
    ? getDisplayName(activeConversation, isManager) || "Người dùng"
    : "";
  const messageItems = [...(messagesQuery.data?.content || [])]
    .reverse()
    .map((message) => ({
      ...message,
      from: message.senderId === userId ? "me" : "other",
      text: message.content,
      time: formatTime(message.createdAt),
    }));

  const visibleConversations = useMemo(
    () => conversations.filter((conversation) =>
      (getDisplayName(conversation, isManager) || "")
        .toLowerCase().includes(search.toLowerCase())),
    [conversations, isManager, search]
  );

  const selectConversation = (conversation) => {
    setActiveId(conversation.id);
    setMobileChatOpen(true);
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const content = draft.trim();
    if ((!content && !selectedFile) || !activeId || isUploading) return;

    setIsUploading(Boolean(selectedFile));
    try {
      const attachment = selectedFile
        ? await chatService.uploadAttachment(activeId, selectedFile)
        : null;

      const sent = publishRealtime("/app/chat.send", {
        conversationId: activeId,
        content,
        attachmentUrl: attachment?.url,
        attachmentName: attachment?.name,
        attachmentContentType: attachment?.contentType,
      });
      if (!sent) {
        toast.error("Chat đang kết nối lại. Tệp đã tải lên; hãy bấm gửi lại.");
        return;
      }
      setDraft("");
      setSelectedFile(null);
      if (attachmentInputRef.current) attachmentInputRef.current.value = "";
    } catch (error) {
      toast.error(error.response?.data?.message || "Không gửi được tin nhắn hoặc tệp đính kèm");
    } finally {
      setIsUploading(false);
    }
  };

  const chooseAttachment = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const supportedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!supportedTypes.includes(file.type)) {
      toast.error("Chỉ hỗ trợ ảnh JPG, PNG, WEBP hoặc PDF");
      event.target.value = "";
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Tệp đính kèm tối đa 8 MB");
      event.target.value = "";
      return;
    }
    setSelectedFile(file);
  };

  return (
    <section className="mx-auto flex h-[calc(100dvh-7.5rem)] min-h-[520px] max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-[calc(100dvh-9rem)]">
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
        <div>
          <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
            {isManager ? "Tin nhắn với khách hàng" : "Tin nhắn với cửa hàng"}
          </h1>
          <p className="mt-1 text-xs text-slate-500">Tin nhắn được lưu trong tài khoản của bạn</p>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)]">
        <aside className={`${mobileChatOpen ? "hidden md:flex" : "flex"} min-h-0 flex-col border-r border-slate-100`}>
          <div className="p-3">
            <label className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-slate-400 ring-1 ring-slate-100 focus-within:ring-indigo-200">
              <SearchIcon sx={{ fontSize: 18 }} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm cuộc trò chuyện" className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
            </label>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {visibleConversations.map((conversation) => {
              const name = getDisplayName(conversation, isManager) || "Người dùng";
              return (
                <button key={conversation.id} type="button" onClick={() => selectConversation(conversation)} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${activeId === conversation.id ? "bg-indigo-50/70" : ""}`}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">{getInitials(name)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-slate-800">{name}</span>
                      <span className="text-[10px] text-slate-400">{formatTime(conversation.lastMessageAt)}</span>
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">{conversation.lastMessage || "Chưa có tin nhắn"}</span>
                  </span>
                  {conversation.unreadCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">{conversation.unreadCount}</span>}
                </button>
              );
            })}
            {!visibleConversations.length && !conversationsQuery.isLoading && (
              <p className="px-5 py-8 text-center text-sm text-slate-400">
                {conversationsQuery.isError ? "Không tải được cuộc trò chuyện" : "Chưa có cuộc trò chuyện"}
              </p>
            )}
          </div>
        </aside>

        <main className={`${mobileChatOpen ? "flex" : "hidden md:flex"} min-h-0 min-w-0 flex-col bg-[#fbfcff]`}>
          {activeConversation ? <>
            <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-3 py-3 sm:px-5">
              <button type="button" onClick={() => setMobileChatOpen(false)} aria-label="Quay lại danh sách" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"><ArrowBackRoundedIcon /></button>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">{getInitials(displayName)}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
                <p className="truncate text-xs text-slate-500">{isManager ? "Khách hàng" : "Cửa hàng"}</p>
              </div>
              {activeConversation.storeId && <button type="button" onClick={() => navigate(`/store/${activeConversation.storeId}`)} title="Xem shop" aria-label="Xem shop" className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 p-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 sm:px-3 sm:py-2"><StorefrontOutlinedIcon sx={{ fontSize: 16 }} /><span className="hidden sm:inline">Xem shop</span></button>}
              <button type="button" aria-label="Tùy chọn" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><MoreHorizRoundedIcon /></button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6">
              {messagesQuery.isLoading && <p className="m-auto text-sm text-slate-400">Đang tải tin nhắn...</p>}
              {messageItems.map((message) => <div key={message.id} className={`flex ${message.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm sm:max-w-[72%] ${message.from === "me" ? "rounded-br-md bg-indigo-600 text-white" : "rounded-bl-md border border-slate-100 bg-white text-slate-700"}`}>
                  {message.text && <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.text}</p>}
                  {message.attachmentUrl && (message.attachmentContentType || "").startsWith("image/") && (
                    <a href={message.attachmentUrl} target="_blank" rel="noreferrer" className="mt-1 block">
                      <img src={message.attachmentUrl} alt={message.attachmentName || "Ảnh đính kèm"} className="max-h-64 max-w-full rounded-lg object-contain" />
                    </a>
                  )}
                  {message.attachmentUrl && !(message.attachmentContentType || "").startsWith("image/") && (
                    <a href={message.attachmentUrl} target="_blank" rel="noreferrer" className={`mt-1 block break-all text-xs underline ${message.from === "me" ? "text-indigo-100" : "text-indigo-600"}`}>
                      📎 {message.attachmentName || "Mở tệp đính kèm"}
                    </a>
                  )}
                  <p className={`mt-1 text-right text-[10px] ${message.from === "me" ? "text-indigo-100" : "text-slate-400"}`}>{message.time}</p>
                </div>
              </div>)}
              {!messagesQuery.isLoading && !messageItems.length && <div className="m-auto max-w-xs text-center"><p className="text-sm font-semibold text-slate-600">Chưa có tin nhắn</p><p className="mt-1 text-xs leading-5 text-slate-400">Gửi tin đầu tiên để bắt đầu trao đổi.</p></div>}
            </div>
            <form onSubmit={sendMessage} className="border-t border-slate-100 bg-white p-3 sm:p-4">
              <input ref={attachmentInputRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={chooseAttachment} className="hidden" />
              {selectedFile && <div className="mb-2 flex items-center justify-between gap-3 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-800">
                <span className="truncate">📎 {selectedFile.name}</span>
                <button type="button" onClick={() => { setSelectedFile(null); if (attachmentInputRef.current) attachmentInputRef.current.value = ""; }} className="shrink-0 font-bold hover:text-red-600">Gỡ</button>
              </div>}
              <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">
                <button type="button" onClick={() => attachmentInputRef.current?.click()} aria-label="Đính kèm ảnh hoặc PDF" title="Đính kèm ảnh hoặc PDF (tối đa 8 MB)" className="mb-0.5 rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"><AttachFileRoundedIcon sx={{ fontSize: 20 }} /></button>
                <textarea rows={1} value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={2000} placeholder="Nhập tin nhắn..." className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-1 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400" />
                <button type="submit" disabled={(!draft.trim() && !selectedFile) || isUploading} aria-label="Gửi tin nhắn" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white disabled:bg-indigo-300">{isUploading ? <span className="text-[10px]">...</span> : <SendRoundedIcon sx={{ fontSize: 19 }} />}</button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-400">Gửi qua kết nối realtime, lịch sử được lưu trên máy chủ</p>
            </form>
          </> : <div className="grid flex-1 place-items-center px-6 text-center text-sm text-slate-400">{conversationsQuery.isLoading ? "Đang tải cuộc trò chuyện..." : "Chọn một cuộc trò chuyện để xem tin nhắn"}</div>}
        </main>
      </div>
    </section>
  );
};

export default ConversationInbox;
