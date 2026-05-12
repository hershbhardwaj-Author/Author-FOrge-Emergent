import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ElectricForge from "./ElectricForge";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ElectricForge />} />
          <Route path="/electric-forge" element={<ElectricForge />} />
          <Route path="*" element={<ElectricForge />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
