import { io } from "socket.io-client";

// When VITE_SERVER_URL is blank, socket.io connects to the same origin
// (nginx on port 8090) which proxies /socket.io/ → localhost:3000.
// Set VITE_SERVER_URL in client/.env to override (e.g. ngrok URL).
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "";

const socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

export default socket;
