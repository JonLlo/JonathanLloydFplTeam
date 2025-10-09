import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function App() {
  const colours = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#393b79", "#637939", "#8c6d31", "#843c39", "#7b4173",
    "#3182bd", "#31a354", "#756bb1", "#e6550d", "#969696"
  ];

  const leagueId = 275033;
  const [chartData, setChartData] = useState([]);
  const [playerNames, setPlayerNames] = useState([]);
  const [hoveredLine, setHoveredLine] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leagueRes = await fetch(`http://localhost:5176/api/league-data/${leagueId}`);
        const leagueData = await leagueRes.json();

        const players = leagueData.standings.results.map(p => ({
          entry: p.entry,
          name: p.player_name
        }));
        setPlayerNames(players.map(p => p.name));

        const histories = await Promise.all(
          players.map(async (player) => {
            const res = await fetch(`http://localhost:5176/api/user-history/${player.entry}`);
            const data = await res.json();
            const history = data.current.map(event => ({
              week: event.event,
              totalPoints: event.total_points
            }));
            return { name: player.name, history };
          })
        );

        const weeklyPoints = {};
        histories.forEach(player => {
          player.history.forEach(h => {
            if (!weeklyPoints[h.week]) weeklyPoints[h.week] = [];
            weeklyPoints[h.week].push({ name: player.name, points: h.totalPoints });
          });
        });

        const chartDataArr = [];
        Object.keys(weeklyPoints)
          .sort((a, b) => a - b)
          .forEach(week => {
            const weekData = { week: Number(week) };
            weeklyPoints[week]
              .sort((a, b) => b.points - a.points)
              .forEach((p, idx) => {
                weekData[p.name] = idx + 1; // rank within league
              });
            chartDataArr.push(weekData);
          });

        setChartData(chartDataArr);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [leagueId]);

  // Legend hover handlers
  const handleMouseEnter = (e) => {
    if (e && e.value) setHoveredLine(e.value);
  };
  const handleMouseLeave = () => {
    setHoveredLine(null);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>FPL Mini-League Week-by-Week Ranks</h1>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="week" />
            <YAxis
              reversed={true}
              allowDecimals={false}
              label={{ value: "Rank", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            {playerNames.map((name, index) => (
              <Line
                key={name}
                type="linear"
                dataKey={name}
                stroke={colours[index % colours.length]}
                strokeWidth={3}
                opacity={hoveredLine ? (hoveredLine === name ? 1 : 0.2) : 1}
                isAnimationActive={true}        // animate only on initial load
                animationDuration={1500}        // 1.5s duration
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

export default App;
