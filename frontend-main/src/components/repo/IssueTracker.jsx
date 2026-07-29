import React, { useState } from "react";
import "./issueTracker.css";

const DEFAULT_ISSUES = [
  {
    _id: "iss1",
    title: "Fix responsive layout padding on mobile devices",
    description: "On screens smaller than 768px, the sidebar overlaps main content area.",
    status: "open",
    author: "octocat",
    avatar: "https://avatars.githubusercontent.com/u/583231?v=4",
    createdAt: "2 days ago",
    labels: ["bug", "ui"],
    comments: [
      { id: 1, user: "developer_pro", avatar: "https://avatars.githubusercontent.com/u/9919?v=4", text: "I can reproduce this on iOS Safari. Will submit PR.", time: "1 day ago" }
    ]
  },
  {
    _id: "iss2",
    title: "Feature request: Add Dark/Light mode toggle switch",
    description: "Allow users to toggle between GitHub dark dim and standard light themes easily from the navbar.",
    status: "open",
    author: "dev_guy",
    avatar: "https://avatars.githubusercontent.com/u/9919?v=4",
    createdAt: "5 days ago",
    labels: ["enhancement", "good first issue"],
    comments: []
  },
  {
    _id: "iss3",
    title: "Update dependencies to React 18.3",
    description: "Upgrade core packages to latest releases for performance optimizations and bug fixes.",
    status: "closed",
    author: "bot_dep",
    avatar: "https://avatars.githubusercontent.com/u/583231?v=4",
    createdAt: "10 days ago",
    labels: ["dependencies"],
    comments: [
      { id: 1, user: "octocat", avatar: "https://avatars.githubusercontent.com/u/583231?v=4", text: "Merged in PR #14.", time: "9 days ago" }
    ]
  }
];

