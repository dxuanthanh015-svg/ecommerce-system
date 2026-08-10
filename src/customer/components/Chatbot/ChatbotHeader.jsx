import React from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";

const ChatbotHeader = ({ onReset, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white p-4 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
          <AutoAwesomeIcon sx={{ fontSize: 20 }} />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-tight">NexCart AI</h3>
          <div className="flex items-center gap-1.5 text-[10px] text-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Powered by Gemini API</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-white/80">
        <button
          type="button"
          onClick={onReset}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Reset Conversation"
        >
          <RefreshIcon sx={{ fontSize: 18 }} />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Close"
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </button>
      </div>
    </div>
  );
};

export default ChatbotHeader;
