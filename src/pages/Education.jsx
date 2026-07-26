import React from "react";
import { profile } from "../data/profile";
import "../styles/console.css";

export default function Education() {
  return (
    <main className="console-content">
      <div className="console-header-section">
        <div className="console-header-left">
          <div
            style={{
              color: "#64748b",
              fontSize: "12px",
              fontWeight: "500",
              marginBottom: "4px",
            }}
          >
            Console Home / Education
          </div>

          <h1 className="console-title">Education</h1>

          <div
            style={{
              color: "#64748b",
              fontSize: "14px",
              marginTop: "4px",
            }}
          >
            Academic background
          </div>
        </div>
      </div>

      <div className="console-grid">
        {profile.education.map((edu, index) => (
          <div
            key={`${edu.degree}-${edu.institution}`}
            className="console-card"
            style={{ gridColumn: "span 1" }}
          >
            <div className="console-card-header">
              <span className="console-card-title">
                {edu.degree}
              </span>

              <span
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  whiteSpace: "nowrap",
                }}
              >
                {edu.duration}
              </span>
            </div>

            <div className="console-card-body">
              {/* Education Level */}
              <div
                style={{
                  color: "#64748b",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: "8px",
                }}
              >
                {edu.level}
              </div>

              {/* Institution */}
              <div
                style={{
                  color: "#1e293b",
                  fontSize: "16px",
                  fontWeight: "600",
                  lineHeight: "1.5",
                  marginBottom: "12px",
                }}
              >
                {edu.institution}
              </div>

              {/* Score */}
              {edu.score && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: "#ecfeff",
                    color: "#0f766e",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  {edu.score}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}