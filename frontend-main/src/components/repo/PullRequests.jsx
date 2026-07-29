import React, { useState } from "react";
import "./pullRequests.css";

const DEFAULT_PRS = [
  {
    id: "pr-1",
    number: 1,
    title: "feat(ui): add Primer Dark Theme and responsive navigation bar",
    author: "octocat",
    avatar: "https://avatars.githubusercontent.com/u/583231?v=4",
    status: "open", // open, merged, closed
    sourceBranch: "feature/primer-ui",
    targetBranch: "main",
    createdAt: "3 hours ago",
    description: "This pull request refactors the global CSS tokens and replaces standard browser defaults with Primer dark theme styling.",
    diff: [
      {
        filename: "frontend-main/src/App.css",
        additions: 24,
        deletions: 8,
        changes: [
          { type: "remove", line: 12, text: "- body { background-color: white; color: black; }" },
          { type: "add", line: 12, text: "+ body { background-color: #0d1117; color: #c9d1d9; }" },
          { type: "add", line: 13, text: "+ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI'; " },
          { type: "normal", line: 14, text: "  .container { max-width: 1280px; margin: 0 auto; }" }
        ]
      },
      {
        filename: "frontend-main/src/components/Navbar.jsx",
        additions: 15,
        deletions: 2,
        changes: [
          { type: "remove", line: 45, text: "- <div className='nav-bar'>" },
          { type: "add", line: 45, text: "+ <header className='github-header-nav'>" },
          { type: "add", line: 46, text: "+   <UserDropdownAvatar user={currentUser} />" }
        ]
      }
    ]
  }
];

