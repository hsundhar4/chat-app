import { io } from 'socket.io-client';

const SOCKET_URL = 'https://chat-server-9n02.onrender.com';

const socket = io(SOCKET_URL, {
  transports: ['websocket'], // Optional: ensures stable connection
  withCredentials: true // Matches backend CORS config
});

export default socket;
