import React, { useState } from "react";
import axios from "axios";

function ChatBot({ leagueId }) {
  const [userMessage, setUserMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const handleSend = async () => {
    if (!userMessage.trim()) return;

    // Add user message to chat log
    setChatLog((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      const response = await axios.post(
        "https://www.chatbase.co/api/v1/chat",
        {
          messages: [{ role: "user", content: userMessage }],
          chatbotId: "Y_wFcvfUyVd9F9F4-vRdw",
        },
{
           headers: {
      Authorization: "Bearer e573ec81-c622-43f6-b9e2-9edcb20d298b",
      "Content-Type": "application/json"
    }}
      );
    console.log("Chatbase response:", response.data);
      const botReply = response?.data?.text || "No response";

      setChatLog((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Chatbase error:", error);
      setChatLog((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
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
