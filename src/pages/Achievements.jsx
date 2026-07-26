import React from "react";
import { profile } from "../data/profile";
import "../styles/console.css";

export default function Achievements() {
  return (
    <main className="console-content">
      <div className="console-header-section">
        <div className="console-header-left">
          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
            Console Home / Achievements
          </div>
          <h1 className="console-title">Achievements</h1>
          <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Certifications and milestones</div>
        </div>
      </div>

      <div className="console-grid">
        <div className="console-card" style={{ gridColumn: 'span 1' }}>
          <div className="console-card-header">
            <span className="console-card-title">Certifications</span>
          </div>
          <div className="console-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profile.certifications.map((cert, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: 'rgba(219, 39, 119, 0.1)', color: '#db2777', borderRadius: '4px' }}>
                    🏆
                  </div>
                  <span style={{ color: '#1e293b', fontWeight: '500' }}>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
