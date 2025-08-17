import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  if (!token) return <Login setToken={setToken} setUsername={setUsername} />;
  if (!room) return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Welcome, {username}</h2>
      <input
        placeholder="Enter Room Name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={() => setRoom(room)}>Join</button>
    </div>
  );

  return <Chat room={room} username={username} />;
}

export default App;
