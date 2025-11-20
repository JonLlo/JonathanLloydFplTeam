// Chatbot.jsx
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../styles/Chatbot.css'

export default function Chatbot() {
  const [message, setMessage] = useState('');
  const [leagueId, setLeagueId] = useState('275033'); 
  const [chatLog, setChatLog] = useState([]);
  const chatEndRef = useRef(null);

  // Scroll to bottom when new message added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const sendMessage = async () => {
    if (!message) return;

    setChatLog(prev => [...prev, { sender: 'user', text: message }]);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        Message: message,
        LeagueId: leagueId,
      });

      const botReply = res.data.result;
      setChatLog(prev => [...prev, { sender: 'bot', text: botReply }]);
      setMessage('');
    } catch (err) {
      console.error(err);
      setChatLog(prev => [...prev, { sender: 'bot', text: 'Error contacting API.' }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chatbot-container">
      <h2>FPL Chatbot</h2>

      <div className="chat-window">
        {chatLog.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
          >
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your league..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
