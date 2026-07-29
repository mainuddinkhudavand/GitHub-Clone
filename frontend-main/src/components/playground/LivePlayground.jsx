import React, { useState } from "react";
import "./livePlayground.css";

const LivePlayground = ({ initialCode, filename, onClose }) => {
  const [editableCode, setEditableCode] = useState(
    initialCode || `<div style="color: #58a6ff; font-family: sans-serif; text-align: center; padding: 40px;">\n  <h1>⚡ Live Web Sandbox</h1>\n  <p>Run real-time HTML/CSS/JS code right inside GitHub!</p>\n  <button onclick="alert('Hello from GitHub Clone!')" style="padding: 8px 16px; background: #238636; color: white; border: none; border-radius: 6px; cursor: pointer;">Click Me</button>\n</div>`
  );
  const [consoleLogs, setConsoleLogs] = useState(["[System] Sandbox initialized.", "[System] Frame mounted safely."]);

  return (
    <div className="modal-backdrop">
      <div className="modal-content playground-modal">
        <div className="pg-modal-header">
          <div className="pg-title-wrap">
            <span className="pg-icon">⚡</span>
            <h3>Interactive Live Web Sandbox ({filename || "Playground"})</h3>
          </div>
          <button className="close-x" onClick={onClose}>×</button>
        </div>

        <div className="playground-split-body">
          {/* Left: Code Editor Input */}
          <div className="pg-editor-pane">
            <div className="pane-header">Code Editor</div>
            <textarea
              className="pg-textarea"
              value={editableCode}
              onChange={(e) => setEditableCode(e.target.value)}
              placeholder="Type HTML/CSS/JS..."
            ></textarea>
          </div>

          {/* Right: Live Frame Preview & Simulated Output */}
          <div className="pg-preview-pane">
            <div className="pane-header">Live Render Preview</div>
            <div className="iframe-wrapper">
              <iframe
                title="live-sandbox-preview"
                srcDoc={editableCode}
                sandbox="allow-scripts"
                className="live-iframe"
              />
            </div>

            <div className="console-output-box">
              <div className="console-title">Console Output</div>
              <div className="console-lines">
                {consoleLogs.map((log, idx) => (
                  <div key={idx} className="console-line">{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pg-modal-footer">
          <button
            className="btn-sm btn-secondary"
            onClick={() => setConsoleLogs([...consoleLogs, `[Log] Ran code at ${new Date().toLocaleTimeString()}`])}
          >
            Clear Console
          </button>
          <button className="btn-sm btn-primary" onClick={onClose}>
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivePlayground;
