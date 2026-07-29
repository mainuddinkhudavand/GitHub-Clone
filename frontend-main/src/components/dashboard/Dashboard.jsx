import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ username: "User" });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3002/userProfile/${userId}`)
        .then(res => { if (res.data) setUser(res.data); })
        .catch(err => console.error(err));
    }

    const fetchRepositories = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3002/repo/user/${userId}`);
        const data = await response.json();
        if (response.ok && data && Array.isArray(data.repositories)) {
          setRepositories(data.repositories);
        } else {
          setRepositories([]);
        }
      } catch (err) {
        console.error("Error fetching user repositories:", err);
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3002/repo/all`);
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setSuggestedRepositories(data);
        } else {
          setSuggestedRepositories([]);
        }
      } catch (err) {
        console.error("Error fetching suggested repositories:", err);
        setSuggestedRepositories([]);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, [userId]);

  useEffect(() => {
    if (!Array.isArray(repositories)) {
      setSearchResults([]);
      return;
    }
    if (searchQuery.trim() === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <div className="gh-page-container">
      <Navbar />

      <div className="gh-dashboard-grid">
        {/* Left Sidebar: User Quick Repos */}
        <aside className="gh-dash-left">
          <div className="user-quick-header">
            <div className="quick-avatar-info">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} className="quick-avatar" />
              ) : (
                <div className="quick-avatar-placeholder">{(user.username || "U").charAt(0).toUpperCase()}</div>
              )}
              <div>
                <strong>{user.name || user.username}</strong>
                <span className="user-handle">@{user.username}</span>
              </div>
            </div>
            <Link to="/settings" title="Profile Settings" className="icon-settings-btn">
              ⚙
            </Link>
          </div>

          <div className="sidebar-repos-header">
            <h4>Top Repositories</h4>
            <Link to="/create" className="btn-new-sm">+ New</Link>
          </div>

          <div className="sidebar-search-box">
            <input
              type="text"
              placeholder="Find a repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ul className="sidebar-repo-list">
            {repositories.length === 0 ? (
              <li className="empty-li">No repositories created yet.</li>
            ) : (
              repositories.slice(0, 8).map((repo) => (
                <li key={repo._id || repo.name} className="sidebar-repo-item">
                  <span className="repo-icon">📘</span>
                  <Link to={`/repo/${repo._id || 'demo'}`} className="repo-item-name-link">
                    {user.username} / {repo.name}
                  </Link>
                </li>
              ))
            )}
          </ul>

          <div className="sidebar-divider" />

          <h4>Explore Repositories</h4>
          <div className="explore-list">
            {suggestedRepositories.slice(0, 4).map((sRepo) => (
              <Link key={sRepo._id || sRepo.name} to={`/repo/${sRepo._id || 'demo'}`} className="explore-card">
                <strong>{sRepo.name}</strong>
                <p>{sRepo.description || "Public repository"}</p>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Feed: Home Dashboard Content */}
        <main className="gh-dash-main">
          <div className="dash-welcome-card">
            <h2>Welcome back, {user.name || user.username}! 👋</h2>
            <p>Here's what is happening across your repositories and network today.</p>
            <div className="welcome-actions">
              <Link to="/create" className="btn-gh-primary">+ Create Repository</Link>
              <Link to="/profile" className="btn-gh-secondary">View Profile</Link>
              <Link to="/settings" className="btn-gh-secondary">Edit Settings</Link>
            </div>
          </div>

          <div className="feed-header">
            <h3>Home Feed</h3>
            <span className="feed-filter">Filter: All Activity</span>
          </div>

          {loading ? (
            <div className="dash-loading-card">
              <p>Loading your activity feed...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="dash-empty-card">
              <svg viewBox="0 0 16 16" width="48" height="48" fill="#8b949e"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-1 1v1h1.75a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 13.25V2.5z"/></svg>
              <h3>No repositories found</h3>
              <p>Get started by creating your first repository or exploring existing ones.</p>
              <Link to="/create" className="btn-gh-primary">+ Create Repository</Link>
            </div>
          ) : (
            <div className="feed-repo-grid">
              {searchResults.map((repo) => (
                <div key={repo._id || repo.name} className="feed-repo-card">
                  <div className="card-top">
                    <div className="card-title-row">
                      <span className="repo-book-icon">📘</span>
                      <Link to={`/repo/${repo._id || 'demo'}`} className="card-repo-title-link">
                        {user.username} / {repo.name}
                      </Link>
                      <span className={`badge-vis ${repo.visibility ? "pub" : "priv"}`}>
                        {repo.visibility ? "Public" : "Private"}
                      </span>
                    </div>
                    <button className="btn-star-card">★ Star</button>
                  </div>
                  <p className="card-repo-desc">{repo.description || "No description provided."}</p>
                  <div className="card-bottom">
                    <span className="lang-indicator">
                      <span className="dot" /> JavaScript
                    </span>
                    <span className="meta-text">Updated recently</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar: Announcements & Shortcuts */}
        <aside className="gh-dash-right">
          <div className="announcements-card">
            <h4>Latest GitHub Updates</h4>
            <ul className="updates-list">
              <li>
                <strong>GitHub Copilot Workspace</strong>
                <p>Copilot assistance is now available across your workflow.</p>
              </li>
              <li>
                <strong>New Security Features</strong>
                <p>Enhanced secret scanning and dependency graph alerts.</p>
              </li>
              <li>
                <strong>Global Dark Theme Polish</strong>
                <p>Updated contrast ratios and high-performance layout rendering.</p>
              </li>
            </ul>
          </div>

          <div className="shortcuts-card">
            <h4>Quick Shortcuts</h4>
            <div className="shortcuts-links">
              <Link to="/profile">👤 View Profile</Link>
              <Link to="/settings">⚙ User Settings</Link>
              <Link to="/create">➕ Create New Repo</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
