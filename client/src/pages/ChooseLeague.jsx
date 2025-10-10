import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ChooseLeague({ userId }) {
    const [data, setData] = useState(null);
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

const [LeagueId, setLeagueId] = useState(null);
    const navigate = useNavigate();

const handleClick = (leagueId) => {
    setLeagueId(leagueId);  // store the clicked league
    navigate("/league-chart");       // navigate to next page
};

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Relative URL; will be forwarded to backend by the proxy
                const res = await fetch(`http://localhost:5176/api/user-data/${userId}`);
                if (!res.ok) throw new Error("Failed to fetch user data from backend");

                const json = await res.json();
                setData(json);

                // Extract classic leagues
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
    if (error) return <p>Error: {error}</p>;

    // Show first 500 characters of JSON for preview
    const jsonPreview = JSON.stringify(data, null, 2).slice(0, 500) + (JSON.stringify(data).length > 500 ? "..." : "");

    return (
        <div style={{ padding: "2rem", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
            <h1>FPL Data for ID {userId}</h1>

            <h2>JSON Preview:</h2>
            <pre>{jsonPreview}</pre>

            <h2>Classic Leagues:</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {leagues.map((league) => (
                    <li key={league.id} style={{ margin: "0.5rem 0" }}>
                        <button
                            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
                            onClick={() => handleClick(league.id)}>
                            {league.name}


                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChooseLeague;
