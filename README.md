# Sastra Random Chat

Anonymous random chat for Sastra University students.

## Architecture

```
Browser
  └─► nginx :8090
        ├─ /            → Vite dev-server :5173  (React frontend)
        ├─ /socket.io/  → Express :3000          (Socket.IO backend)
        └─ /api/        → Express :3000          (REST API)
```

Ngrok tunnels **port 8090** so the world sees one clean URL.

---

## Quick Start

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Configure environment
Edit **`.env`** in the project root:
```
NGROK_AUTH_TOKEN=your_real_token_here   # from https://dashboard.ngrok.com
```
Everything else is pre-set (ports 3000 / 5173 / 8090).

### 3. Start everything
```bash
chmod +x start.sh start-ngrok.sh
./start.sh
```

### 4. Expose publicly with ngrok (new terminal)
```bash
./start-ngrok.sh
```
The public URL is printed to the console and written back to `.env` as `NGROK_URL=`.

---

## Port Reference

| Service        | Port  | Note                       |
|----------------|-------|----------------------------|
| Express + WS   | 3000  | backend, not exposed       |
| Vite           | 5173  | frontend, not exposed      |
| **Nginx**      | **8090** | **single entry-point**  |
| Ngrok tunnel   | —     | wraps port 8090            |

---

## Environment Files

| File          | Purpose                                      |
|---------------|----------------------------------------------|
| `.env`        | Root config – ports, CORS, ngrok token/URL   |
| `client/.env` | VITE_SERVER_URL (leave blank for nginx)      |

---

## Manual nginx

If start.sh cannot start nginx automatically:

```bash
sudo nginx -c "$(pwd)/nginx.conf" -p "$(pwd)"
# reload:  sudo nginx -s reload
# stop:    sudo nginx -s stop
```
