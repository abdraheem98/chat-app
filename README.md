# 💬 Docker Chat App

Realtime chat application built with Node.js, Socket.IO, React, and MongoDB.

## Project Structure

```
chat-app/
├── backend/
│   ├── src/index.js       → Express + Socket.IO server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js         → React chat UI
│   │   └── index.js
│   ├── public/index.html
│   └── package.json
└── README.md
```

## Run Locally (without Docker)

```bash
# Terminal 1 — MongoDB
mongod

# Terminal 2 — Backend
cd backend
npm install
npm start

# Terminal 3 — Frontend
cd frontend
npm install
npm start
```

Open http://localhost:3000

## Stack
- Frontend : React + Socket.IO client
- Backend  : Node.js + Express + Socket.IO
- Database : MongoDB + Mongoose
