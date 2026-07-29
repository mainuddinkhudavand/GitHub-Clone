import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../Navbar";
import CodeExplorer from "./CodeExplorer";
import IssueTracker from "./IssueTracker";
import PullRequests from "./PullRequests";
import ActionsRunner from "./ActionsRunner";
import RepoSettings from "./RepoSettings";
import "./repoDetail.css";

const RepoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("code");
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(12);
  const [forkCount, setForkCount] = useState(4);
  const [showCloneDropdown, setShowCloneDropdown] = useState(false);
  const [cloneProtocol, setCloneProtocol] = useState("https");

  useEffect(() => {
    fetchRepoDetails();
  }, [id]);

  const fetchRepoDetails = async () => {
    setLoading(true);
    try {
      if (id) {
        const res = await fetch(`http://localhost:3002/repo/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRepo(data);
          if (data.stars) setStarCount(data.stars);
        } else {
          // Fallback demo repository structure if server returns 404 or offline
          setRepo(getFallbackRepo(id));
        }
      } else {
        setRepo(getFallbackRepo("demo"));
      }
    } catch (err) {
      console.warn("Backend fetch failed, using mock repo details:", err);
      setRepo(getFallbackRepo(id || "demo"));
    } finally {
      setLoading(false);
    }
  };

  const getFallbackRepo = (repoId) => {
    return {
      _id: repoId,
      name: "awesome-react-app",
      description: "A state-of-the-art React application with real-time GitHub sync, AI code reviewer, and Web Sandbox.",
      visibility: true, // public
      owner: {
        _id: "user1",
        username: "octocat",
        avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
      },
      updatedAt: new Date().toISOString(),
      issues: [
        {
          _id: "iss1",
          title: "Fix responsive layout padding on mobile devices",
          description: "On screens smaller than 768px, the sidebar overlaps main content area.",
          status: "open",
          author: "octocat",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          labels: ["bug", "ui"],
          comments: [
            { id: 1, user: "developer_pro", text: "I can reproduce this on iOS Safari. Will submit PR.", time: "1 day ago" }
          ]
        },
        {
          _id: "iss2",
          title: "Feature request: Add Dark/Light mode toggle switch",
          description: "Allow users to toggle between GitHub dark dim and standard light themes.",
          status: "open",
          author: "dev_guy",
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          labels: ["enhancement", "good first issue"],
          comments: []
        },
        {
          _id: "iss3",
          title: "Update dependencies to React 18.3",
          description: "Upgrade core packages to latest releases for performance optimizations.",
          status: "closed",
          author: "bot_dep",
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          labels: ["dependencies"],
          comments: []
        }
      ]
    };
  };

  const toggleStar = () => {
    setIsStarred(!isStarred);
    setStarCount((prev) => (isStarred ? prev - 1 : prev + 1));
  };

  const cloneUrl =
    cloneProtocol === "https"
      ? `https://github.com/${repo?.owner?.username || "user"}/${repo?.name || "repo"}.git`
      : `git@github.com:${repo?.owner?.username || "user"}/${repo?.name || "repo"}.git`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard: " + text);
  };

  if (loading) {
    return (
      <div className="repo-detail-page dark-bg">
        <Navbar />
        <div className="loading-spinner-container">
          <div className="spinner"></div>
          <p>Loading repository details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="repo-detail-page dark-bg">
      <Navbar />

      {/* Repository Header */}
      <header className="repo-header">
        <div className="repo-header-container">
          <div className="repo-title-row">
            <div className="repo-title-left">
              <svg className="octicon repo-icon" viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-11H4.5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h5.75a.75.75 0 0 1 0 1.5H4.5A2.5 2.5 0 0 1 2 14.5Zm3 4a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 6.5Zm0 3a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 9.5Z" />
              </svg>
              <Link to="/profile" className="repo-owner-link">
                {repo?.owner?.username || "owner"}
              </Link>
              <span className="repo-slash">/</span>
              <h1 className="repo-name-heading">{repo?.name}</h1>
              <span className={`visibility-badge ${repo?.visibility ? "public" : "private"}`}>
                {repo?.visibility ? "Public" : "Private"}
              </span>
            </div>

            <div className="repo-actions-right">
              {/* Star Button */}
              <div className="btn-group">
                <button className={`btn-sm btn-star ${isStarred ? "starred" : ""}`} onClick={toggleStar}>
                  <svg className="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                  </svg>
                  <span>{isStarred ? "Starred" : "Star"}</span>
                </button>
                <span className="social-count">{starCount}</span>
              </div>

              {/* Fork Button */}
              <div className="btn-group">
                <button className="btn-sm btn-secondary" onClick={() => setForkCount(forkCount + 1)}>
                  <svg className="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5A.75.75 0 0 0 11 6.25v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.5 0a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0ZM5 12.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                  </svg>
                  <span>Fork</span>
                </button>
                <span className="social-count">{forkCount}</span>
              </div>

              {/* Code Clone Button */}
              <div className="clone-dropdown-wrapper">
                <button
                  className="btn-sm btn-primary btn-code-clone"
                  onClick={() => setShowCloneDropdown(!showCloneDropdown)}
                >
                  <svg className="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                    <path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25Zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25Z" />
                  </svg>
                  <span>Code</span>
                  <span className="caret">▼</span>
                </button>

                {showCloneDropdown && (
                  <div className="clone-dropdown-menu">
                    <div className="clone-tabs">
                      <button
                        className={cloneProtocol === "https" ? "active" : ""}
                        onClick={() => setCloneProtocol("https")}
                      >
                        HTTPS
                      </button>
                      <button
                        className={cloneProtocol === "ssh" ? "active" : ""}
                        onClick={() => setCloneProtocol("ssh")}
                      >
                        SSH
                      </button>
                      <button
                        className={cloneProtocol === "cli" ? "active" : ""}
                        onClick={() => setCloneProtocol("cli")}
                      >
                        GitHub CLI
                      </button>
                    </div>

                    <div className="clone-input-box">
                      <input
                        type="text"
                        readOnly
                        value={
                          cloneProtocol === "cli"
                            ? `gh repo clone ${repo?.owner?.username || "user"}/${repo?.name}`
                            : cloneUrl
                        }
                      />
                      <button
                        title="Copy to clipboard"
                        onClick={() =>
                          copyToClipboard(
                            cloneProtocol === "cli"
                              ? `gh repo clone ${repo?.owner?.username || "user"}/${repo?.name}`
                              : cloneUrl
                          )
                        }
                      >
                        📋
                      </button>
                    </div>
                    <div className="clone-dropdown-footer">
                      <small>Clone using web URL or SSH key</small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="repo-description-text">{repo?.description || "No description provided."}</p>

          {/* Navigation Tabs */}
          <nav className="repo-nav-tabs">
            <button
              className={`repo-nav-item ${activeTab === "code" ? "active" : ""}`}
              onClick={() => setActiveTab("code")}
            >
              <svg className="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L14.44 8l-3.97-3.97a.75.75 0 0 1 1.06-1.06Zm-6.56 0a.75.75 0 0 1 1.06 1.06L1.81 8l3.97 3.97a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.78a.75.75 0 0 1 0-1.06l4.25-4.25Z" />
              </svg>
              <span>Code</span>
            </button>

            <button
              className={`repo-nav-item ${activeTab === "issues" ? "active" : ""}`}
              onClick={() => setActiveTab("issues")}
            >
              <svg className="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
              </svg>
              <span>Issues</span>
              <span className="tab-counter">{repo?.issues?.length || 2}</span>
            </button>

            <button
              className={`repo-nav-item ${activeTab === "pulls" ? "active" : ""}`}
              onClick={() => setActiveTab("pulls")}
            >
              <svg className="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.5 5.396V2.75a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.694L6.117 4.134a.75.75 0 1 1 1.06-1.061Z" />
              </svg>
              <span>Pull Requests</span>
              <span className="tab-counter">1</span>
            </button>

            <button
              className={`repo-nav-item ${activeTab === "actions" ? "active" : ""}`}
              onClick={() => setActiveTab("actions")}
            >
              <svg className="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7.28-3.22a.75.75 0 0 0-1.06 0L5.22 7.28a.75.75 0 0 0 0 1.06l2.5 2.5a.75.75 0 0 0 1.06-1.06L6.81 8l1.97-1.97a.75.75 0 0 0 0-1.06Z" />
              </svg>
              <span>Actions</span>
            </button>

            <button
              className={`repo-nav-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <svg className="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
              </svg>
              <span>Settings</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="repo-tab-content-container">
        {activeTab === "code" && <CodeExplorer repo={repo} />}
        {activeTab === "issues" && <IssueTracker repo={repo} />}
        {activeTab === "pulls" && <PullRequests repo={repo} />}
        {activeTab === "actions" && <ActionsRunner repo={repo} />}
        {activeTab === "settings" && <RepoSettings repo={repo} />}
      </main>
    </div>
  );
};

export default RepoDetail;
