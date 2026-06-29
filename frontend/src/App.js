import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ElectricForge from "./ElectricForge";
import MentorPage from "./MentorPage";
import InvestmentPage from "./InvestmentPage";
import ShreemBooksGallery from './ShreemBooksGallery';
import YoungAuthorsFellowship from "./YoungAuthorsFellowship";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ElectricForge />} />
        <Route path="/mentor" element={<MentorPage />} />
        <Route path="/investment" element={<InvestmentPage />} />
        <Route path="/shreem-books" element={<ShreemBooksGallery />} />
        <Route path="/young-authors" element={<YoungAuthorsFellowship />} />
      </Routes>
    </Router>
  );
}

export default App;
