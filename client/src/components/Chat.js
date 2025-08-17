import React, { useState, useEffect } from 'react';
import socket from '../socket';

function Chat({ room, username }) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Join room
    socket.emit('joinRoom', room);

    // Fetch existing messages
    fetch(`/api/messages/${room}`)
      .then(res => res.json())
      .then(data => setMessages(data));

    // Listen for new messages
    socket.on('messageReceived', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('messageReceived');
    };
  }, [room]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text) return;

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room, user: username, text })
    });

    const newMsg = await res.json();
    setMessages(prev => [...prev, newMsg]);
    socket.emit('newMessage', { room, user: username, text });
    setText('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Room: {room}</h2>
      <div style={{ marginBottom: '20px' }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
