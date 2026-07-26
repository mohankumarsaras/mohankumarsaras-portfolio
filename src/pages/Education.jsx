import React from "react";
import { profile } from "../data/profile";
import "../styles/console.css";

export default function Education() {
  return (
    <main className="console-content">
      <div className="console-header-section">
        <div className="console-header-left">
          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
            Console Home / Education
          </div>
          <h1 className="console-title">Education</h1>
          <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Academic background</div>
        </div>
      </div>

      <div className="console-grid">
        {profile.education.map((edu, i) => (
          <div key={i} className="console-card" style={{ gridColumn: 'span 1' }}>
            <div className="console-card-header">
              <span className="console-card-title">{edu.degree}</span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>{edu.duration}</span>
            </div>
            <div className="console-card-body">
              <div style={{ fontSize: '16px', color: '#1e293b', fontWeight: '500' }}>
                {edu.institution}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
