import React from "react";
import { profile } from "../data/profile";
import "../styles/console.css";

export default function Experience() {
  return (
    <main className="console-content">
      <div className="console-header-section">
        <div className="console-header-left">
          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>Console Home / Experience</div>
          <h1 className="console-title">Experience</h1>
          <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Professional experience and engineering background</div>
        </div>
      </div>

      <div className="console-grid">
        <div className="console-card" style={{ gridColumn: 'span 1' }}>
          <div className="console-card-header"><span className="console-card-title">Professional Roles</span></div>
          <div className="console-card-body" style={{ fontSize: '24px', fontWeight: '600' }}>{profile.experience.length}</div>
        </div>
        <div className="console-card" style={{ gridColumn: 'span 1' }}>
          <div className="console-card-header"><span className="console-card-title">Current Role Experience</span></div>
          <div className="console-card-body" style={{ fontSize: '24px', fontWeight: '600', color: '#2DD4BF' }}>{profile.experience[0]?.experience}</div>
        </div>
        <div className="console-card" style={{ gridColumn: 'span 1' }}>
          <div className="console-card-header"><span className="console-card-title">Primary Role</span></div>
          <div className="console-card-body" style={{ fontSize: '20px', fontWeight: '600' }}>DevOps Engineer</div>
        </div>

        {profile.experience.map((job) => (
          <div key={job.slug || job.company} className="console-card" style={{ gridColumn: '1 / -1' }}>
            <div className="console-card-header">
              <span className="console-card-title">{job.role}</span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>{[job.duration, job.experience].filter(Boolean).join(' · ')}</span>
            </div>
            <div className="console-card-body">
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#0f172a' }}>{job.company}{job.location && <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'normal' }}> — {job.location}</span>}</h3>
              {job.client && <div style={{ color: '#475569', fontSize: '14px', marginBottom: '6px' }}><strong>Client:</strong> {job.client}</div>}
              {job.project && <div style={{ color: '#475569', fontSize: '14px', marginBottom: '12px' }}><strong>Project:</strong> {job.project}{job.projectSlug && <> · <a className="update-link" href={`/projects#${job.projectSlug}`}>View project</a></>}</div>}
              {job.technologies?.length > 0 && <>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Technology / Responsibility Areas</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {job.technologies.map((technology) => <span key={technology} style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#334155', border: '1px solid #e2e8f0' }}>{technology}</span>)}
                </div>
              </>}
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Responsibilities & Achievements</div>
              <ul style={{ paddingLeft: '20px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                {job.highlights.map((highlight) => <li key={highlight} style={{ marginBottom: '6px' }}>{highlight}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
