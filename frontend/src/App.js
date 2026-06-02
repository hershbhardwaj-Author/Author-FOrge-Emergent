import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ElectricForge from "./ElectricForge";
import AdminDashboard from "./AdminDashboard";
import InvestmentPage from "./InvestmentPage";
import MentorPage from "./MentorPage";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

// Inside your Routes / Switch:
<Route path="/mentor" element={<MentorPage />} />
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ElectricForge />} />
          <Route path="/electric-forge" element={<ElectricForge />} />
          <Route path="/investment" element={<InvestmentPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<ElectricForge />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
