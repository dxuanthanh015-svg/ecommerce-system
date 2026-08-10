import React from "react";

const quickPrompts = [
  "🔍 Recommend trending products",
  "📏 Size & Fit assistance",
  "📦 Track my recent order",
  "🏷️ Check active sales & discounts"
];

const ChatbotMessageList = ({ messages, isTyping, onSelectPrompt, messagesEndRef }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#f8f9fc]/50">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex flex-col ${
            msg.sender === "user" ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`max-w-[82%] px-4 py-3 text-xs sm:text-sm leading-relaxed ${
              msg.sender === "user"
                ? "bg-indigo-600 text-white rounded-2xl rounded-tr-xs shadow-xs font-normal"
                : "bg-white text-gray-800 rounded-2xl rounded-tl-xs border border-gray-100 shadow-2xs font-normal"
            }`}
          >
            {msg.text}
          </div>
          <span className="text-[9px] text-gray-400 mt-1 px-1">
            {msg.time}
          </span>
        </div>
      ))}

      {/* Quick Prompts Chips */}
      {messages.length === 1 && (
        <div className="pt-2 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
            SUGGESTIONS
          </p>
          <div className="flex flex-col gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPrompt(prompt)}
                className="bg-white hover:bg-indigo-50/50 border border-gray-200/80 text-gray-700 text-xs py-2 px-3 rounded-xl text-left font-medium transition-all cursor-pointer shadow-2xs hover:border-indigo-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center gap-1.5 bg-white px-4 py-3 rounded-2xl rounded-tl-xs border border-gray-100 w-fit">
          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatbotMessageList;
