import React, { useState, useRef, useEffect } from "react";
import ChatbotButton from "./ChatbotButton";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotMessageList from "./ChatbotMessageList";
import ChatbotInput from "./ChatbotInput";
import { product_mock_data } from "../../../Data/product_mock_data.js";
import { callGrok } from "./grokService";

const createMessage = (sender, text) => ({
  id: Date.now() + Math.random(),
  sender,
  text,
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
});

const initialMessages = [
  {
    id: 1,
    sender: "ai",
    text: "Hello! I'm your NexCart AI Shopping Assistant powered by Grok. How can I help you find what you need today?",
    time: "Just now",
  },
];

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text) => {
    if (!text || !text.trim()) return;

    const cleanText = text.trim();
    const userMsg = createMessage("user", cleanText);

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const aiResponseText = await callGrok(cleanText, product_mock_data, messages);
      setMessages((prev) => [...prev, createMessage("ai", aiResponseText)]);
    } catch (error) {
      console.error("Error fetching from Grok:", error);
      setMessages((prev) => [
        ...prev,
        createMessage("ai", "Xin lỗi, hệ thống đang gặp sự cố khi kết nối Grok. Bạn vui lòng thử lại sau."),
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages(initialMessages);
  };

  return (
    <>
      <ChatbotButton isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden font-sans animate-in fade-in slide-in-from-bottom-5 duration-300">
          <ChatbotHeader onReset={handleReset} onClose={() => setIsOpen(false)} />

          <ChatbotMessageList
            messages={messages}
            isTyping={isTyping}
            onSelectPrompt={handleSendMessage}
            messagesEndRef={messagesEndRef}
          />

          <ChatbotInput onSendMessage={handleSendMessage} />
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
