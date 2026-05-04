const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chatdb';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

const MessageSchema = new mongoose.Schema({
  username: String,
  text: String,
  room: { type: String, default: 'general' },
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

app.get('/messages/:room', async (req, res) => {
  const messages = await Message.find({ room: req.params.room })
    .sort({ timestamp: 1 })
    .limit(50);
  res.json(messages);
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

io.on('connection', (socket) => {
  console.log(`🔌 Connected: ${socket.id}`);

  socket.on('join_room', async ({ username, room }) => {
    socket.join(room);
    socket.data.username = username;
    socket.data.room = room;
    socket.to(room).emit('user_joined', { username });
    console.log(`👤 ${username} joined: ${room}`);
  });

  socket.on('send_message', async ({ username, text, room }) => {
    const message = await Message.create({ username, text, room });
    io.to(room).emit('receive_message', {
      _id: message._id,
      username,
      text,
      room,
      timestamp: message.timestamp
    });
  });

  socket.on('disconnect', () => {
    const { username, room } = socket.data;
    if (username && room) {
      socket.to(room).emit('user_left', { username });
    }
    console.log(`❌ Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
