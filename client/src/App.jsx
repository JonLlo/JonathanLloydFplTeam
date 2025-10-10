
import React, { useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestPage from "./pages/TestPage";
import LeagueChartPage from "./pages/LeagueChartPage";
import HomePage from "./pages/HomePage";
import ChooseLeague from "./pages/ChooseLeague";

function App() {
  const [userId, setUserId] = useState("");


  return (
    <Router>
      <Routes>
        <Route path="/"element={<HomePage setUserId={setUserId} />} />
        <Route path="/choose-league" element={<ChooseLeague userId={userId}/>} />
        <Route path="/test-page" element={<TestPage />} />
        <Route path="/league-chart/:leagueId" element={<LeagueChartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
