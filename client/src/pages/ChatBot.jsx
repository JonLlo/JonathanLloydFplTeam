

function ChatBot({ leagueId }) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>CHATBOT</h2>
      <p>How can I assist you today?</p>
      <p>LeagueId: {leagueId}</p>
      <br />
      <input
        type="text"
        placeholder="Type your message here..."
        style={{ width: "80%", padding: "10px", fontSize: "16px" }}
      />
      <button
        style={{ padding: "10px 20px", marginLeft: "10px", fontSize: "16px" }}
      >
        Send
      </button>
    </div>
  );
}

export default ChatBot;