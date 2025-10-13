
import React, { useState } from "react";
import "./styles/App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestPage from "./pages/TestPage";
import LeagueChartPage from "./pages/LeagueChartPage";
import HomePage from "./pages/HomePage";
import ChooseLeague from "./pages/ChooseLeague";
import NumberLine from "./pages/NumberLine";


function App() {


  return (
    <Router>
      <Routes>
        <Route path="/"element={<HomePage />} />
        <Route path="/choose-league/:userId" element={<ChooseLeague/>} />
        <Route path="/test-page" element={<TestPage />} />
        <Route path="/number-line/:leagueId" element={<NumberLine />} />
        <Route path="/league-chart/:leagueId" element={<LeagueChartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
