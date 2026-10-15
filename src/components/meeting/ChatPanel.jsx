"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

/**
 * ChatPanel — meeting chat that shares the socket from useWebRTC
 * instead of creating its own connection.
 *
 * @param {Object} props
 * @param {string} props.meetingId
 * @param {string} props.name — local user display name
 * @param {React.MutableRefObject} props.socketRef — shared socket ref from useWebRTC
 * @param {() => void} props.onClose
 */
export default function ChatPanel({ meetingId, name, socketRef, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [online, setOnline] = useState(false);
  const bottomRef = useRef(null);
  const listenerAttached = useRef(false);

  // Load existing messages + attach socket listener
  useEffect(() => {
    // Load history
    api(`/meetings/${meetingId}/messages`)
      .then(({ messages: msgs }) => setMessages(msgs || []))
      .catch(() => {});

    const socket = socketRef?.current;
    if (!socket) return;

    setOnline(socket.connected);

    function onConnect() {
      setOnline(true);
    }
    function onDisconnect() {
      setOnline(false);
    }
    function onChatMessage(msg) {
      setMessages((prev) => [...prev, msg]);
    }

    // Guard against duplicate listeners when React strict mode double-mounts
    if (!listenerAttached.current) {
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("chat-message", onChatMessage);
      listenerAttached.current = true;
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat-message", onChatMessage);
      listenerAttached.current = false;
    };
  }, [meetingId, socketRef]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !socketRef?.current?.connected) return;
    socketRef.current.emit("chat-message", {
      meetingId,
      message: trimmed,
      name,
    });
    setText("");
  }

  return (
    <aside className="fixed bottom-0 right-0 z-30 flex h-96 w-80 flex-col rounded-tl-2xl border-l border-t border-slate-700 bg-slate-900 shadow-2xl sm:bottom-4 sm:right-4 sm:rounded-2xl sm:border">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">💬 Chat</span>
          <span
            className={`h-2 w-2 rounded-full ${
              online ? "bg-emerald-400" : "bg-red-400"
            }`}
          />
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
        {messages.length === 0 && (
          <p className="text-center text-slate-500 text-xs mt-4">
            No messages yet. Start the conversation!
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={msg._id || i}>
            <p className="text-xs text-slate-400">
              <strong className="text-slate-200">{msg.senderName}</strong>
              {msg.createdAt && (
                <span className="ml-2">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </p>
            <p className="mt-0.5 text-slate-300">{msg.message}</p>
          </div>
        ))}
        <span ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={send}
        className="flex gap-2 border-t border-slate-700 px-3 py-3"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-w-0 flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Type a message…"
          maxLength={1500}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </aside>
  );
}
