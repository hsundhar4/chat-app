import React, { useEffect, useState } from 'react';
import socket from '../socket';
import axios from 'axios';

function Chat({ room, username }) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    socket.emit('joinRoom', room);

    axios.get(`http://localhost:5000/api/messages/${room}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setMessages(res.data);
    });

    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('typing', ({ user }) => {
      setTypingUser(`${user} is typing...`);
      setTimeout(() => setTypingUser(''), 1000);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
    };
  }, [room]);

  const sendMessage = async () => {
    const token = localStorage.getItem('token');
    const msg = { room, user: username, text };

    await axios.post('http://localhost:5000/api/messages', msg, {
      headers: { Authorization: `Bearer ${token}` }
    });

    socket.emit('sendMessage', msg);
    setText('');
  };

  const handleTyping = () => {
    socket.emit('typing', { room, user: username });
  };

  return (
    <div>
      <h2>Room: {room}</h2>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid gray' }}>
        {messages.map((msg, i) => (
          <div key={i}><strong>{msg.user}:</strong> {msg.text}</div>
        ))}
      </div>
      <p style={{ fontStyle: 'italic', color: 'gray' }}>{typingUser}</p>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onInput={handleTyping}
        placeholder="Type message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
