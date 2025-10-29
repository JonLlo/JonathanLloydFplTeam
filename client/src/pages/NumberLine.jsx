// src/pages/NumberLinePage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function NumberLinePage() {
  const { leagueId } = useParams();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeagueData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5176/api/league-data/${leagueId}`);
        if (!res.ok) throw new Error("Failed to fetch league data");

        const data = await res.json();
        const playerTotals = data.standings.results.map((p) => ({
          name: p.player_name,
          total: p.total,
        }));

        setPlayers(playerTotals);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueData();
  }, [leagueId]);

  if (loading) return <p>Loading league data...</p>;
  if (error) return <p>Error: {error}</p>;

  const minPoints = Math.min(...players.map((p) => p.total));
  const maxPoints = Math.max(...players.map((p) => p.total));

  return (
    <div className="numberline-page" >
      <h1>Number Line: League {leagueId}</h1>

      <div
        className="numberline-line"

      >
        {players.map((player) => {
          const percent = ((player.total - minPoints) / (maxPoints - minPoints)) * 100;

          return (
            <div className="numberline-text"
              key={player.name}
              style={{left: `${percent}%`}}>
              <div className = "numberline-dot"></div>


      
              <div className = "numberline-label" style={{ transform: "translateX(-2%) translateX(-10px)" }}>
                {player.name.split(" ").map((part, index) => (
                  <div key={index} style={{ fontSize: 12 }}>
                    {part}
                  </div>
                ))}
                <div style={{ fontSize: 12 }}>{player.total} pts</div>
              </div>
            </div>

          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <span>{minPoints}</span>
        <span>{maxPoints}</span>
      </div>
    </div>
  );
}

export default NumberLinePage;
