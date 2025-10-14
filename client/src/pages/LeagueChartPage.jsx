import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

function LeagueChartPage() {
  const { leagueId } = useParams(); // get leagueId from URL
  const colours = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#393b79", "#637939", "#8c6d31", "#843c39", "#7b4173",
    "#3182bd", "#31a354", "#756bb1", "#e6550d", "#969696"
  ];


  const [chartData, setChartData] = useState([]);
  const [playerNames, setPlayerNames] = useState([]);
  const [hoveredLine, setHoveredLine] = useState(null);
  const [animateLines, setAnimateLines] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        var n = 1;
        const leagueRes = await fetch(`http://localhost:5176/api/league-data/${leagueId}`);
        const leagueData = await leagueRes.json();

        const players = leagueData.standings.results.map(p => (
        
          console.log(p.player_name, n),
          n++,

          {

          
          entry: p.entry,
          name: p.player_name
        }
      
      
      
      
      ));
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
  const timer = setTimeout(() => {
    setAnimateLines(false); // turn off animation after first load
  }, 1900); // match your animation duration
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
  <div style={{ textAlign: "center", color: "darkblue" }}>
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

const getCustomTicks = (numPlayers) => {
const step = Math.floor(numPlayers / 8); // roughly 8 lines
  const ticks = [];
  for (let i = 1; i <= numPlayers; i += step) {
    ticks.push(i);
  }
  return ticks;
};

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

const navigate = useNavigate();

const NLClick = ( ) => {

    navigate(`/number-line/${leagueId}`); // pass via URL
}


return (
  <div className="leaguechart-container">
    <h1>FPL Mini-League Week-by-Week Ranks</h1>

    <button onClick={NLClick}>Number Line</button>


    {/* Chart section */}
    <div className="chart-wrapper">
      {chartData.length > 0 ? (
<ResponsiveContainer width="100%" height={400}>
  <LineChart
    data={chartData}
    margin={{ top: 20, right: 30, left: -15, bottom: 10 }} // 👈 make left smaller
  >
    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
    <XAxis dataKey="week"
          allowDecimals={false}
      label={{
        //value: "GW",
        dy: 20, // move text down slightly
        fill: 'black',
        
      // move text right slightly to stay visible
        style: { textAnchor: "default" }
      }}
    
    />
    
<YAxis

  reversed
  allowDecimals={false}
  domain={[1, playerNames.length + 1]} // 1 = top rank, last player = bottom
ticks={getCustomTicks(playerNames.length)}
  label={{
    //value: "Rank",
    angle: -90,
    fill: 'black',
    position: "insideLeft",
    dx: 10,
    style: { textAnchor: "middle" }
  }}
/>

    <Tooltip />
    {playerNames.map((name, index) => (
      <Line
        isAnimationActive={animateLines} // controlled via state
        key={name}
        type="monotone"
        dataKey={name}
        stroke={colours[index % colours.length]}
        strokeWidth={3}
        opacity={
          clickedLines.includes(name)
            ? 1
            : hoveredLine
            ? hoveredLine === name
              ? 1
              : 0.03
            : 1
        }

        />
    ))}
  </LineChart>
</ResponsiveContainer>

      ) : (
        <p>Loading chart...</p>
      )}
    </div>

    {/* Separate legend section */}
    {!animateLines && (
      <div className="legend-section">
        <h2>Players</h2>
        <div className="legend-container">
          {playerNames.map((name, index) => (
            <div
              key={name}
              className="legend-item"
              onClick={() => handleMouseClick({ value: name })}
              onMouseEnter={() => {
                if (!somethingIsClicked) setHoveredLine(name);
              }}
              onMouseLeave={() => {
                if (!somethingIsClicked) setHoveredLine(null);
              }}
              style={{
                fontWeight: clickedLines.includes(name) ? "bold" : "normal",
                opacity:
                  clickedLines.length && !clickedLines.includes(name) ? 0.3 : 1,
              }}
            >
              <span
                className="legend-color-box"
                style={{ backgroundColor: colours[index % colours.length] }}
              />
              {name}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
}
export default LeagueChartPage;
