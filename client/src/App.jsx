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
  const [animationFinished, setAnimationFinished] = useState(false);

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
              rank: event.total_points // or use rank if you prefer
            }));
            return { name: player.name, history };
          })
        );

        const weeklyRanks = {};
        histories.forEach(player => {
          player.history.forEach(h => {
            if (!weeklyRanks[h.week]) weeklyRanks[h.week] = [];
            weeklyRanks[h.week].push({ name: player.name, rank: h.rank });
          });
        });

        const chartDataArr = [];
        Object.keys(weeklyRanks)
          .sort((a, b) => a - b)
          .forEach(week => {
            const weekData = { week: Number(week) };
            weeklyRanks[week]
              .sort((a, b) => b.rank - a.rank) // rank ascending
              .forEach((p, idx) => {
                weekData[p.name] = idx + 1; // league position
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

  // Show legend after animationDuration
  useEffect(() => {
    const timer = setTimeout(() => setAnimationFinished(true), 1900);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = (e) => {
    if (e && e.value && !somethingIsClicked) setHoveredLine(e.value);
  };

  const handleMouseLeave = () => 
    {if (!somethingIsClicked) {
      alert('hu');
      setHoveredLine(null)}};


const [clickedLines, setClickedLines] = useState([]); // array of currently clicked lines
const [somethingIsClicked, setSomethingIsClicked] = useState(false);



// Custom legend function
const renderLegend = ({ payload }) => (
  <div style={{ textAlign: "center" }}>
    {payload.map(entry => (
      <span
        key={entry.value}
        onClick={() => handleMouseClick({ value: entry.value })}
        onMouseEnter={() => {if (!somethingIsClicked) {setHoveredLine(entry.value)}}}
        onMouseLeave={() => {if (!somethingIsClicked) {setHoveredLine(null)}}}
        style={{
          margin: "0 8px",
          cursor: "pointer",
          fontWeight: clickedLines.includes(entry.value) ? "bold" : "normal",
          display: "inline-flex",
          alignItems: "center"
        }}
      >
        {/* colored box */}
        <span
          style={{
            display: "inline-block",
            width: 12,
            height: 12,
            backgroundColor: entry.color, // this keeps the line color
            marginRight: 4,
            borderRadius: 2
          }}
        />
        {entry.value}
      </span>
    ))}
  </div>
);


const handleMouseClick = (e) => {
  if (e && e.value) {
    setClickedLines((prev) => {
      let newClickedLines;
      if (prev.includes(e.value)) {
        // Line already clicked → remove it
        newClickedLines = prev.filter((name) => name !== e.value);
      } else {
        // Line not clicked → add it
        newClickedLines = [...prev, e.value];
      }

      // Update somethingIsClicked based on new state
      setSomethingIsClicked(newClickedLines.length > 0);

      return newClickedLines;
    });
  }
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
              reversed // keeps 1st place at the top

              allowDecimals={false}
              label={{ value: "Rank", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />



            
            {animationFinished && (
              <Legend  content={renderLegend} 
              
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleMouseClick}
              />
            )}
{playerNames.map((name, index) => (
<Line
  key={name}
  type="monotone"
  dataKey={name}
  stroke={colours[index % colours.length]}
  strokeWidth={3} // always 3
opacity={
  clickedLines.includes(name)
    ? 1
    : hoveredLine
      ? hoveredLine === name
        ? 1
        : 0.03
      : 1
}/>
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
