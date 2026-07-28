import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [userDetails, setUserDetails] = useState({
    username: "user",
    name: "",
    email: "",
    bio: "",
    company: "",
    location: "",
    website: "",
    twitter: "",
    avatarUrl: "",
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [saveStatus, setSaveStatus] = useState("");
  const [userRepos, setUserRepos] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUserDetails();
    fetchUserRepos();
  }, [userId]);

  const fetchUserDetails = async () => {
    if (userId) {
      try {
        const response = await axios.get(`http://localhost:3002/userProfile/${userId}`);
        if (response.data) {
          setUserDetails(response.data);
          setEditFormData(response.data);
        }
      } catch (err) {
        console.error("Cannot fetch user details: ", err);
      }
    }
  };

  const fetchUserRepos = async () => {
    if (userId) {
      try {
        const res = await axios.get(`http://localhost:3002/userRepos/${userId}`);
        if (Array.isArray(res.data)) {
          setUserRepos(res.data);
        }
      } catch (err) {
        // Fallback dummy pinned repos if endpoint returns empty
        setUserRepos([
          { _id: "1", name: "GitHub-Clone", description: "Full-stack GitHub clone with React, Node, Express & MongoDB", language: "JavaScript", stars: 12, forks: 4 },
          { _id: "2", name: "awesome-react-tools", description: "Collection of essential React custom hooks & utilities", language: "TypeScript", stars: 45, forks: 9 },
          { _id: "3", name: "developer-portfolio", description: "Minimalist dark theme portfolio built with Vite", language: "HTML", stars: 8, forks: 1 },
        ]);
      }
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be under 2MB!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData((prev) => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaveStatus("Saving changes...");
    try {
      const res = await axios.put(`http://localhost:3002/updateProfile/${userId}`, editFormData);
      if (res.data) {
        setUserDetails(res.data);
        setSaveStatus("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSaveStatus(""), 3000);
      }
    } catch (err) {
      console.error("Profile save error:", err);
      setSaveStatus(err.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="gh-page-container">
      <Navbar />

      {/* GitHub Top Tab Bar */}
      <div className="gh-tabs-header">
        <div className="gh-tabs-wrapper">
          <button className={`gh-tab-btn ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Z"/></svg>
            Overview
          </button>
          <button className={`gh-tab-btn ${activeTab === "repositories" ? "active" : ""}`} onClick={() => setActiveTab("repositories")}>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-1 1v1h1.75a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 13.25V2.5z"/></svg>
            Repositories <span className="gh-counter">{userRepos.length}</span>
          </button>
          <button className={`gh-tab-btn ${activeTab === "projects" ? "active" : ""}`} onClick={() => setActiveTab("projects")}>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0z"/></svg>
            Projects
          </button>
          <button className={`gh-tab-btn ${activeTab === "packages" ? "active" : ""}`} onClick={() => setActiveTab("packages")}>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8.878 1.08a2.25 2.25 0 0 0-1.756 0l-4.25 1.65a.75.75 0 0 0-.472.698v8.644c0 .285.161.545.418.67l4.25 2.06c.582.28 1.258.28 1.84 0l4.25-2.06a.75.75 0 0 0 .418-.67V3.428a.75.75 0 0 0-.472-.698l-4.25-1.65z"/></svg>
            Packages
          </button>
          <button className={`gh-tab-btn ${activeTab === "stars" ? "active" : ""}`} onClick={() => setActiveTab("stars")}>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg>
            Stars
          </button>
        </div>
      </div>

      <div className="gh-profile-layout">
        {/* Sidebar Profile Card */}
        <div className="gh-profile-sidebar">
          <div className="gh-avatar-container">
            {userDetails.avatarUrl ? (
              <img src={userDetails.avatarUrl} alt={userDetails.username} className="gh-profile-avatar" />
            ) : (
              <div className="gh-profile-avatar-placeholder">
                {(userDetails.username || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <label className="gh-avatar-upload-overlay" title="Upload profile picture">
              <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-8-1.5a.75.75 0 0 0-.75.75v1.5c0 .414.336.75.75.75h8a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75H4zM2 3.75C2 2.784 2.784 2 3.75 2h8.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5z"/></svg>
              <span>Edit</span>
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
            </label>
          </div>

          <div className="gh-profile-names">
            <h1 className="gh-profile-fullname">{userDetails.name || userDetails.username}</h1>
            <h2 className="gh-profile-username">@{userDetails.username}</h2>
          </div>

          {userDetails.bio && <p className="gh-profile-bio">{userDetails.bio}</p>}

          <div className="gh-profile-actions">
            {!isEditing ? (
              <button className="gh-btn-edit-profile" onClick={() => setIsEditing(true)}>
                Edit profile
              </button>
            ) : (
              <button className="gh-btn-cancel-edit" onClick={() => setIsEditing(false)}>
                Cancel editing
              </button>
            )}
            <Link to="/settings" className="gh-btn-settings" title="Account settings">
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0zm7-3.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0z"/></svg>
            </Link>
          </div>

          {/* Followers / Following */}
          <div className="gh-profile-social-stats">
            <a href="#followers" className="stat-link">
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0zM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0z"/></svg>
              <strong>14</strong> followers
            </a>
            <span>·</span>
            <a href="#following" className="stat-link">
              <strong>9</strong> following
            </a>
          </div>

          {/* Details list */}
          <div className="gh-profile-meta-list">
            {userDetails.company && (
              <div className="meta-item">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M1.75 2.5h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14.5H1.75A1.75 1.75 0 0 1 0 12.75v-8.5C0 3.284.784 2.5 1.75 2.5z"/></svg>
                <span>{userDetails.company}</span>
              </div>
            )}
            {userDetails.location && (
              <div className="meta-item">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M11.536 11.01A6 6 0 0 0 8 2a6 6 0 0 0-3.536 9.01L8 15.5l3.536-4.49zM8 9.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>
                <span>{userDetails.location}</span>
              </div>
            )}
            {userDetails.website && (
              <div className="meta-item">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M7.775 3.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25zm-4.69 9.64a.75.75 0 0 0 1.06-1.06l-1.25-1.25a2 2 0 0 1 2.83-2.83l2.5 2.5a2 2 0 0 1 0 2.83.75.75 0 0 0 1.06 1.06 3.5 3.5 0 0 0 0-4.95l-2.5-2.5a3.5 3.5 0 0 0-4.95 4.95l1.25 1.25z"/></svg>
                <a href={userDetails.website.startsWith("http") ? userDetails.website : `https://${userDetails.website}`} target="_blank" rel="noreferrer">
                  {userDetails.website}
                </a>
              </div>
            )}
            {userDetails.twitter && (
              <div className="meta-item">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M5.5 3.5h5A2.5 2.5 0 0 1 13 6v4a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 3 10V6A2.5 2.5 0 0 1 5.5 3.5z"/></svg>
                <span>@{userDetails.twitter}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="gh-profile-main">
          {/* Inline Editor Form */}
          {isEditing && (
            <div className="gh-card gh-edit-card">
              <h3>Edit Profile Details</h3>
              <form onSubmit={handleProfileSave} className="gh-edit-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editFormData.name || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="Your display name"
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    rows="3"
                    value={editFormData.bio || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    placeholder="Add a bio to your profile..."
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      value={editFormData.company || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                      placeholder="@company"
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={editFormData.location || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="text"
                      value={editFormData.website || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Twitter handle</label>
                    <input
                      type="text"
                      value={editFormData.twitter || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, twitter: e.target.value })}
                      placeholder="username"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save">Save Profile</button>
                  <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
                {saveStatus && <p className="save-status-msg">{saveStatus}</p>}
              </form>
            </div>
          )}

          {/* Overview Tab Content */}
          {activeTab === "overview" && (
            <>
              {/* Pinned Repositories */}
              <div className="gh-pinned-section">
                <div className="pinned-header">
                  <h3>Pinned Repositories</h3>
                </div>
                <div className="pinned-grid">
                  {userRepos.map((repo) => (
                    <div className="pinned-card" key={repo._id || repo.name}>
                      <div className="pinned-title">
                        <svg viewBox="0 0 16 16" width="16" height="16" fill="#8b949e"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-1 1v1h1.75a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 13.25V2.5z"/></svg>
                        <Link to="/" className="repo-name">{repo.name}</Link>
                        <span className="repo-badge">Public</span>
                      </div>
                      <p className="repo-desc">{repo.description || "No description provided."}</p>
                      <div className="repo-meta">
                        <span className="lang-tag">
                          <span className="lang-color" style={{ backgroundColor: repo.language === "TypeScript" ? "#3178c6" : "#f1e05a" }}></span>
                          {repo.language || "JavaScript"}
                        </span>
                        <span className="meta-stat">★ {repo.stars || 0}</span>
                        <span className="meta-stat">⑂ {repo.forks || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contribution Activity Heatmap */}
              <div className="gh-contribution-section">
                <h3>Contribution Activity</h3>
                <div className="heatmap-card">
                  <HeatMapProfile />
                </div>
              </div>
            </>
          )}

          {/* Repositories Tab Content */}
          {activeTab === "repositories" && (
            <div className="gh-repos-list-section">
              <div className="repos-header">
                <h3>Repositories</h3>
                <Link to="/create" className="btn-new-repo">+ New Repository</Link>
              </div>
              <div className="repos-list">
                {userRepos.map((repo) => (
                  <div className="repo-list-item" key={repo._id || repo.name}>
                    <div>
                      <Link to="/" className="repo-link-title">{repo.name}</Link>
                      <p className="repo-link-desc">{repo.description || "Public repository"}</p>
                      <span className="repo-meta-text">{repo.language} · Updated recently</span>
                    </div>
                    <button className="btn-star">★ Star</button>
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

export default Profile;
