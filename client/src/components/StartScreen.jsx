import React from "react";

export default function StartScreen({ onStart, isConnecting }) {
  return (
    <div className="start-screen">
      <div className="logo-area">
        <div className="logo-icon">💬</div>
        <h1 className="app-title">SastraChat</h1>
        <p className="app-subtitle">Anonymous random chat for Sastra University students</p>
      </div>

      <div className="features">
        <div className="feature-item">
          <span className="feature-icon">🎲</span>
          <span>Instantly matched with a random Sastra student</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">📍</span>
          <span>Location-based matching on campus</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🔒</span>
          <span>Fully anonymous — no sign-up needed</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">⚡</span>
          <span>Real-time messaging</span>
        </div>
      </div>

      <button
        className="btn btn-primary btn-large"
        onClick={onStart}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <span className="spinner" /> Connecting…
          </>
        ) : (
          "Start Chat"
        )}
      </button>

      <p className="disclaimer">
        By using SastraChat you agree to be respectful and follow university
        guidelines. Inappropriate behaviour will result in a ban.
      </p>
    </div>
  );
}
