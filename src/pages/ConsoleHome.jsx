import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, Download, Bell, HelpCircle, Settings, ChevronDown,
  MoreVertical, FileText, Folder, Key, Award, Mail, BookOpen,
  TrendingUp, ArrowUpRight
} from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/console.css";

const chartData = [
  { year: "2021", projects: 2 },
  { year: "2022", projects: 3 },
  { year: "2023", projects: 5 },
  { year: "2024", projects: 8 },
];

export default function ConsoleHome() {
  const navigate = useNavigate();

  const SECTIONS = [
    { id: "exp", name: "Experience", path: "/experience", color: "#D97706", icon: FileText },
    { id: "proj", name: "Projects", path: "/projects", color: "#16A34A", icon: Folder },
    { id: "skills", name: "Skills", path: "/skills", color: "#9333EA", icon: Key },
    { id: "achievements", name: "Achievements", path: "/achievements", color: "#DB2777", icon: Award },
    { id: "contact", name: "Contact", path: "/contact", color: "#2563EB", icon: Mail },
    { id: "education", name: "Education", path: "/education", color: "#CA8A04", icon: BookOpen },
  ];

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <>
      <main className="console-content">
        <div className="console-header-section">
          <div className="console-header-left">
            <h1 className="console-title">Console Home</h1>
            <a href="#" className="console-info-link">Info <ArrowUpRight size={12} style={{ display: 'inline', marginBottom: '-2px' }} /></a>
          </div>
          <div className="console-header-actions">
            <button className="btn-outline">Reset to default layout</button>
            <button className="btn-solid">+ Add section</button>
          </div>
        </div>

        <div className="console-grid">

          {/* Card 1: Recently Visited */}
          <div className="console-card" style={{ gridColumn: 'span 1' }}>
            <div className="console-card-header">
              <span className="console-card-title">Recently visited</span>
              <div className="console-card-actions">
                <span style={{ letterSpacing: '2px' }}></span>
                <MoreVertical size={16} />
              </div>
            </div>
            <div className="console-card-body">
              <div className="rv-list">
                {SECTIONS.map(sec => (
                  <Link key={`rv-${sec.id}`} className="rv-item" to={sec.path}>
                    <div className="rv-icon" style={{ backgroundColor: sec.color }}>
                      <sec.icon size={16} />
                    </div>
                    <span>{sec.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Career Health */}
          <div className="console-card" style={{ gridColumn: 'span 1' }}>
            <div className="console-card-header">
              <span className="console-card-title">Career health</span>
              <div className="console-card-actions">
                <MoreVertical size={16} />
              </div>
            </div>
            <div className="console-card-body" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="health-row">
                <div className="health-stat-group">
                  <span className="health-label">Certifications earned</span>
                  <span className="health-timeframe">AWS & HashiCorp</span>
                </div>
                <span className="health-value">2</span>
              </div>
              <div className="health-row">
                <div className="health-stat-group">
                  <span className="health-label">Open certifications in progress</span>
                  <span className="health-timeframe">Past 6 months</span>
                </div>
                <span className="health-value" style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>— not set</span>
              </div>
              <div className="health-row">
                <div className="health-stat-group">
                  <span className="health-label">Recent role changes</span>
                  <span className="health-timeframe">Past 2 years</span>
                </div>
                <span className="health-value" style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>— not set</span>
              </div>
            </div>
          </div>

          {/* Card 3: Latest Updates */}
          <div className="console-card" style={{ gridColumn: 'span 1' }}>
            <div className="console-card-header">
              <span className="console-card-title">Latest updates</span>
              <div className="console-card-actions">
                <MoreVertical size={16} />
              </div>
            </div>
            <div className="console-card-body">
              <div className="updates-list">
                <div className="update-item">
                  <div className="update-date"><span className="update-month">Jul</span><span className="update-day">2</span></div>
                  <div className="update-content">
                    <a href="/achievements" className="update-link" onClick={(e) => { e.preventDefault(); handleNav('/achievements'); }}>AWS Certified Solutions Architect – Associate earned</a>
                    <div style={{ color: '#64748b', marginTop: '4px' }}>Passed the exam with a score of 820.</div>
                  </div>
                </div>
                <div className="update-item">
                  <div className="update-date"><span className="update-month">Mar</span><span className="update-day">14</span></div>
                  <div className="update-content">
                    <a href="/projects" className="update-link" onClick={(e) => { e.preventDefault(); handleNav('/projects'); }}>Launched EKS Deployment Automation</a>
                    <div style={{ color: '#64748b', marginTop: '4px' }}>Fully automated GitOps pipeline using ArgoCD.</div>
                  </div>
                </div>
                <div className="update-item">
                  <div className="update-date"><span className="update-month">Jan</span><span className="update-day">10</span></div>
                  <div className="update-content">
                    <a href="/projects" className="update-link" onClick={(e) => { e.preventDefault(); handleNav('/projects'); }}>Serverless Image Processor published</a>
                    <div style={{ color: '#64748b', marginTop: '4px' }}>Event-driven architecture on AWS Lambda & S3.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Experience & Impact */}
          <div className="console-card" style={{ gridColumn: 'span 1' }}>
            <div className="console-card-header">
              <span className="console-card-title">Experience & impact</span>
              <div className="console-card-actions">
                <MoreVertical size={16} />
              </div>
            </div>
            <div className="console-card-body">
              <div className="impact-main-stat">
                <div className="impact-main-value">
                  4.5
                  <span className="impact-trend"><TrendingUp size={16} /> +1 yr</span>
                </div>
                <div className="impact-label">Years active in tech</div>
              </div>
              <div style={{ color: '#475569', fontSize: '13px', fontWeight: '500' }}>Career forecast (Projects shipped)</div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                    <Bar dataKey="projects" fill="#2DD4BF" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>

        </div>
      </main>
    </>
  );
}
