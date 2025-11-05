import React, { useState, useEffect } from "react";
import axios from "axios";

function ChatBot({ leagueId }) {
  const [userMessage, setUserMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const sessionId = `fpl-session-${leagueId}`;

  useEffect(() => {
    const uploadLeagueData = async () => {
      try {
        await axios.post(`http://localhost:5176/api/upload-league-data/${leagueId}`);
        console.log("League data uploaded to Chatbase.");
      } catch (error) {
        console.error("Error uploading league data:", error.response?.data || error.message);
      }
    };

    uploadLeagueData();
  }, [leagueId]);

const handleSend = async () => {
  if (!userMessage.trim()) return;

  const updatedChatLog = [...chatLog, { sender: "user", text: userMessage }];

  const messages = updatedChatLog.map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text
  }));

  try {
    const response = await axios.post(
      "https://www.chatbase.co/api/v1/chat",
      {
        chatbotId: "Y_wFcvfUyVd9F9F4-vRdw",
        messages
      },
      {
        headers: {
          Authorization: "Bearer e573ec81-c622-43f6-b9e2-9edcb20d298b",
          "Content-Type": "application/json"
        }
      }
    );

    const botReply = response.data.text || "No response";
    setChatLog([...updatedChatLog, { sender: "bot", text: botReply }]);
  } catch (error) {
    console.error("Chatbase error:", error.response?.data || error.message);
    setChatLog([...updatedChatLog, { sender: "bot", text: "Sorry, something went wrong." }]);
  }

  setUserMessage("");
};



  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>CHATBOT</h2>
      <p>How can I assist you today?</p>
      <p>LeagueId: {leagueId}</p>
      <div style={{ marginBottom: "1rem" }}>
        {chatLog.map((msg, index) => (
          <p key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message here..."
        style={{ width: "80%", padding: "10px", fontSize: "16px" }}
      />
      <button
        onClick={handleSend}
        style={{ padding: "10px 20px", marginLeft: "10px", fontSize: "16px" }}
      >
        Send
      </button>
    </div>
  );
}

export default ChatBot;
