import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import {
  Search, Download, Bell, HelpCircle, Settings, ChevronDown,
  FileText, Folder, Key, Award, Mail, BookOpen, TerminalSquare
} from "lucide-react";
import "../../styles/console.css";

export const SECTIONS = [
  { id: "exp", name: "Experience", path: "/experience", color: "#D97706", icon: FileText },
  { id: "proj", name: "Projects", path: "/projects", color: "#16A34A", icon: Folder },
  { id: "skills", name: "Skills", path: "/skills", color: "#9333EA", icon: Key },
  { id: "achievements", name: "Achievements", path: "/achievements", color: "#DB2777", icon: Award },
  { id: "contact", name: "Contact", path: "/contact", color: "#2563EB", icon: Mail },
  { id: "education", name: "Education", path: "/education", color: "#CA8A04", icon: BookOpen },
];

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return SECTIONS.filter(({ name }) => name.toLowerCase().includes(term));
  }, [query]);

  return (
    <div className="console-home-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* TOP NAV */}
      <header className="console-topbar">
        <Link to="/" className="console-logo-area" style={{ textDecoration: 'none' }}>
          <div className="console-logo-mark">M</div>
          <div className="console-wordmark">mohankumarsaras</div>
        </Link>

        <div className="console-search">
          <Search size={14} className="search-icon" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search portfolio sections..." aria-label="Search portfolio sections" />
          {results.length > 0 && <div className="console-search-results" role="listbox">
            {results.map((result) => <Link key={result.id} to={result.path} role="option" onClick={() => setQuery("")}>{result.name}</Link>)}
          </div>}
        </div>

        <div className="console-nav-actions">
          <button className="console-icon-btn" title="Download Resume"><Download size={18} /></button>
          
          {/* CLI Terminal Button */}
          <button 
            className="console-icon-btn" 
            title="Open CLI Terminal" 
            aria-label="Open CLI Terminal"
            onClick={() => navigate("/terminal")}
            style={{ color: '#0f766e', background: 'rgba(45, 212, 191, 0.14)' }}
          >
            <TerminalSquare size={18} />
          </button>
          
          <button className="console-icon-btn"><Bell size={18} /></button>
          <button className="console-icon-btn"><HelpCircle size={18} /></button>
          <button className="console-icon-btn"><Settings size={18} /></button>

          <div className="console-account-pill">
            <span>guest@portfolio</span>
            <ChevronDown size={14} />
          </div>
          <div className="console-account-pill">
            <span>Salem, IN</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </header>

      {/* SHORTCUT ROW */}
      <div className="console-shortcut-row">
        {SECTIONS.map(sec => (
          <Link
            key={`sc-${sec.id}`}
            className="console-shortcut-btn"
            to={sec.path}
            aria-current={location.pathname === sec.path ? "page" : undefined}
            style={{ textDecoration: 'none' }}
          >
            <div className="shortcut-icon-wrapper" style={{ backgroundColor: sec.color }}>
              <sec.icon size={12} strokeWidth={2.5} color="white" />
            </div>
            {sec.name}
          </Link>
        ))}
      </div>

      {/* MAIN CONTENT OUTLET */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </div>

      {/* FOOTER */}
      <footer className="console-status-strip">
        <span><span style={{ color: '#2DD4BF' }}>●</span> Region: ap-south-1</span>
        <span>Language: English (US)</span>
        <span>Version: 2026.07.02</span>
      </footer>
    </div>
  );
}
