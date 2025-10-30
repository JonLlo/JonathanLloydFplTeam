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

function NumberLinePage() {


  


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

  // Custom dot renderer to scale with zoom
  const renderDot = ({ cx, cy }) => {
    return <circle cx={cx} cy={cy} r={5 * zoomRank} fill="dodgerblue" />;
  };

  const shortenName = (fullName) => {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0] ;
  return `${parts[0]}.${parts[1][0].toUpperCase()}`;
};

  return (
    <div style={{ padding: "2rem" }}>
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
            width: `${zoomRank * 100}%`, // container-based zoom
            minWidth: "100%",
            transition: "width 0.3s ease-in-out",
          }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 40, right: 30, bottom: 20, left: 30 }}>
              {/* Baseline only, no dotted grid */}
              
              <CartesianGrid stroke="none" />
              <XAxis type="number" dataKey="total" domain={[minPoints, maxPoints]} tick={{ fontSize: 12 }} />
              <YAxis type="number" dataKey="y" hide />
              <Tooltip formatter={(value, name, props) => [`${props.payload.total} pts`, shortenName(`${props.payload.name}`)]} />
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
    </div>
  );
}

export default NumberLinePage;
