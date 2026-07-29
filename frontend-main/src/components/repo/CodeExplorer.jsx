import React, { useState } from "react";
import AICodeAssistant from "../ai/AICodeAssistant";
import LivePlayground from "../playground/LivePlayground";
import "./codeExplorer.css";

const MOCK_FILES = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "App.jsx",
        type: "file",
        size: "1.2 KB",
        content: `import React from 'react';\n\nexport default function App() {\n  return (\n    <div className="container">\n      <h1>Welcome to GitHub Clone</h1>\n      <p>Built with React, Express, MongoDB and AI integrations.</p>\n    </div>\n  );\n}`,
        message: "feat: add main App layout component",
        time: "2 hours ago",
      },
      {
        name: "index.css",
        type: "file",
        size: "840 B",
        content: `body {\n  margin: 0;\n  background-color: #0d1117;\n  color: #c9d1d9;\n  font-family: system-ui, sans-serif;\n}`,
        message: "style: custom Primer dark theme styles",
        time: "3 hours ago",
      },
      {
        name: "utils.js",
        type: "file",
        size: "620 B",
        content: `export function formatDate(dateString) {\n  return new Date(dateString).toLocaleDateString();\n}\n\nexport function calculateSentiment(score) {\n  return score > 0.8 ? 'High Impact' : 'Standard';\n}`,
        message: "refactor: add utility helper methods",
        time: "1 day ago",
      },
    ],
  },
  {
    name: "public",
    type: "folder",
    children: [
      {
        name: "favicon.ico",
        type: "file",
        size: "4.2 KB",
        content: "/* Binary image file */",
        message: "chore: update brand favicon asset",
        time: "4 days ago",
      },
    ],
  },
  {
    name: "package.json",
    type: "file",
    size: "1.1 KB",
    content: `{\n  "name": "github-clone-app",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  },\n  "dependencies": {\n    "react": "^18.3.0",\n    "react-router-dom": "^6.22.0"\n  }\n}`,
    message: "chore: update project dependencies",
    time: "2 days ago",
  },
  {
    name: "README.md",
    type: "file",
    size: "2.4 KB",
    content: `# GitHub Clone Project 🚀\n\nA full-featured, state-of-the-art GitHub Clone web application.\n\n## ✨ Features\n- 📁 **Interactive Code Explorer**: Real-time directory navigation & file code viewer.\n- 🐞 **Issue Management & PRs**: Full issue tracker with labels and automated PR merging.\n- ⚡ **GitHub Actions Simulator**: Visual CI/CD pipeline step runner.\n- 🤖 **AI Code Explainer & Reviewer**: Instant AI code breakdown & security audit.\n- 💻 **Live Web Sandbox**: Run HTML/JS/CSS live inside the app.\n- 📊 **Developer Sentiment Analytics**: Workload heatmaps & productivity matrix.\n\n## 🛠️ Tech Stack\n- Frontend: React.js, React Router, Custom Primer Dark Theme\n- Backend: Node.js, Express.js, MongoDB, Socket.io`,
    message: "docs: update comprehensive repository README",
    time: "5 hours ago",
  },
];