const IssueTracker = ({ repo }) => {
  const [issues, setIssues] = useState(repo?.issues?.length ? repo.issues : DEFAULT_ISSUES);
  const [statusFilter, setStatusFilter] = useState("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);

  // New Issue Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedLabels, setSelectedLabels] = useState(["bug"]);

  // Comment state
  const [newCommentText, setNewCommentText] = useState("");

  const filteredIssues = issues.filter((iss) => {
    const matchesStatus = statusFilter === "all" || iss.status === statusFilter;
    const matchesSearch =
      iss.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateIssue = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newIssueObj = {
      _id: "iss_" + Date.now(),
      title: newTitle,
      description: newDescription || "No description provided.",
      status: "open",
      author: "you",
      avatar: "https://avatars.githubusercontent.com/u/583231?v=4",
      createdAt: "Just now",
      labels: selectedLabels,
      comments: []
    };

    setIssues([newIssueObj, ...issues]);
    setNewTitle("");
    setNewDescription("");
    setShowCreateModal(false);
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || !selectedIssue) return;
    const updatedComment = {
      id: Date.now(),
      user: "you",
      avatar: "https://avatars.githubusercontent.com/u/583231?v=4",
      text: newCommentText,
      time: "Just now"
    };

    const updatedIssue = {
      ...selectedIssue,
      comments: [...(selectedIssue.comments || []), updatedComment]
    };

    setIssues(issues.map((i) => (i._id === selectedIssue._id ? updatedIssue : i)));
    setSelectedIssue(updatedIssue);
    setNewCommentText("");
  };

  const toggleIssueStatus = (issueId) => {
    const updated = issues.map((i) => {
      if (i._id === issueId) {
        const nextStatus = i.status === "open" ? "closed" : "open";
        return { ...i, status: nextStatus };
      }
      return i;
    });
    setIssues(updated);
    if (selectedIssue && selectedIssue._id === issueId) {
      setSelectedIssue({
        ...selectedIssue,
        status: selectedIssue.status === "open" ? "closed" : "open"
      });
    }
  };

  const openCount = issues.filter((i) => i.status === "open").length;
  const closedCount = issues.filter((i) => i.status === "closed").length;

  return (
    <div className="issue-tracker-container">
      {/* Top Header & Search Controls */}
      <div className="issues-header-bar">
        <div className="issues-filter-tabs">
          <button
            className={`filter-btn ${statusFilter === "open" ? "active" : ""}`}
            onClick={() => { setStatusFilter("open"); setSelectedIssue(null); }}
          >
            <span className="icon">🟢</span> {openCount} Open
          </button>
          <button
            className={`filter-btn ${statusFilter === "closed" ? "active" : ""}`}
            onClick={() => { setStatusFilter("closed"); setSelectedIssue(null); }}
          >
            <span className="icon">🟣</span> {closedCount} Closed
          </button>
          <button
            className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => { setStatusFilter("all"); setSelectedIssue(null); }}
          >
            All ({issues.length})
          </button>
        </div>

        <div className="issues-search-row">
          <input
            type="text"
            className="issue-search-input"
            placeholder="Search all issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn-sm btn-primary" onClick={() => setShowCreateModal(true)}>
            New Issue
          </button>
        </div>
      </div>

      {/* Main Issue List or Selected Issue View */}
      {!selectedIssue ? (
        <div className="issues-list-card">
          {filteredIssues.length === 0 ? (
            <div className="empty-issues-box">
              <h3>No matching issues found</h3>
              <p>Try clearing filters or search query to view issues.</p>
            </div>
          ) : (
            filteredIssues.map((iss) => (
              <div key={iss._id} className="issue-row">
                <div className="issue-status-icon">
                  {iss.status === "open" ? (
                    <span title="Open issue" className="status-open">🟢</span>
                  ) : (
                    <span title="Closed issue" className="status-closed">🟣</span>
                  )}
                </div>

                <div className="issue-content-main">
                  <div className="issue-title-line">
                    <span className="issue-title-text" onClick={() => setSelectedIssue(iss)}>
                      {iss.title}
                    </span>
                    <div className="issue-labels-wrap">
                      {iss.labels?.map((lbl, idx) => (
                        <span key={idx} className={`issue-label label-${lbl.replace(/\s+/g, "-")}`}>
                          {lbl}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="issue-subtext">
                    #{iss._id.slice(-4)} opened {iss.createdAt} by {iss.author}
                  </div>
                </div>

                <div className="issue-comment-count">
                  💬 {iss.comments?.length || 0}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Detailed Issue View & Comments Thread */
        <div className="issue-detail-view">
          <button className="btn-sm btn-secondary back-btn" onClick={() => setSelectedIssue(null)}>
            ← Back to all issues
          </button>

          <div className="issue-detail-header">
            <h2 className="issue-detail-title">{selectedIssue.title} <span className="issue-num">#{selectedIssue._id.slice(-4)}</span></h2>
            <div className="issue-detail-status-bar">
              <span className={`status-pill ${selectedIssue.status}`}>
                {selectedIssue.status === "open" ? "Open" : "Closed"}
              </span>
              <span className="meta-text">
                opened by <strong>{selectedIssue.author}</strong> • {selectedIssue.createdAt} • {selectedIssue.comments?.length || 0} comments
              </span>
              <button
                className={`btn-sm ${selectedIssue.status === "open" ? "btn-close-issue" : "btn-reopen-issue"}`}
                onClick={() => toggleIssueStatus(selectedIssue._id)}
              >
                {selectedIssue.status === "open" ? "Close Issue" : "Reopen Issue"}
              </button>
            </div>
          </div>

          <div className="comments-timeline">
            {/* Original Issue Post */}
            <div className="comment-card original-post">
              <div className="comment-header">
                <img src={selectedIssue.avatar || "https://avatars.githubusercontent.com/u/583231?v=4"} alt="avatar" className="user-avatar-sm" />
                <strong>{selectedIssue.author}</strong> commented {selectedIssue.createdAt}
              </div>
              <div className="comment-body">
                <p>{selectedIssue.description}</p>
              </div>
            </div>

            {/* Existing Comments */}
            {selectedIssue.comments?.map((c) => (
              <div key={c.id} className="comment-card">
                <div className="comment-header">
                  <img src={c.avatar || "https://avatars.githubusercontent.com/u/583231?v=4"} alt="avatar" className="user-avatar-sm" />
                  <strong>{c.user}</strong> commented {c.time}
                </div>
                <div className="comment-body">
                  <p>{c.text}</p>
                </div>
              </div>
            ))}

            {/* Add Comment Input */}
            <div className="add-comment-box">
              <h4>Add a comment</h4>
              <textarea
                rows="4"
                className="comment-textarea"
                placeholder="Leave a comment or response..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
              ></textarea>
              <div className="comment-submit-row">
                <button className="btn-sm btn-primary" onClick={handleAddComment}>
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Issue Modal */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Issue</h3>
              <button className="close-x" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateIssue} className="modal-body">
              <label>Title</label>
              <input
                type="text"
                required
                className="modal-input"
                placeholder="Title of issue"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />

              <label>Description</label>
              <textarea
                rows="5"
                className="modal-textarea"
                placeholder="Describe the issue or bug..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              ></textarea>

              <label>Labels</label>
              <div className="label-checkboxes">
                {["bug", "enhancement", "documentation", "good first issue", "ui"].map((lbl) => (
                  <label key={lbl} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedLabels.includes(lbl)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLabels([...selectedLabels, lbl]);
                        } else {
                          setSelectedLabels(selectedLabels.filter((l) => l !== lbl));
                        }
                      }}
                    />
                    <span>{lbl}</span>
                  </label>
                ))}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-sm btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-sm btn-primary">
                  Submit New Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueTracker;
