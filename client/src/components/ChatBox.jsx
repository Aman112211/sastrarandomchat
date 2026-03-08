import React, { useEffect, useRef } from "react";

export default function ChatBox({ messages, isTyping, partnerZone, zone }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="chatbox">
      {/* Connection banner */}
      <div className="connection-banner">
        <span className="banner-dot" />
        You are now chatting with a stranger
        {partnerZone && partnerZone !== "Campus" && (
          <span className="zone-badge">📍 Near {partnerZone}</span>
        )}
        {zone && zone !== "Campus" && (
          <span className="zone-badge zone-badge--self">You: {zone}</span>
        )}
      </div>

      {/* Message list */}
      <div className="message-list">
        {messages.length === 0 && (
          <div className="empty-chat">
            <span className="empty-icon">👋</span>
            <p>Say hi to your new chat partner!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-bubble message-bubble--${msg.from}`}
          >
            <span className="message-label">
              {msg.from === "me" ? "You" : "Stranger"}
            </span>
            <p className="message-text">{msg.text}</p>
            <span className="message-time">{msg.time}</span>
          </div>
        ))}

        {isTyping && (
          <div className="typing-indicator">
            <span />
            <span />
            <span />
            <p>Stranger is typing…</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
