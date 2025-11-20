import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function Chatbot() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const chatEndRef = useRef(null);

  // Scroll to bottom whenever chatLog updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const sendMessage = async () => {
    if (!message) return;

    // Add user's message to chat log
    setChatLog(prev => [...prev, { sender: 'user', text: message }]);

    try {
      // Send message to backend
      const res = await axios.post('http://localhost:5176/api/chat', { message });

      // Add bot's reply to chat log
      setChatLog(prev => [...prev, { sender: 'bot', text: res.data.result }]);

      // Clear input
      setMessage('');
    } catch (err) {
      console.error(err);
      setChatLog(prev => [...prev, { sender: 'bot', text: 'Error contacting API.' }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ width: '400px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>FPL Chatbot</h2>

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '10px',
          height: '300px',
          overflowY: 'auto',
          marginBottom: '10px',
          backgroundColor: '#f9f9f9',
        }}
      >
        {chatLog.map((msg, i) => (
          <div key={i} style={{ marginBottom: '8px' }}>
            <b>{msg.sender}:</b> {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '8px', fontSize: '14px' }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: '8px 12px', marginLeft: '5px', cursor: 'pointer' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
