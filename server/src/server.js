const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { registerSocketHandlers } = require("./socket/socketHandler");

const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || ["http://localhost:8090", "https://unwakeful-overgently-sutton.ngrok-free.dev"];

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

registerSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`Sastra Random Chat server running on port ${PORT}`);
});
