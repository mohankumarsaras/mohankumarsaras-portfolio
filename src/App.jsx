import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Terminal from "./components/Terminal";
import ConsoleHome from "./pages/ConsoleHome";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Achievements from "./pages/Achievements";
import Contact from "./pages/Contact";
import Education from "./pages/Education";
import AppShell from "./components/layout/AppShell";
import ServerAmbient from "./components/ServerAmbient";
import "./styles/terminal.css";

function TerminalWrapper() {
  const navigate = useNavigate();
  return (
    <div className="screen-transition terminal-wrapper">
      <Terminal onExit={() => navigate("/")} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<ConsoleHome />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/education" element={<Education />} />
        </Route>
        
        <Route path="/terminal" element={<TerminalWrapper />} />
        <Route path="/ambient" element={<ServerAmbient onBoot={() => window.location.href = "/terminal"} />} />
      </Routes>
    </BrowserRouter>
  );
}
