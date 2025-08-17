import { io } from 'socket.io-client';

const socket = io('https://chat-server-9n02.onrender.com');

export default socket;
