import React from "react";

const quickPrompts = [
  "🔍 Recommend trending products",
  "📏 Size & Fit assistance",
  "📦 Track my recent order",
  "🏷️ Check active sales & discounts"
];

const renderInline = (text) => {
  const tokenPattern = /(!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\))|(\*\*(.+?)\*\*)|(`([^`]+)`)|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = tokenPattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));

    if (match[1]) {
      parts.push(
        <img
          key={`image-${match.index}`}
          src={match[3]}
          alt={match[2] || "Product image"}
          loading="lazy"
          className="my-2 inline-block max-h-40 max-w-full rounded-xl border border-slate-200 object-contain align-middle"
          onError={(event) => { event.currentTarget.hidden = true; }}
        />
      );
    } else if (match[4]) {
      parts.push(<strong key={`bold-${match.index}`} className="font-semibold text-slate-900">{match[5]}</strong>);
    } else if (match[6]) {
      parts.push(<code key={`code-${match.index}`} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.92em] text-indigo-700">{match[7]}</code>);
    } else {
      parts.push(
        <a key={`link-${match.index}`} href={match[9]} target="_blank" rel="noreferrer" className="font-medium text-indigo-600 underline decoration-indigo-200 underline-offset-2 hover:text-indigo-800">
          {match[8]}
        </a>
      );
    }
    lastIndex = tokenPattern.lastIndex;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
};

const parseBlocks = (text) => {
  const blocks = [];
  let paragraph = [];
  let list = null;
  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", lines: paragraph });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  (text || "").replace(/\r\n?/g, "\n").split("\n").forEach((line) => {
    const heading = line.match(/^\s{0,3}(#{1,3})\s+(.+)$/);
    const bullet = line.match(/^\s*[-*•]\s+(.+)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.+)$/);

    if (!line.trim()) {
      flushParagraph();
      flushList();
    } else if (/^\s*[-*_]{3,}\s*$/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push({ type: "divider" });
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
    } else if (bullet || numbered) {
      flushParagraph();
      const type = bullet ? "ul" : "ol";
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push(bullet?.[1] || numbered[1]);
    } else {
      flushList();
      paragraph.push(line);
    }
  });

  flushParagraph();
  flushList();
  return blocks;
};

const renderMessageContent = (text) => parseBlocks(text).map((block, index) => {
  if (block.type === "divider") {
    return <hr key={`divider-${index}`} className="my-2 border-slate-200" />;
  }
  if (block.type === "heading") {
    const Heading = block.level === 1 ? "h3" : "h4";
    return <Heading key={`heading-${index}`} className="mb-1.5 mt-2 font-bold leading-snug text-slate-900 first:mt-0">{renderInline(block.text)}</Heading>;
  }
  if (block.type === "ul" || block.type === "ol") {
    const List = block.type === "ul" ? "ul" : "ol";
    return (
      <List key={`list-${index}`} className={`my-1.5 space-y-1 pl-5 ${block.type === "ul" ? "list-disc" : "list-decimal"}`}>
        {block.items.map((item, itemIndex) => <li key={`item-${itemIndex}`} className="pl-0.5">{renderInline(item)}</li>)}
      </List>
    );
  }
  return (
    <p key={`paragraph-${index}`} className="my-1 whitespace-pre-wrap leading-relaxed first:mt-0 last:mb-0">
      {block.lines.map((line, lineIndex) => <React.Fragment key={`line-${lineIndex}`}>{lineIndex > 0 && <br />}{renderInline(line)}</React.Fragment>)}
    </p>
  );
});

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
            className={`max-w-[90%] px-4 py-3 text-xs sm:text-sm leading-relaxed ${msg.sender === "user"
                ? "bg-indigo-600 text-white rounded-2xl rounded-tr-xs shadow-xs font-normal"
                : "bg-white text-gray-700 rounded-2xl rounded-tl-xs border border-gray-100 shadow-2xs font-normal [&_strong]:text-gray-900"
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
