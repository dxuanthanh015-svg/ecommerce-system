import React from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";

const ChatbotButton = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full p-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer group"
      aria-label="Open NexCart AI Chat"
    >
      {isOpen ? (
        <CloseIcon sx={{ fontSize: 24 }} />
      ) : (
        <div className="flex items-center gap-2">
          <AutoAwesomeIcon className="animate-pulse" sx={{ fontSize: 22 }} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-xs font-bold tracking-wider">
            NexCart AI
          </span>
        </div>
      )}
    </button>
  );
};

export default ChatbotButton;
