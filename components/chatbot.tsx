"use client";

import { useEffect, useRef, useState } from "react";
import { X, MessageSquare, Send, Sparkles, Bot, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showText, setShowText] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { from: "user" | "bot"; text: string; id: number }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setShowText(true);
    }, 10000);
  }, []);

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
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-2xl hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 ring-blue-500/30"
          >
            {/* animated outer ring */}
            <span
              className="absolute inset-0 rounded-full ring-2 ring-blue-500/20 animate-pulse-slow"
              aria-hidden
            />
            {/* Animated teaser tooltip */}
            {showText && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="absolute -top-14 right-0"
              >
                <div className="relative bg-gradient-to-br from-gray-900/95 via-blue-900/20 to-gray-900/95 border border-blue-500/30 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md">
                  {/* Content */}
                  <div className="relative flex items-center gap-2">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                      className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                    <p className="text-xs font-semibold bg-clip-text text-gray-300 bg-gradient-to-r from-blue-400 to-purple-400 whitespace-nowrap">
                      Know more about me
                    </p>
                  </div>

                  {/* Arrow pointing to button */}
                  <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-gray-900 border-r border-b border-blue-500/30 transform rotate-45" />
                </div>
              </motion.div>
            )}
            <MessageSquare className="w-6 h-6 z-10 hover:scale-115 ease-in-out cursor-pointer transition-transform " />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-5 left-0 right-0 md:left-auto md:right-5 mx-auto md:mx-0 z-50 w-[95vw] md:w-[400px] max-w-[95vw] h-[70vh] md:h-[600px] bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 bg-gray-900 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-gray-900 rounded-full"></span>
                  <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                    <Bot className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Assistant</h3>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Online & Ready
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Messages area */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            >
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-2 border border-gray-700">
                    <Smile className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      Hello there! 👋
                    </p>
                    <p className="text-sm text-gray-400 max-w-[200px] mx-auto mt-1">
                      I'm here to help you explore my portfolio. Ask me
                      anything!
                    </p>
                  </div>
                </motion.div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 450, damping: 28 }}
                    className={`flex ${
                      m.from === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <motion.div
                      whileHover={
                        m.from === "user"
                          ? { scale: 1.03 }
                          : {
                              y: -4,
                              boxShadow: "0 8px 24px rgba(99,102,241,0.12)",
                            }
                      }
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                        m.from === "user"
                          ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-sm"
                          : "bg-gray-800 text-gray-200 rounded-bl-sm border border-gray-700"
                      }`}
                    >
                      {m.from === "bot" ? (
                        <FormattedText text={m.text} />
                      ) : (
                        m.text
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex gap-1.5">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0,
                        }}
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-gray-800 bg-gray-900">
              <div className="flex gap-3 items-center bg-gray-800 border border-gray-700 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all duration-300">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type a message..."
                  disabled={isTyping}
                  className="flex-1 bg-transparent text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white transition-colors flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
