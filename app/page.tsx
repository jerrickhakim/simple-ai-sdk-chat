"use client";

import { useEffect, useLayoutEffect, useRef, useState, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function Chat() {
  const [input, setInput] = useState("");
  const messageScrollRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, stop, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const el = messageScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };

  //
  const lastMessage = useMemo(() => {
    return messages[messages.length - 1];
  }, [messages]);

  // If you want to auto scroll to bottom use this and uncomment the requestAnimationFrame in submit
  // useEffect(() => {
  //   scrollToBottom("smooth");
  // }, [lastMessage]);

  // Auto-resize textarea up to a max height, then allow scrolling
  useLayoutEffect(() => {
    const el = textAreaRef.current;
    if (!el) return;
    const MAX_TEXTAREA_HEIGHT_PX = 300;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > MAX_TEXTAREA_HEIGHT_PX ? "auto" : "hidden";
  }, [input]);

  const submit = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage({ text });
    setInput("");
    // Scroll after React paints the new message
    requestAnimationFrame(() => scrollToBottom("smooth"));
  };

  return (
    <div className="flex flex-col flex-1 min-h-[100dvh] max-h-[100dvh] overflow-hidden w-full bg-accent">
      {/* Messages */}
      <div ref={messageScrollRef} className="flex-1 min-h-0 overflow-y-auto scroll-smooth scrollbar-hide">
        <div className="flex flex-col space-y-2 items-start p-4 h-full max-w-2xl mx-auto">
          {messages.map((m) => (
            <div key={m.id} data-message-role={m.role} className="last:min-h-[calc(100dvh-200px)]">
              {m.role === "user" ? "User: " : "AI: "}
              {m.parts.map((part, i) => (part.type === "text" ? <div key={`${m.id}-${i}`}>{part.text}</div> : null))}
            </div>
          ))}
          {error && <div className="text-sm text-red-500">{error.message}</div>}
        </div>
      </div>

      {/* Input */}
      <div className="relative bottom-0 left-0 right-0">
        <div className="max-w-2xl mx-auto my-2 p-2 backdrop-blur-xl bg-card/80 rounded-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="w-full flex flex-col"
          >
            <div className="flex flex-col items-end overflow-x-hidden h-full max-h-[300px] transition-all duration-300 relative p-[.5px] rounded-2xl border border-zinc-800">
              <textarea
                ref={textAreaRef}
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    submit();
                  }
                }}
                className="w-full rounded-t-2xl focus:outline-none p-3 resize-none overflow-y-auto text-ellipsis max-h-[300px]"
                placeholder="Type your message..."
              />

              <div className="absolute bottom-1 right-1">
                {status === "streaming" ? (
                  <button type="button" className="py-1 px-2 rounded-lg text-sm bg-red-500 text-primary-foreground" onClick={stop}>
                    Stop
                  </button>
                ) : (
                  <button type="submit" className="py-1 px-2 rounded-lg text-sm bg-primary text-primary-foreground">
                    Send
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
