import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage({ setUserId }) {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setUserId(input);          // store in parent
      navigate("/choose-league"); // go to next page
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Enter Your FPL ID</h1>
      <form onSubmit={

        handleSubmit
        
        }>
        <input
          type="number"
          placeholder="Enter FPL ID"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
        <button type="submit" style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}>
          View Leagues
        </button>
      </form>
    </div>
  );
}

export default HomePage;
