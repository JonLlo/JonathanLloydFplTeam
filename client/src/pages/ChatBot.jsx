import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [league, setLeague] = useState(null);

  const sendChat = async () => {
    if (!message.trim()) return;
    setLoading(true);

    const res = await fetch("http://localhost:5176/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    //alert(JSON.stringify(data));
    setReply(data.result);
    setLoading(false);
  };

  const loadLeague = async () => {
    const res = await fetch("http://localhost:5176/api/league-data/275033");
    const json = await res.json();
    setLeague(json);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>FPL Assistant</h1>

      <button onClick={loadLeague}>Load League Data</button>
      {league && (
        <pre style={{ background: "#eee", padding: 10 }}>
          {JSON.stringify(league, null, 2)}
        </pre>
      )}

      <h2>Ask the AI</h2>
      <textarea
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about FPL..."
        style={{ width: "100%" }}
      />

      <button onClick={sendChat} style={{ marginTop: 10 }}>
        Send
      </button>

      {loading && <p>Thinking...</p>}

      {reply && (
        <div style={{ marginTop: 20, padding: 10, background: "#f8f8f8" }}>
          <h3>AI Response:</h3>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}

export default App;
