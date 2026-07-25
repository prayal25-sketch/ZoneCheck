require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/safety', require('./routes/safety'));
app.use('/api/firstaid', require('./routes/firstaid'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'ZoneCheck API is running' });
});

// Socket.io for Real-time alerts
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('sos:trigger', (data) => {
    console.log('SOS Triggered:', data);
    // Broadcast SOS alert to a specific room or nearby users
    io.emit('sos:received', { sosId: data.sosId, message: 'Emergency SOS Alert Received!' });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zonecheck';

// Database Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
