import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestPage from "./pages/TestPage";
import LeagueChartPage from "./pages/LeagueChartPage";
import HomePage from "./pages/HomePage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/leagueChart" element={<LeagueChartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
