import React from "react";
import { profile } from "../data/profile";
import { ArrowUpRight } from "lucide-react";
import "../styles/console.css";

export default function Contact() {
  return (
    <main className="console-content">
      <div className="console-header-section">
        <div className="console-header-left">
          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
            Console Home / Contact
          </div>
          <h1 className="console-title">Contact</h1>
          <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Get in touch and connect</div>
        </div>
      </div>

      <div className="console-grid">
        <div className="console-card" style={{ gridColumn: 'span 1' }}>
          <div className="console-card-header">
            <span className="console-card-title">Contact Information</span>
          </div>
          <div className="console-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>Email</div>
              <a href={`mailto:${profile.email}`} style={{ color: '#2dd4bf', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {profile.email} <ArrowUpRight size={14} />
              </a>
            </div>
            
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>LinkedIn</div>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#2dd4bf', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View Profile <ArrowUpRight size={14} />
              </a>
            </div>
            
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>GitHub</div>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ color: '#2dd4bf', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View Repositories <ArrowUpRight size={14} />
              </a>
            </div>
            
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>Location</div>
              <div style={{ color: '#1e293b' }}>{profile.location}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
