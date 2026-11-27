
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Elections from "./pages/Elections";
import Evidence from "./pages/Evidence";
import Methodology from "./pages/Methodology";
import About from "./pages/About";
import ObserverSignup from "./pages/ObserverSignup";
import ObserverLogin from "./pages/ObserverLogin";
import ScrollToHash from "./components/ScrollToHash";
import Results from "./pages/Results";
import AgentDashboard from "./pages/AgentDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/elections" element={<Elections />} />
        <Route path="/evidence" element={<Evidence />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/about" element={<About />} />
        <Route path="/results" element={<Results />} />

        {/* Election Agent Portal */}
        <Route
          path="/observer/signup"
          element={<ObserverSignup />}
        />
        <Route
          path="/observer/login"
          element={<ObserverLogin />}
        />

        {/* Agent Dashboard */}
        <Route
          path="/agent/dashboard"
          element={<AgentDashboard />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
