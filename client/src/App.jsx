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
  const leagueId = 275033; // Your mini-league ID
  const [chartData, setChartData] = useState([]);
  const [playerNames, setPlayerNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch mini-league standings
        const leagueRes = await fetch(`http://localhost:5176/api/league-data/${leagueId}`);
        const leagueData = await leagueRes.json();

        const players = leagueData.standings.results.map(p => ({
          entry: p.entry,
          name: p.player_name
        }));
        setPlayerNames(players.map(p => p.name));

        // 2️⃣ Fetch each player's history
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

        // 3️⃣ Compute mini-league rank per week
        const weeklyPoints = {}; // week -> [{ name, points }]
        histories.forEach(player => {
          player.history.forEach(h => {
            if (!weeklyPoints[h.week]) weeklyPoints[h.week] = [];
            weeklyPoints[h.week].push({ name: player.name, points: h.totalPoints });
          });
        });

        const chartDataArr = [];
        Object.keys(weeklyPoints)
          .sort((a, b) => a - b) // ascending week order
          .forEach(week => {
            const weekData = { week: Number(week) };
            weeklyPoints[week]
              .sort((a, b) => b.points - a.points) // higher points first
              .forEach((p, idx) => {
                weekData[p.name] = idx + 1; // rank within mini-league
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

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>FPL Mini-League Week-by-Week Ranks</h1>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="week" />
            <YAxis
              reversed={true} // rank 1 at top
              allowDecimals={false}
              label={{ value: "Rank", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            {playerNames.map(name => (
              <Line
                key={name}
                type="linear"
                //type = "monotone"
                dataKey={name}
                stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} // random color
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
