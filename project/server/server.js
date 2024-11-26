import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Enable CORS for all routes
app.use(cors());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Signaling server is running' });
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    const otherUser = [...io.sockets.adapter.rooms.get(roomId) || []].find(id => id !== socket.id);
    
    if (otherUser) {
      socket.to(otherUser).emit('user-connected', socket.id);
    }
  });

  socket.on('offer', ({ target, sdp }) => {
    socket.to(target).emit('offer', { sdp, from: socket.id });
  });

  socket.on('answer', ({ target, sdp }) => {
    socket.to(target).emit('answer', { sdp, from: socket.id });
  });

  socket.on('ice-candidate', ({ target, candidate }) => {
    socket.to(target).emit('ice-candidate', { candidate, from: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});