const CodeExplorer = ({ repo }) => {
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [currentFolder, setCurrentFolder] = useState(MOCK_FILES);
  const [folderHistory, setFolderHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showPlaygroundModal, setShowPlaygroundModal] = useState(false);

  const handleFolderClick = (folder) => {
    setFolderHistory([...folderHistory, folder.name]);
    setCurrentFolder(folder.children);
    setSelectedFile(null);
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      setFolderHistory([]);
      setCurrentFolder(MOCK_FILES);
      setSelectedFile(null);
      return;
    }
    const newHistory = folderHistory.slice(0, index + 1);
    setFolderHistory(newHistory);
    // Find folder
    let folderPtr = MOCK_FILES;
    for (let name of newHistory) {
      const match = folderPtr.find((f) => f.name === name);
      if (match && match.children) {
        folderPtr = match.children;
      }
    }
    setCurrentFolder(folderPtr);
    setSelectedFile(null);
  };

  return (
    <div className="code-explorer-container">
      {/* Top Bar: Branch Selector & Action Controls */}
      <div className="explorer-top-bar">
        <div className="branch-selector-wrapper">
          <button className="btn-sm btn-secondary branch-btn">
            <svg className="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-2.25.75a2.25 2.25 0 1 1 3 2.122v4.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 9.5 3.25ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-2.25.75a2.25 2.25 0 1 1 3 2.122v-8.744A2.25 2.25 0 1 1 6.5 4.5v8.25a2.25 2.25 0 0 1-4.5 0Z" />
            </svg>
            <span>{selectedBranch}</span>
            <span className="caret">▼</span>
          </button>

          <div className="branch-info-tags">
            <span className="info-tag">
              <strong>1</strong> Branch
            </span>
            <span className="info-tag">
              <strong>14</strong> Commits
            </span>
          </div>
        </div>

        {/* Path Breadcrumb */}
        <div className="explorer-breadcrumbs">
          <span className="breadcrumb-item" onClick={() => handleBreadcrumbClick(-1)}>
            {repo?.name || "awesome-react-app"}
          </span>
          {folderHistory.map((folderName, idx) => (
            <React.Fragment key={idx}>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item" onClick={() => handleBreadcrumbClick(idx)}>
                {folderName}
              </span>
            </React.Fragment>
          ))}
          {selectedFile && (
            <>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-file">{selectedFile.name}</span>
            </>
          )}
        </div>
      </div>

      {/* Latest Commit Bar */}
      <div className="latest-commit-bar">
        <div className="commit-user-info">
          <img
            src={repo?.owner?.avatarUrl || "https://avatars.githubusercontent.com/u/583231?v=4"}
            alt="owner"
            className="commit-avatar"
          />
          <strong className="commit-author">{repo?.owner?.username || "octocat"}</strong>
          <span className="commit-msg">feat: expand repository file structure and README instructions</span>
        </div>
        <div className="commit-meta">
          <span className="commit-hash">3a4f8b2</span>
          <span className="commit-time">2 hours ago</span>
        </div>
      </div>

      {/* Main File Table or File Viewer */}
      {!selectedFile ? (
        <div className="file-tree-card">
          <table className="file-tree-table">
            <tbody>
              {currentFolder.map((item, index) => (
                <tr key={index} className="file-row">
                  <td className="file-icon-cell">
                    {item.type === "folder" ? (
                      <span className="icon-folder">📁</span>
                    ) : (
                      <span className="icon-file">📄</span>
                    )}
                  </td>
                  <td className="file-name-cell">
                    {item.type === "folder" ? (
                      <span className="link-folder" onClick={() => handleFolderClick(item)}>
                        {item.name}
                      </span>
                    ) : (
                      <span className="link-file" onClick={() => handleFileClick(item)}>
                        {item.name}
                      </span>
                    )}
                  </td>
                  <td className="file-message-cell">{item.message}</td>
                  <td className="file-time-cell">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* File Viewer Mode */
        <div className="file-viewer-card">
          <div className="file-viewer-header">
            <div className="file-info-left">
              <span className="file-name-title">{selectedFile.name}</span>
              <span className="file-size-badge">{selectedFile.size}</span>
            </div>

            <div className="file-actions-right">
              <button
                className="btn-sm btn-ai-action"
                onClick={() => setShowAIModal(true)}
                title="Ask AI to explain code"
              >
                🤖 AI Explain Code
              </button>

              <button
                className="btn-sm btn-playground-action"
                onClick={() => setShowPlaygroundModal(true)}
                title="Run live in Web Sandbox"
              >
                ⚡ Live Web Sandbox
              </button>

              <button
                className="btn-sm btn-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(selectedFile.content);
                  alert("Code copied to clipboard!");
                }}
              >
                Copy Raw
              </button>
              <button className="btn-sm btn-secondary" onClick={() => setSelectedFile(null)}>
                Close
              </button>
            </div>
          </div>

          <div className="code-content-view">
            <pre className="line-numbers">
              {selectedFile.content.split("\n").map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </pre>
            <pre className="code-text">{selectedFile.content}</pre>
          </div>
        </div>
      )}

      {/* Rendered README Section */}
      <div className="readme-section-card">
        <div className="readme-header">
          <svg className="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Z" />
          </svg>
          <span>README.md</span>
        </div>
        <div className="readme-body">
          <h1>{repo?.name || "awesome-react-app"} 🚀</h1>
          <p>{repo?.description || "A state-of-the-art React application with real-time GitHub sync."}</p>
          <hr />
          <h3>✨ Key Features Included</h3>
          <ul>
            <li>📁 <strong>Interactive Code Explorer</strong>: Real-time directory navigation & file code viewer.</li>
            <li>🐞 <strong>Issue Management & PRs</strong>: Full issue tracker with labels and automated PR merging.</li>
            <li>⚡ <strong>GitHub Actions Simulator</strong>: Visual CI/CD pipeline step runner.</li>
            <li>🤖 <strong>AI Code Explainer & Reviewer</strong>: Instant AI code breakdown & security audit.</li>
            <li>💻 <strong>Live Web Sandbox</strong>: Run HTML/JS/CSS live inside the app.</li>
            <li>📊 <strong>Developer Sentiment Analytics</strong>: Workload heatmaps & productivity matrix.</li>
          </ul>
        </div>
      </div>

      {/* AI Assistant Modal */}
      {showAIModal && selectedFile && (
        <AICodeAssistant code={selectedFile.content} filename={selectedFile.name} onClose={() => setShowAIModal(false)} />
      )}

      {/* Live Playground Modal */}
      {showPlaygroundModal && selectedFile && (
        <LivePlayground initialCode={selectedFile.content} filename={selectedFile.name} onClose={() => setShowPlaygroundModal(false)} />
      )}
    </div>
  );
};

export default CodeExplorer;
