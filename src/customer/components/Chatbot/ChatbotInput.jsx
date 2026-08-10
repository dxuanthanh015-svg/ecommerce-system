import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";

const ChatbotInput = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue("");
  };

  return (
    <div className="p-3 bg-white border-t border-gray-100">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask Gemini AI anything..."
          className="flex-1 bg-[#f8f9fc] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 transition-all"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl p-2.5 flex items-center justify-center transition-all cursor-pointer shadow-xs"
        >
          <SendIcon sx={{ fontSize: 16 }} />
        </button>
      </form>
      <p className="text-[9px] text-gray-400 text-center mt-2">
        NexCart AI can assist with shopping & sizing.
      </p>
    </div>
  );
};

export default ChatbotInput;
