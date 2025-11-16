"use client";

import { useEffect, useRef, useState } from "react";
import { X, MessageSquare, Send, Sparkles, Bot } from "lucide-react";

// Small helper to render simple markdown-like text coming from the agent.
function FormattedText({ text }: { text: string }) {
  // Split into lines to detect numbered lists
  const lines = text.split(/\r?\n/);

  const content: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const listMatch = line.match(/^\s*\d+\.\s+(.*)/);
    if (listMatch) {
      // Collect consecutive numbered list items
      const items: string[] = [listMatch[1]];
      i++;
      while (i < lines.length) {
        const nextMatch = lines[i].match(/^\s*\d+\.\s+(.*)/);
        if (nextMatch) {
          items.push(nextMatch[1]);
          i++;
        } else break;
      }
      content.push(
        <ol className="list-decimal list-inside ml-4" key={i}>
          {items.map((it, idx) => (
            <li key={idx} className="mb-1">
              {renderInline(it)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Normal paragraph/line
    if (line.trim() === "") {
      content.push(<br key={i} />);
    } else {
      content.push(
        <p className="m-0 text-sm leading-snug" key={i}>
          {renderInline(line)}
        </p>
      );
    }
    i++;
  }

  return <div className="whitespace-pre-wrap">{content}</div>;
}

function renderInline(text: string): React.ReactNode {
  // Replace **bold** with <strong>
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const boldRegex = /\*\*(.+?)\*\*/g;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = boldRegex.exec(text)) !== null) {
    const idx = match.index;
    if (idx > lastIndex) {
      parts.push(text.slice(lastIndex, idx));
    }
    parts.push(
      <strong key={"b" + key} className="font-semibold">
        {match[1]}
      </strong>
    );
    lastIndex = idx + match[0].length;
    key++;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length === 1
    ? parts[0]
    : parts.map((p, i) => <span key={i}>{p}</span>);
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { from: "user" | "bot"; text: string; id: number }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Auto-scroll to bottom when messages update
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, isTyping]);

  useEffect(() => {
    // Focus input when chat opens
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsgId = Date.now();
    setMessages((m) => [...m, { from: "user", text: trimmed, id: userMsgId }]);
    setInput("");
    setIsTyping(true);

    // Send to server API
    (async () => {
      try {
        const resp = await fetch("/api/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: trimmed, history: messages }),
        });

        const data = await resp.json();

        // Simulate a slight delay for more natural feel
        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsTyping(false);
        setMessages((cur) => [
          ...cur,
          {
            from: "bot",
            text: data.reply || data.error || "No response",
            id: Date.now(),
          },
        ]);
      } catch (err) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsTyping(false);
        setMessages((cur) => [
          ...cur,
          {
            from: "bot",
            text: "Sorry — something went wrong.",
            id: Date.now(),
          },
        ]);
      }
    })();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div>
      {/* Floating button with pulse animation */}
      <button
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((s) => !s)}
        className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-2xl ring-2 ring-blue-500/30 focus:outline-none focus:ring-4 transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          animation: open
            ? "none"
            : "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      >
        {!open ? (
          <MessageSquare className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
        )}
      </button>

      {/* Chat popup with slide-in animation */}
      {open && (
        <div
          className="fixed bottom-20 right-5 z-50 w-[92vw] max-w-xs md:max-w-md bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
          style={{
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {/* Header with gradient */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-500/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-sm font-semibold text-white">Chat with me</h3>
            </div>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded transition-colors duration-200 hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages area */}
          <div
            ref={listRef}
            className="h-56 overflow-y-auto px-3 py-3 space-y-3 bg-gradient-to-b from-gray-900 to-gray-950"
          >
            {messages.length === 0 && (
              <div
                className="text-center py-8 space-y-2"
                style={{
                  animation: "fadeIn 0.5s ease-out",
                }}
              >
                <Bot className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-gray-400 px-2">Say hi 👋</p>
                <p className="text-xs text-gray-500 px-2">
                  Ask about my projects or experience
                </p>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={m.id}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
                style={{
                  animation: `messageSlide 0.3s ease-out ${
                    i * 0.05
                  }s backwards`,
                }}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm shadow-md ${
                    m.from === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none"
                      : "bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700"
                  }`}
                >
                  {m.from === "bot" ? <FormattedText text={m.text} /> : m.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div
                className="flex justify-start"
                style={{
                  animation: "fadeIn 0.3s ease-out",
                }}
              >
                <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-lg rounded-bl-none shadow-md">
                  <div className="flex gap-1">
                    <div
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      style={{
                        animation: "bounce 1.4s ease-in-out infinite",
                      }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      style={{
                        animation: "bounce 1.4s ease-in-out 0.2s infinite",
                      }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      style={{
                        animation: "bounce 1.4s ease-in-out 0.4s infinite",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="px-3 py-3 border-t border-gray-800 bg-gray-900">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a message..."
                disabled={isTyping}
                className="flex-1 bg-gray-800 border border-gray-700 text-sm rounded-lg px-3 py-2 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 flex items-center gap-1 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
