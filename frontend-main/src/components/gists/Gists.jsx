import React, { useState } from "react";
import Navbar from "../Navbar";
import "./gists.css";

const INITIAL_GISTS = [
  {
    id: "gist-1",
    filename: "debounce.js",
    description: "High performance JS debounce utility function",
    visibility: "public",
    createdAt: "2 hours ago",
    content: `export function debounce(func, wait) {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}`
  },
  {
    id: "gist-2",
    filename: "docker-compose.yml",
    description: "Local dev environment setup with Redis and MongoDB",
    visibility: "secret",
    createdAt: "1 day ago",
    content: `version: '3.8'\nservices:\n  mongo:\n    image: mongo:latest\n    ports:\n      - "27017:27017"\n  redis:\n    image: redis:alpine\n    ports:\n      - "6379:6379"`
  }
];

const Gists = () => {
  const [gists, setGists] = useState(INITIAL_GISTS);
  const [description, setDescription] = useState("");
  const [filename, setFilename] = useState("");
  const [code, setCode] = useState("");
  const [isSecret, setIsSecret] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateGist = (e) => {
    e.preventDefault();
    if (!filename.trim() || !code.trim()) return;

    const newGist = {
      id: "gist-" + Date.now(),
      filename,
      description: description || "No description",
      visibility: isSecret ? "secret" : "public",
      createdAt: "Just now",
      content: code
    };

    setGists([newGist, ...gists]);
    setFilename("");
    setDescription("");
    setCode("");
    setShowCreateForm(false);
  };

  return (
    <div className="gists-page-container dark-bg">
      <Navbar />

      <header className="gists-header">
        <div className="gists-header-inner">
          <div>
            <h1>GitHub Gists 📝</h1>
            <p>Instantly share code snippets, notes, and runnable scripts.</p>
          </div>
          <button className="btn-sm btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? "Close Form" : "+ Create New Gist"}
          </button>
        </div>
      </header>

      <main className="gists-main-content">
        {showCreateForm && (
          <div className="gist-create-card">
            <h3>Instantly Create a Gist</h3>
            <form onSubmit={handleCreateGist} className="gist-form">
              <input
                type="text"
                className="gist-input"
                placeholder="Gist description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="filename-row">
                <input
                  type="text"
                  required
                  className="gist-input filename-input"
                  placeholder="Filename including extension (e.g. script.js)"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                />
              </div>

              <textarea
                rows="8"
                required
                className="gist-textarea"
                placeholder="Paste code or text content here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              ></textarea>

              <div className="gist-submit-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isSecret}
                    onChange={(e) => setIsSecret(e.target.checked)}
                  />
                  <span>Create as Secret Gist</span>
                </label>

                <button type="submit" className="btn-sm btn-primary">
                  Create {isSecret ? "Secret" : "Public"} Gist
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="gists-list">
          <h3>Your Gists ({gists.length})</h3>

          {gists.map((gist) => (
            <div key={gist.id} className="gist-item-card">
              <div className="gist-item-header">
                <div className="gist-info-left">
                  <span className="gist-icon">📄</span>
                  <span className="gist-filename">{gist.filename}</span>
                  <span className={`gist-badge ${gist.visibility}`}>{gist.visibility}</span>
                </div>
                <div className="gist-actions-right">
                  <button
                    className="btn-sm btn-secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(gist.content);
                      alert("Gist code copied to clipboard!");
                    }}
                  >
                    Copy Code
                  </button>
                </div>
              </div>

              {gist.description && <p className="gist-item-desc">{gist.description}</p>}

              <div className="gist-code-preview">
                <pre>{gist.content}</pre>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Gists;
