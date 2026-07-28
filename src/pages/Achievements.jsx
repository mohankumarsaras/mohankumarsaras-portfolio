import { useEffect } from "react";
import { profile } from "../data/profile";
import "../styles/console.css";

function getCredlyBadgeId(cert) {
  if (cert.startsWith("AWS Certified Cloud Practitioner")) return "5b97c83c-c951-471d-a681-6cd7dd06c111";
  if (cert === "AWS SimuLearn - AI Practitioner - Training Badge") return "507648fa-fe67-4ff4-a07a-09320c227c61";
  if (cert === "Well-Architected Proficient") return "3fe9bad2-af08-4f90-a94a-1d57269e55c9";
  return null;
}

function getVerificationUrl(cert, badgeId) {
  if (cert === "Meta Certified Version Control") return "https://www.coursera.org/account/accomplishments/verify/EFVRVHCY8OEJ";
  return badgeId ? `https://www.credly.com/badges/${badgeId}/public_url` : null;
}

function CredlyBadge({ badgeId, title }) {
  return (
    <div className="certification-badge" aria-label={`${title} Credly badge`}>
      <div data-iframe-width="150" data-iframe-height="270" data-share-badge-id={badgeId} data-share-badge-host="https://www.credly.com" />
    </div>
  );
}

function IframelyVerification({ url }) {
  return (
    <div className="certification-iframely iframely-embed">
      <div className="iframely-responsive" style={{ paddingBottom: '52.3702%', paddingTop: '120px' }}>
        <a href={url} data-iframely-url="https://iframely.net/CdEYNC5O?theme=dark">Verify</a>
      </div>
    </div>
  );
}

export default function Achievements() {
  useEffect(() => {
    const scripts = [
      "https://cdn.credly.com/assets/utilities/embed.js",
      "https://iframely.net/embed.js",
    ].map((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      return script;
    });

    return () => scripts.forEach((script) => script.remove());
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
        <div className="console-card certifications-card">
          <div className="console-card-header"><span className="console-card-title">Certifications</span></div>
          <div className="console-card-body">
            <ol className="certifications-list" aria-label="Certifications">
              {profile.certifications.map((cert, index) => {
                const badgeId = getCredlyBadgeId(cert);
                const verificationUrl = getVerificationUrl(cert, badgeId);
                return (
                  <li key={cert} className="certification-item">
                    <div className="certification-heading">
                      <span className="certification-number" aria-hidden="true">{index + 1}</span>
                      <span className="certification-name">{cert}</span>
                    </div>
                    {badgeId ? <CredlyBadge badgeId={badgeId} title={cert} /> : verificationUrl ? (
                      <IframelyVerification url={verificationUrl} />
                    ) : null}
                    <a className="certification-verification-link" href={verificationUrl} target="_blank" rel="noreferrer">Verify</a>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
