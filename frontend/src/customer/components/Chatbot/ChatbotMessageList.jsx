import React from "react";

const quickPrompts = [
  "🔍 Recommend trending products",
  "📏 Size & Fit assistance",
  "📦 Track my recent order",
  "🏷️ Check active sales & discounts"
];

const renderMessageContent = (text) => {
  if (!text) return null;

  // 🟢 Regex cải tiến: Cờ 's' (dotAll) để bắt được cả ký tự xuống dòng \n trong alt text
  const imgRegex = /!\[([\s\S]*?)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = imgRegex.exec(text)) !== null) {
    // Đưa đoạn chữ nằm trước ảnh vào mảng
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: text.substring(lastIndex, match.index),
      });
    }

    // Đưa ảnh vào mảng
    parts.push({
      type: "image",
      alt: match[1].trim(),
      url: match[2].trim(),
    });

    lastIndex = imgRegex.lastIndex;
  }

  // Đưa đoạn chữ còn lại phía sau ảnh vào mảng
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.substring(lastIndex),
    });
  }

  // Nếu không phát hiện Markdown Image nào, render text thông thường
  if (parts.length === 0) {
    return <span className="whitespace-pre-wrap">{text}</span>;
  }

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <span key={index} className="whitespace-pre-wrap">
              {part.content}
            </span>
          );
        }

        if (part.type === "image") {
          return (
            <div
              key={index}
              className="my-2.5 overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-gray-50 max-w-full"
            >
              <img
                src={part.url}
                alt={part.alt || "Product image"}
                className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300 block"
                loading="lazy"
                onError={(e) => {
                  // Thay vì ẩn hoàn toàn, log lỗi hoặc hiện placeholder nếu URL ảnh bị chết
                  console.error("Lỗi tải ảnh:", part.url);
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                }}
              />
              {part.alt && (
                <p className="p-2 text-[11px] font-semibold text-gray-700 bg-white text-center border-t border-gray-100 truncate">
                  {part.alt}
                </p>
              )}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

const ChatbotMessageList = ({ messages, isTyping, onSelectPrompt, messagesEndRef }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#f8f9fc]/50">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"
            }`}
        >
          <div
            className={`max-w-[85%] px-4 py-3 text-xs sm:text-sm leading-relaxed ${msg.sender === "user"
                ? "bg-indigo-600 text-white rounded-2xl rounded-tr-xs shadow-xs font-normal"
                : "bg-white text-gray-800 rounded-2xl rounded-tl-xs border border-gray-100 shadow-2xs font-normal"
              }`}
          >
            {renderMessageContent(msg.text)}
          </div>
          <span className="text-[9px] text-gray-400 mt-1 px-1">
            {msg.time}
          </span>
        </div>
      ))}

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
