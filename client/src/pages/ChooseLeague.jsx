import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/App.css"; // make sure this is imported if not already

function ChooseLeague() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleClick = (leagueId) => {
    navigate(`/league-chart/${leagueId}`);
  };

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:5176/api/user-data/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user data");

        const json = await res.json();
        setData(json);
        setLeagues(json.leagues?.classic || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (!userId) return <p>Please enter your FPL ID on the home page.</p>;
  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error Occured here: {error}</p>;

  //const jsonPreview = JSON.stringify(data, null, 2).slice(0, 500) + (JSON.stringify(data).length > 500 ? "..." : "");

  return (
    <div className="container">
        
      <h1>FPL Data for ID {userId}</h1>

      <h2>Classic Leagues:</h2>
      <ul className="league-list">
        {leagues.map((league) => (
          <li key={league.id}>
            <button className="home-button" onClick={() => handleClick(league.id)}>
              {league.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChooseLeague;
