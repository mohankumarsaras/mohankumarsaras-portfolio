import React from "react";
import { profile } from "../data/profile";
import { ArrowUpRight } from "lucide-react";
import "../styles/console.css";

export default function Projects() {
  return (
    <main className="console-content">
      <div className="console-header-section">
        <div className="console-header-left">
          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>Console Home / Projects</div>
          <h1 className="console-title">Projects</h1>
          <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Cloud, DevOps and automation projects</div>
        </div>
      </div>

      <div className="console-grid">
        <div className="console-card" style={{ gridColumn: 'span 1' }}>
          <div className="console-card-header"><span className="console-card-title">Total Projects</span></div>
          <div className="console-card-body" style={{ fontSize: '24px', fontWeight: '600' }}>{profile.projects.length}</div>
        </div>
        {profile.projects.map((proj) => (
          <div key={proj.slug || proj.name} id={proj.slug} className="console-card" style={{ gridColumn: 'span 1' }}>
            <div className="console-card-header"><span className="console-card-title">{proj.name}</span></div>
            <div className="console-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', flex: 1 }}>{proj.description}</p>
              {(proj.organization || proj.client || proj.category) && <div style={{ color: '#475569', fontSize: '13px', lineHeight: '1.6' }}>
                {proj.organization && <div><strong>Organization:</strong> {proj.organization}</div>}
                {proj.client && <div><strong>Client:</strong> {proj.client}</div>}
                {proj.category && <div><strong>Category:</strong> {proj.category}</div>}
              </div>}
              {proj.highlights?.length > 0 && <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Highlights</div>
                <ul style={{ paddingLeft: '18px', margin: 0, color: '#475569', fontSize: '13px', lineHeight: '1.5' }}>{proj.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
              </div>}
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tech Stack</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {proj.stack.map((tech) => <span key={tech} style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#334155', border: '1px solid #e2e8f0' }}>{tech}</span>)}
                </div>
              </div>
              {proj.link && <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #1e293b' }}>
                <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ color: '#2dd4bf', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', width: 'max-content' }}>View repository <ArrowUpRight size={14} /></a>
              </div>}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
