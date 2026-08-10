import React, { useState, useRef, useEffect } from "react";
import ChatbotButton from "./ChatbotButton";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotMessageList from "./ChatbotMessageList";
import ChatbotInput from "./ChatbotInput";

const initialMessages = [
  {
    id: 1,
    sender: "ai",
    text: "Hello! I'm your NexCart AI Shopping Assistant powered by Gemini. How can I help you find what you need today?",
    time: "Just now"
  }
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

  const handleSendMessage = (text) => {
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulated AI Response for Gemini API Integration
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: "ai",
        text: `Thank you for asking: "${text}". I am ready to connect to your Gemini API to provide real-time recommendations and support!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleReset = () => {
    setMessages(initialMessages);
  };

  return (
    <>
      {/* Floating Action Button Sub-component */}
      <ChatbotButton isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {/* Popup Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden font-sans animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header Sub-component */}
          <ChatbotHeader onReset={handleReset} onClose={() => setIsOpen(false)} />

          {/* Messages Area Sub-component */}
          <ChatbotMessageList
            messages={messages}
            isTyping={isTyping}
            onSelectPrompt={handleSendMessage}
            messagesEndRef={messagesEndRef}
          />

          {/* Input Footer Sub-component */}
          <ChatbotInput onSendMessage={handleSendMessage} />

        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
