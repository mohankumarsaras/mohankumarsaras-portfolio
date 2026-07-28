import { useEffect } from "react";
import { profile } from "../data/profile";
import metaLogo from "../assets/meta-logo.svg";
import "../styles/console.css";

function getCredlyBadgeId(cert) {
  if (cert.startsWith("AWS Certified Cloud Practitioner")) return "5b97c83c-c951-471d-a681-6cd7dd06c111";
  if (cert === "AWS SimuLearn - AI Practitioner - Training Badge") return "507648fa-fe67-4ff4-a07a-09320c227c61";
  if (cert === "Well-Architected Proficient") return "3fe9bad2-af08-4f90-a94a-1d57269e55c9";
  return null;
}

function CredlyBadge({ badgeId, title }) {
  return <div aria-label={`${title} Credly badge`} data-iframe-width="150" data-iframe-height="270" data-share-badge-id={badgeId} data-share-badge-host="https://www.credly.com" />;
}

export default function Achievements() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.credly.com/assets/utilities/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <main className="console-content">
      <div className="console-header-section">
        <div className="console-header-left">
          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>Console Home / Achievements</div>
          <h1 className="console-title">Achievements</h1>
          <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Certifications and milestones</div>
        </div>
      </div>

      <div className="console-grid">
        <div className="console-card" style={{ gridColumn: 'span 1' }}>
          <div className="console-card-header"><span className="console-card-title">Certifications</span></div>
          <div className="console-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profile.certifications.map((cert) => {
                const badgeId = getCredlyBadgeId(cert);
                return (
                  <div key={cert} style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      {badgeId ? <CredlyBadge badgeId={badgeId} title={cert} /> : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '32px', flexShrink: 0 }}>
                          <img src={metaLogo} alt="Meta logo" style={{ maxWidth: '40px', maxHeight: '32px', objectFit: 'contain' }} />
                        </div>
                      )}
                      <span style={{ color: '#1e293b', fontWeight: '500' }}>{cert}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
