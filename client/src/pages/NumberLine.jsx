import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from "recharts";
import arsenalImg from '../img/arsenal.png';


function NumberLinePage() {



const [selectedPlayer, setSelectedPlayer] = useState(null);
const renderDot = ({ cx, cy, payload }) => {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5 * zoomRank} // zoom-scaled radius
      fill="dodgerblue"
      style={{ cursor: 'pointer' }}
      onClick={() => setSelectedPlayer(payload)} // set selected player on click
    />
  );
};



useEffect(() => {
  if (!selectedPlayer) return;

  const fetchPlayerData = async () => {
    console.log("Fetching data for player:", selectedPlayer);
    const res = await fetch(`http://localhost:5176/api/user-history/${selectedPlayer.entry}`);
    const data = await res.json();
    // set state to show more info in the card
  };

  fetchPlayerData();
}, [selectedPlayer]);

  const { leagueId } = useParams();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [zoomRank, setZoomRank] = useState(1); // 1x = default
  const zoomStep = 0.2;
  const chartScrollRef = useRef(null);

  // Reset Scrolll
  useEffect(() => {
    const container = chartScrollRef.current;
    if (!container) return;
    // Center the chart when zoom changes
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
  }, [zoomRank]);




  // Fetch player data

  useEffect(() => {
    const fetchLeagueData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5176/api/league-data/${leagueId}`);
        if (!res.ok) throw new Error("Failed to fetch league data");
        const data = await res.json();
        const playerTotals = data.standings.results.map((p) => (
          {
          name: p.player_name,
          total: p.total,
          rank: p.rank,
          leagueRank: p.league_rank,
          id: p.id
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


  //tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      console.log(`Tooltip payload:`, payload);
      const point = payload[0];
      return (
        <div style={{ backgroundColor: 'white', padding: 5, border: '1px solid #ccc' }}>
          <p>{shortenName(point.payload.name)}</p>
          <p>{point.payload.total} pts</p>

          
        </div>
      );
    }
    return null;
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!players.length) return <p>No player data available</p>;

  const minPoints = Math.min(...players.map((p) => p.total));
  const maxPoints = Math.max(...players.map((p) => p.total));

  // Zoom handlers
  const zoomIn = () => setZoomRank((prev) => Math.min(3, prev + zoomStep));
  const zoomOut = () => setZoomRank((prev) => Math.max(1, prev - zoomStep));

  // Custom label for Scatter
  const renderCustomLabel = ({ x, y, payload }) => {
    if (!payload) return null;
    return (
      <g transform={`translate(${x},${y})`} textAnchor="middle" fontSize="12px">
        <text dy={-15} fill="#333" fontWeight="bold">{payload.name}</text>
        <text dy={20} fill="#555">{payload.total} pts</text>
      </g>
    );
  };


  const shortenName = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    return `${parts[0]}.${parts[1][0].toUpperCase()}`;
  };
  console.log("selectedPlayer:", selectedPlayer);

return (
  <div style={{ padding: "2rem", position: "relative" }}>
    <h1>Number Line: League {leagueId}</h1>

    {/* Zoom controls */}
    <div className="zoom-controls" style={{ marginBottom: 10 }}>
      <button onClick={zoomOut}>−</button>
      <span style={{ margin: "0 10px" }}>{zoomRank.toFixed(1)}x</span>
      <button onClick={zoomIn}>+</button>
    </div>

    {/* Scrollable chart container */}
    <div
      ref={chartScrollRef}
      style={{
        overflowX: "auto",
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: 8,
        paddingBottom: 10,
      }}
    >
      <div
        style={{
          width: `${zoomRank * 100}%`,
          minWidth: "100%",
          transition: "width 0.3s ease-in-out",
        }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 40, right: 30, bottom: 20, left: 30 }}>
            <CartesianGrid stroke="none" />
            <XAxis type="number" dataKey="total" domain={[minPoints, maxPoints]} tick={{ fontSize: 12 }} />
            <YAxis type="number" dataKey="y" hide />
            <Tooltip content={CustomTooltip} />
            <Scatter
              data={players.map((p) => ({ ...p, y: 0 }))}
              shape={renderDot}
            >
              <LabelList content={renderCustomLabel} />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Selected player card */}
    {selectedPlayer && (
<div
style={{
  position: "fixed",       // fixes it relative to the viewport
  top: "30%",              // vertically center
  left: "50%",             // horizontally center
  transform: "translate(-50%, -50%)", // exact center
  zIndex: 1000,            // above everything else
  maxWidth: "300px",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  backgroundColor: "#f9f9f9",
}}

>
  {/* Image placeholder */}
  <img
    src={arsenalImg}
    alt={selectedPlayer.name}
    style={{ maxWidth: "100px", marginBottom: "15px" }}
  />

  <h3>{selectedPlayer.name}</h3>
  <p>is</p>
  <p>Total points: {selectedPlayer.total}</p>
  <p>Place: 3rd</p>
  <p>10 points behind Jack</p>
  <p>12 points ahead of Tim</p>

  {/* Button centered at bottom */}
  <div style={{ marginTop: "20px" }}>
    <button
      onClick={() => setSelectedPlayer(null)}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",

        border: "none",
        backgroundColor: "#007bff",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        transition: "background-color 0.3s",
            zIndex: 10001           // ensures it’s above other elements

      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
    >
      Close
    </button>
  </div>
</div>

    )}
  </div>
);

}

export default NumberLinePage;
