import React, { useState } from "react";
import "./actionsRunner.css";

const INITIAL_WORKFLOWS = [
  {
    id: "wf-1",
    name: "Build and Test Node.js / React",
    event: "push to main",
    status: "success", // success, running, failed
    duration: "45s",
    author: "octocat",
    commit: "3a4f8b2",
    createdAt: "2 hours ago",
    steps: [
      { name: "Set up Node.js v18.x environment", status: "completed", logs: ["Downloading Node.js 18.20.0...", "Node.js environment initialized."] },
      { name: "Install npm package dependencies", status: "completed", logs: ["npm ci", "added 842 packages in 12s"] },
      { name: "Run ESLint static code analysis", status: "completed", logs: ["eslint src/", "0 errors, 0 warnings found."] },
      { name: "Run automated unit test suite", status: "completed", logs: ["PASS src/App.test.jsx", "Test Suites: 1 passed, 1 total", "Tests: 12 passed, 12 total"] },
      { name: "Create distribution build artifacts", status: "completed", logs: ["vite build", "dist/index.html 0.45 kB", "dist/assets/index.js 142.10 kB"] }
    ]
  },
  {
    id: "wf-2",
    name: "Docker Container Build & Security Scan",
    event: "pull_request #1",
    status: "success",
    duration: "1m 12s",
    author: "developer_pro",
    commit: "61e4b3b",
    createdAt: "1 day ago",
    steps: [
      { name: "Docker image build", status: "completed", logs: ["Building image github-clone-app:latest..."] },
      { name: "Trivy vulnerability security check", status: "completed", logs: ["Scanning target image...", "No CRITICAL vulnerabilities found."] }
    ]
  }
];

const ActionsRunner = ({ repo }) => {
  const [workflows, setWorkflows] = useState(INITIAL_WORKFLOWS);
  const [selectedWorkflow, setSelectedWorkflow] = useState(INITIAL_WORKFLOWS[0]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunWorkflow = () => {
    setIsRunning(true);
    const newWf = {
      id: "wf-" + Date.now(),
      name: "Manual Workflow Run - Live Pipeline",
      event: "workflow_dispatch",
      status: "running",
      duration: "running...",
      author: "you",
      commit: "HEAD",
      createdAt: "Just now",
      steps: [
        { name: "Set up Node.js v18.x environment", status: "completed", logs: ["Setting up runner node-2026-runner-01..."] },
        { name: "Install npm package dependencies", status: "running", logs: ["npm install --prefer-offline..."] },
        { name: "Run automated unit test suite", status: "pending", logs: [] },
        { name: "Deploy to production environment", status: "pending", logs: [] }
      ]
    };

    setWorkflows([newWf, ...workflows]);
    setSelectedWorkflow(newWf);

    // Simulate step progress completion
    setTimeout(() => {
      newWf.status = "success";
      newWf.duration = "24s";
      newWf.steps = newWf.steps.map((s) => ({
        ...s,
        status: "completed",
        logs: [...s.logs, "Done cleanly with exit code 0."]
      }));
      setWorkflows([...workflows]);
      setIsRunning(false);
    }, 4000);
  };

  return (
    <div className="actions-runner-container">
      {/* Header & Trigger controls */}
      <div className="actions-header-bar">
        <div className="actions-title-wrap">
          <svg className="octicon" viewBox="0 0 16 16" width="20" height="20" fill="#58a6ff">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7.28-3.22a.75.75 0 0 0-1.06 0L5.22 7.28a.75.75 0 0 0 0 1.06l2.5 2.5a.75.75 0 0 0 1.06-1.06L6.81 8l1.97-1.97a.75.75 0 0 0 0-1.06Z" />
          </svg>
          <div>
            <h3 className="actions-heading">GitHub Actions Workflows</h3>
            <p className="actions-subtext">Automated CI/CD pipelines, builds, and test runners for {repo?.name || "awesome-react-app"}</p>
          </div>
        </div>

        <button
          className={`btn-sm btn-primary ${isRunning ? "disabled" : ""}`}
          onClick={handleRunWorkflow}
          disabled={isRunning}
        >
          {isRunning ? "⚡ Running Pipeline..." : "▶ Run Workflow"}
        </button>
      </div>

      <div className="actions-grid-layout">
        {/* Left: Workflow Runs List */}
        <div className="workflows-sidebar-card">
          <div className="sidebar-header">Recent Workflow Runs</div>
          <div className="workflows-list">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                className={`wf-list-item ${selectedWorkflow?.id === wf.id ? "active" : ""}`}
                onClick={() => setSelectedWorkflow(wf)}
              >
                <div className="wf-status-icon">
                  {wf.status === "success" && <span className="status-icon green">✅</span>}
                  {wf.status === "running" && <span className="status-icon yellow spinner-sm">⏳</span>}
                  {wf.status === "failed" && <span className="status-icon red">❌</span>}
                </div>
                <div className="wf-item-info">
                  <span className="wf-item-title">{wf.name}</span>
                  <span className="wf-item-meta">{wf.event} • {wf.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Workflow Step Terminal Logs */}
        <div className="workflow-details-panel">
          {selectedWorkflow && (
            <div className="terminal-log-card">
              <div className="terminal-header">
                <span className="terminal-title">{selectedWorkflow.name}</span>
                <span className="terminal-commit">Commit {selectedWorkflow.commit}</span>
              </div>

              <div className="terminal-steps-list">
                {selectedWorkflow.steps?.map((step, idx) => (
                  <div key={idx} className="step-block">
                    <div className="step-header">
                      <span className="step-icon">
                        {step.status === "completed" ? "✓" : step.status === "running" ? "⏳" : "•"}
                      </span>
                      <span className="step-title">{step.name}</span>
                      <span className="step-badge">{step.status}</span>
                    </div>

                    <div className="step-logs-window">
                      {step.logs.map((log, lIdx) => (
                        <div key={lIdx} className="log-line">
                          <span className="log-prompt">$</span> {log}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionsRunner;
