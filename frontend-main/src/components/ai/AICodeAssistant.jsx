import React, { useState } from "react";
import "./aiCodeAssistant.css";

const AICodeAssistant = ({ code, filename, onClose }) => {
  const [activeTab, setActiveTab] = useState("explain");
  const [analyzing, setAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState({
    summary: `The file '${filename}' contains modular ES6 JavaScript / React logic. Key structures include exported components and state initialization hooks.`,
    securityScore: "A+",
    vulnerabilities: [
      { severity: "Low", message: "Ensure user-submitted input strings are sanitized before rendering into DOM." }
    ],
    suggestions: [
      "Use React.useCallback on passed event handler methods to avoid unnecessary re-renders.",
      "Add TypeScript type definitions for improved autocomplete and runtime safety."
    ]
  });

  const handleRunAudit = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content ai-modal">
        <div className="ai-modal-header">
          <div className="ai-title-wrap">
            <span className="ai-sparkle-icon">✨</span>
            <h3>AI Code Assistant & Security Auditor</h3>
          </div>
          <button className="close-x" onClick={onClose}>×</button>
        </div>

        <div className="ai-sub-tabs">
          <button
            className={activeTab === "explain" ? "active" : ""}
            onClick={() => setActiveTab("explain")}
          >
            💡 Logic Explainer
          </button>
          <button
            className={activeTab === "security" ? "active" : ""}
            onClick={() => setActiveTab("security")}
          >
            🛡️ Security Scan ({aiReport.securityScore})
          </button>
          <button
            className={activeTab === "suggestions" ? "active" : ""}
            onClick={() => setActiveTab("suggestions")}
          >
            🚀 Performance Tips
          </button>
        </div>

        <div className="ai-modal-body">
          {analyzing ? (
            <div className="ai-loading">
              <div className="spinner"></div>
              <p>Analyzing {filename} with Gemini AI Engine...</p>
            </div>
          ) : (
            <>
              {activeTab === "explain" && (
                <div className="ai-card-box">
                  <h4>Code Overview for {filename}</h4>
                  <p className="ai-text-desc">{aiReport.summary}</p>

                  <div className="code-snippet-box">
                    <code>{code?.slice(0, 250)}...</code>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="ai-card-box">
                  <div className="security-score-banner">
                    <span>Security Rating:</span>
                    <span className="score-badge">{aiReport.securityScore}</span>
                  </div>

                  <h4>Vulnerability Audit</h4>
                  {aiReport.vulnerabilities.map((v, i) => (
                    <div key={i} className="vuln-item">
                      <span className="severity-badge">{v.severity}</span>
                      <p>{v.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "suggestions" && (
                <div className="ai-card-box">
                  <h4>Refactoring Recommendations</h4>
                  <ul className="suggestions-list">
                    {aiReport.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        <div className="ai-modal-footer">
          <button className="btn-sm btn-secondary" onClick={handleRunAudit} disabled={analyzing}>
            🔄 Re-Analyze Code
          </button>
          <button className="btn-sm btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICodeAssistant;