const PullRequests = ({ repo }) => {
  const [prs, setPrs] = useState(DEFAULT_PRS);
  const [statusFilter, setStatusFilter] = useState("open");
  const [selectedPR, setSelectedPR] = useState(null);

  // New PR Modal
  const [showModal, setShowModal] = useState(false);
  const [prTitle, setPrTitle] = useState("");
  const [prDescription, setPrDescription] = useState("");
  const [sourceBranch, setSourceBranch] = useState("feature/ai-assistant");

  const filteredPRs = prs.filter((p) => statusFilter === "all" || p.status === statusFilter);

  const handleCreatePR = (e) => {
    e.preventDefault();
    if (!prTitle.trim()) return;

    const newPR = {
      id: "pr-" + Date.now(),
      number: prs.length + 1,
      title: prTitle,
      author: "you",
      avatar: "https://avatars.githubusercontent.com/u/583231?v=4",
      status: "open",
      sourceBranch,
      targetBranch: "main",
      createdAt: "Just now",
      description: prDescription || "No description provided.",
      diff: [
        {
          filename: "src/components/ai/AICodeAssistant.jsx",
          additions: 45,
          deletions: 0,
          changes: [
            { type: "add", line: 1, text: "+ export function AICodeAssistant() { return <div>AI Review active</div>; }" }
          ]
        }
      ]
    };

    setPrs([newPR, ...prs]);
    setPrTitle("");
    setPrDescription("");
    setShowModal(false);
  };

  const handleMergePR = (prId) => {
    const updated = prs.map((p) => (p.id === prId ? { ...p, status: "merged" } : p));
    setPrs(updated);
    if (selectedPR && selectedPR.id === prId) {
      setSelectedPR({ ...selectedPR, status: "merged" });
    }
  };

  return (
    <div className="pull-requests-container">
      {/* Header bar */}
      <div className="prs-header-bar">
        <div className="prs-filter-tabs">
          <button
            className={`filter-btn ${statusFilter === "open" ? "active" : ""}`}
            onClick={() => { setStatusFilter("open"); setSelectedPR(null); }}
          >
            🟢 {prs.filter((p) => p.status === "open").length} Open
          </button>
          <button
            className={`filter-btn ${statusFilter === "merged" ? "active" : ""}`}
            onClick={() => { setStatusFilter("merged"); setSelectedPR(null); }}
          >
            🟣 {prs.filter((p) => p.status === "merged").length} Merged
          </button>
          <button
            className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => { setStatusFilter("all"); setSelectedPR(null); }}
          >
            All ({prs.length})
          </button>
        </div>

        <button className="btn-sm btn-primary" onClick={() => setShowModal(true)}>
          New Pull Request
        </button>
      </div>

      {/* PR List or PR Diff Viewer */}
      {!selectedPR ? (
        <div className="prs-list-card">
          {filteredPRs.length === 0 ? (
            <div className="empty-prs-box">
              <h3>No pull requests found</h3>
              <p>There are no pull requests matching the selected status.</p>
            </div>
          ) : (
            filteredPRs.map((pr) => (
              <div key={pr.id} className="pr-row">
                <div className="pr-status-icon">
                  {pr.status === "open" ? (
                    <span title="Open PR" className="pr-open-icon">🔀</span>
                  ) : pr.status === "merged" ? (
                    <span title="Merged PR" className="pr-merged-icon">🟣</span>
                  ) : (
                    <span title="Closed PR">🔴</span>
                  )}
                </div>

                <div className="pr-content-main">
                  <div className="pr-title-line">
                    <span className="pr-title-text" onClick={() => setSelectedPR(pr)}>
                      {pr.title}
                    </span>
                  </div>
                  <div className="pr-subtext">
                    #{pr.number} opened {pr.createdAt} by <strong>{pr.author}</strong> • {pr.sourceBranch} ➔ {pr.targetBranch}
                  </div>
                </div>

                <div className="pr-status-badge-col">
                  <span className={`pr-badge badge-${pr.status}`}>
                    {pr.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* PR Detail View & Visual Diff */
        <div className="pr-detail-view">
          <button className="btn-sm btn-secondary back-btn" onClick={() => setSelectedPR(null)}>
            ← Back to Pull Requests
          </button>

          <div className="pr-detail-header">
            <h2 className="pr-detail-title">
              {selectedPR.title} <span className="pr-num">#{selectedPR.number}</span>
            </h2>
            <div className="pr-detail-subnav">
              <span className={`pr-badge badge-${selectedPR.status}`}>
                {selectedPR.status.toUpperCase()}
              </span>
              <span className="branch-diff-badge">
                <code>{selectedPR.sourceBranch}</code> into <code>{selectedPR.targetBranch}</code>
              </span>
            </div>
          </div>

          <div className="pr-description-card">
            <h4>Description</h4>
            <p>{selectedPR.description}</p>
          </div>

          {/* Merge Box */}
          <div className={`merge-action-card ${selectedPR.status}`}>
            {selectedPR.status === "open" ? (
              <div className="merge-prompt">
                <div className="merge-icon-check">✅</div>
                <div className="merge-text">
                  <h4>This pull request has no conflicts and can be merged automatically.</h4>
                  <p>Merging will combine changes from {selectedPR.sourceBranch} into {selectedPR.targetBranch}.</p>
                </div>
                <button className="btn-sm btn-merge-confirm" onClick={() => handleMergePR(selectedPR.id)}>
                  Merge Pull Request
                </button>
              </div>
            ) : (
              <div className="merged-info">
                <span className="purple-circle">🟣</span>
                <span><strong>Pull Request Merged!</strong> All commit changes are merged into {selectedPR.targetBranch}.</span>
              </div>
            )}
          </div>

          {/* Visual Code Diff View */}
          <div className="diff-files-section">
            <h3>Files Changed ({selectedPR.diff?.length || 0})</h3>

            {selectedPR.diff?.map((file, idx) => (
              <div key={idx} className="diff-file-card">
                <div className="diff-file-header">
                  <span className="diff-filename">{file.filename}</span>
                  <div className="diff-counts">
                    <span className="add-count">+{file.additions}</span>
                    <span className="del-count">-{file.deletions}</span>
                  </div>
                </div>

                <div className="diff-code-table">
                  {file.changes.map((line, lIdx) => (
                    <div
                      key={lIdx}
                      className={`diff-line line-${line.type}`}
                    >
                      <span className="line-num">{line.line}</span>
                      <pre className="line-text">{line.text}</pre>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create PR Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create Pull Request</h3>
              <button className="close-x" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreatePR} className="modal-body">
              <div className="branch-compare-row">
                <label>base: <code>main</code></label>
                <span>←</span>
                <label>compare: </label>
                <select
                  className="modal-select"
                  value={sourceBranch}
                  onChange={(e) => setSourceBranch(e.target.value)}
                >
                  <option value="feature/ai-assistant">feature/ai-assistant</option>
                  <option value="feature/primer-ui">feature/primer-ui</option>
                  <option value="fix/mobile-responsive">fix/mobile-responsive</option>
                </select>
              </div>

              <label>Title</label>
              <input
                type="text"
                required
                className="modal-input"
                placeholder="Pull request title..."
                value={prTitle}
                onChange={(e) => setPrTitle(e.target.value)}
              />

              <label>Description</label>
              <textarea
                rows="4"
                className="modal-textarea"
                placeholder="Explain the changes proposed in this PR..."
                value={prDescription}
                onChange={(e) => setPrDescription(e.target.value)}
              ></textarea>

              <div className="modal-footer">
                <button type="button" className="btn-sm btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-sm btn-primary">
                  Create Pull Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PullRequests;
