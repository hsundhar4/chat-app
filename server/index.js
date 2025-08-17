require('dotenv').config(); // Load .env variables

const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);

// ✅ CORS Configuration
const allowedOrigins = ['http://localhost:3000', 'https://your-frontend-url.com']; // Add your deployed frontend URL here
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// ✅ API Routes
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

// ✅ Socket.IO setup
const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ Socket.IO logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('sendMessage', (msg) => {
    io.to(msg.room).emit('receiveMessage', msg);
  });

  socket.on('typing', ({ room, user }) => {
    socket.to(room).emit('typing', { user });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
