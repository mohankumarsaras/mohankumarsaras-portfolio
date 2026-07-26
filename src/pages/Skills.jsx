import React from "react";
import { profile } from "../data/profile";
import "../styles/console.css";

export default function Skills() {
  return (
    <main className="console-content">
      <div className="console-header-section">
        <div className="console-header-left">
          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
            Console Home / Skills
          </div>
          <h1 className="console-title">Skills</h1>
          <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Technical competencies and tools</div>
        </div>
      </div>

      <div className="console-grid">
        {profile.skills.map((group, i) => (
          <div key={i} className="console-card" style={{ gridColumn: 'span 1' }}>
            <div className="console-card-header">
              <span className="console-card-title">{group.category}</span>
            </div>
            <div className="console-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {group.items.map((skill, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#2dd4bf' }}>●</span>
                    <span style={{ color: '#334155' }}>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
