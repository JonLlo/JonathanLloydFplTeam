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
    "#1f77b4", // blue
    "#ff7f0e", // orange
    "#2ca02c", // green
    "#d62728", // red
    "#9467bd", // purple
    "#8c564b", // brown
    "#e377c2", // pink
    "#7f7f7f", // gray
    "#bcbd22", // olive
    "#17becf", // cyan
    "#393b79", // dark blue
    "#637939", // dark green
    "#8c6d31", // mustard
    "#843c39", // brick red
    "#7b4173", // deep purple
    "#3182bd", // sky blue
    "#31a354", // bright green
    "#756bb1", // lavender
    "#e6550d", // burnt orange
    "#969696"  // light gray
  ];


  const leagueId = 275033;
  const [chartData, setChartData] = useState([]);
  const [playerNames, setPlayerNames] = useState([]);
  const [activeLines, setActiveLines] = useState([]); // track highlighted lines
  const [clickedLine, setClickedLine] = useState(null);

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
        setActiveLines(players.map(p => p.name)); // all lines active initially

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
                weekData[p.name] = idx + 1;
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

  // Handlers to highlight lines when legend is hovered

  // Handlers to highlight lines when legend is hovered
  const handleMouseEnter = (e) => {
    setActiveLines([e.value]); // only highlight this line
  };

  const handleMouseLeave = () => {
    setActiveLines(playerNames); // reset to show all lines
  };

  const handleMouseClick = (e) => {
    return true;
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
              onClick={handleMouseClick}
            />
            {playerNames.map((name, index) => (
              <Line
                key={name}
                type="linear"
                dataKey={name}
                stroke={colours[index % colours.length]} // stable color
                strokeWidth={activeLines.includes(name) ? 3 : 1}
                opacity={activeLines.includes(name) ? 1 : 0.2}
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
