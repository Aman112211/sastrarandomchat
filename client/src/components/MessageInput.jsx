import React, { useState, useRef } from "react";

export default function MessageInput({ onSend, onTyping, disabled }) {
  const [text, setText] = useState("");
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  function handleChange(e) {
    setText(e.target.value);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTyping(true);
    }

    // Stop typing indicator after 1.5 s of inactivity
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTyping(false);
    }, 1500);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    clearTimeout(typingTimerRef.current);
    isTypingRef.current = false;
    onTyping(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <textarea
        className="message-textarea"
        placeholder={disabled ? "Waiting for a partner…" : "Type a message…"}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        maxLength={1000}
      />
      <button
        type="submit"
        className="btn btn-send"
        disabled={disabled || !text.trim()}
        aria-label="Send message"
      >
        ➤
      </button>
    </form>
  );
}
