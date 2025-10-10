import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EnterIdPage() {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId.trim()) {
      navigate(`/leagues?userId=${userId}`);
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Enter Your FPL ID</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter FPL ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
        <button type="submit" style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}>
          View Leagues
        </button>
      </form>
    </div>
  );
}
