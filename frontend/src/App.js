import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ElectricForge from "./ElectricForge";
import MentorPage from "./MentorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ElectricForge />} />
        <Route path="/mentor" element={<MentorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
