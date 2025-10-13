import { useState } from "react";
import { useNavigate } from "react-router-dom";


function HomePage() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Navigate to the choose-league page with userId in the URL
      navigate(`/choose-league/${input.trim()}`);
    }
  };

  return (
    <div className="container">
      <h1 className="home-title">Enter Your FPL ID</h1>
      <form className="home-form" onSubmit={handleSubmit}>
        <input
          type="number"
          className="home-input"
          placeholder="Enter FPL ID"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="home-button">
          View Leagues
        </button>
      </form>
    </div>
  );
}

export default HomePage;
