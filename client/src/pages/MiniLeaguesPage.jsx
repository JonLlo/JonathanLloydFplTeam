import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MiniLeaguesPage() {
  const [leagues, setLeagues] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get("userId");

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const res = await fetch(`http://localhost:5176/api/user-leagues/${userId}`);
        const data = await res.json();
        setLeagues(data);
      } catch (err) {
        console.error("Error fetching leagues:", err);
      }
    };
    if (userId) fetchLeagues();
  }, [userId]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Your Mini Leagues</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {leagues.map((league) => (
          <li
            key={league.id}
            style={{ cursor: "pointer", margin: "1rem 0", fontSize: "1.2rem", color: "blue" }}
            onClick={() => navigate(`/league/${league.id}`)}
          >
            {league.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
