import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import "./settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("public-profile");
  const [user, setUser] = useState({
    username: "",
    name: "",
    email: "",
    bio: "",
    company: "",
    location: "",
    website: "",
    twitter: "",
    avatarUrl: "",
    themePreference: "dark",
  });

  const [formData, setFormData] = useState({});
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [newPassword, setNewPassword] = useState("");
  const [tokens, setTokens] = useState([]);
  const [tokenName, setTokenName] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    if (userId) {
      try {
        const res = await axios.get(`http://localhost:3002/userProfile/${userId}`);
        if (res.data) {
          setUser(res.data);
          setFormData(res.data);
        }
      } catch (err) {
        console.error("Failed to load settings profile:", err);
      }
    }
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setStatusMsg("Avatar file size must be less than 2MB!");
        setStatusType("error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setStatusMsg("Saving settings...");
    setStatusType("info");

    const payload = { ...formData };
    if (newPassword.trim()) {
      payload.password = newPassword;
    }

    try {
      const res = await axios.put(`http://localhost:3002/updateProfile/${userId}`, payload);
      if (res.data) {
        setUser(res.data);
        setFormData(res.data);
        setNewPassword("");
        setStatusMsg("Settings saved successfully!");
        setStatusType("success");
        setTimeout(() => setStatusMsg(""), 3500);
      }
    } catch (err) {
      console.error("Failed to update settings:", err);
      setStatusMsg(err.response?.data?.message || "Failed to update settings.");
      setStatusType("error");
    }
  };

  const handleGenerateToken = (e) => {
    e.preventDefault();
    if (!tokenName.trim()) return;
    const newToken = {
      id: Date.now(),
      name: tokenName,
      token: `ghp_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toLocaleDateString(),
    };
    setTokens([newToken, ...tokens]);
    setTokenName("");
  };

  return (
    <div className="gh-page-container">
      <Navbar />

      <div className="gh-settings-wrapper">
        {/* Settings Sidebar Navigation */}
        <aside className="gh-settings-sidebar">
          <div className="settings-user-preview">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} className="sidebar-avatar" />
            ) : (
              <div className="sidebar-avatar-placeholder">
                {(user.username || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <strong className="sidebar-user-name">{user.name || user.username}</strong>
              <span className="sidebar-user-handle">Your personal account</span>
            </div>
          </div>

          <nav className="settings-nav-menu">
            <button
              className={`settings-nav-item ${activeSection === "public-profile" ? "active" : ""}`}
              onClick={() => setActiveSection("public-profile")}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0zM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0z"/></svg>
              Public Profile
            </button>

            <button
              className={`settings-nav-item ${activeSection === "account" ? "active" : ""}`}
              onClick={() => setActiveSection("account")}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0zm7-3.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0z"/></svg>
              Account & Username
            </button>

            <button
              className={`settings-nav-item ${activeSection === "appearance" ? "active" : ""}`}
              onClick={() => setActiveSection("appearance")}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11z"/></svg>
              Appearance & Theme
            </button>

            <button
              className={`settings-nav-item ${activeSection === "developer-tools" ? "active" : ""}`}
              onClick={() => setActiveSection("developer-tools")}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M4.72 3.22a.75.75 0 0 1 1.06 1.06L2.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25zm6.56 0a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L14.94 8l-3.72-3.72a.75.75 0 0 1 0-1.06z"/></svg>
              Developer Access Tokens
            </button>
          </nav>
        </aside>

        {/* Settings Main Content */}
        <main className="gh-settings-content">
          {statusMsg && (
            <div className={`settings-alert ${statusType}`}>
              {statusMsg}
            </div>
          )}

          {/* Section 1: Public Profile */}
          {activeSection === "public-profile" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Public Profile</h2>
                <p>Manage how your information appears across GitHub.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="settings-form">
                <div className="avatar-edit-row">
                  <div className="avatar-preview">
                    {formData.avatarUrl ? (
                      <img src={formData.avatarUrl} alt="Avatar Preview" className="preview-img" />
                    ) : (
                      <div className="preview-placeholder">
                        {(formData.username || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="avatar-upload-info">
                    <label className="btn-upload-avatar">
                      Upload new picture
                      <input type="file" accept="image/*" onChange={handleAvatarFile} hidden />
                    </label>
                    <p className="field-hint">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your display name"
                  />
                  <p className="field-hint">Your name may appear around GitHub where you contribute or are mentioned.</p>
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    rows="3"
                    value={formData.bio || ""}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us a little about yourself..."
                  />
                  <p className="field-hint">You can @mention other users and organizations to link to them.</p>
                </div>

                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={formData.company || ""}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="@company name"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="text"
                    value={formData.website || ""}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="form-group">
                  <label>Twitter username</label>
                  <input
                    type="text"
                    value={formData.twitter || ""}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="username"
                  />
                </div>

                <button type="submit" className="btn-primary-save">Update profile</button>
              </form>
            </div>
          )}

          {/* Section 2: Account & Username */}
          {activeSection === "account" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Account Settings</h2>
                <p>Change your username, email, and password credentials.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="settings-form">
                <div className="form-group">
                  <label>Change Username</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">github.com/</span>
                    <input
                      type="text"
                      value={formData.username || ""}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <p className="field-hint">Changing your username can have unintended side effects for existing links.</p>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <p className="field-hint">Your email is used for account notifications and security alerts.</p>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                  />
                  <p className="field-hint">Minimum 8 characters with numbers and symbols.</p>
                </div>

                <button type="submit" className="btn-primary-save">Save account changes</button>
              </form>
            </div>
          )}

          {/* Section 3: Appearance */}
          {activeSection === "appearance" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Theme Preferences</h2>
                <p>Choose how GitHub looks to you.</p>
              </div>

              <div className="theme-options-grid">
                <div
                  className={`theme-card ${formData.themePreference === "dark" ? "selected" : ""}`}
                  onClick={() => setFormData({ ...formData, themePreference: "dark" })}
                >
                  <div className="theme-preview dark-theme">
                    <div className="preview-header"></div>
                    <div className="preview-body"></div>
                  </div>
                  <strong>GitHub Dark (Default)</strong>
                </div>

                <div
                  className={`theme-card ${formData.themePreference === "dark-dimmed" ? "selected" : ""}`}
                  onClick={() => setFormData({ ...formData, themePreference: "dark-dimmed" })}
                >
                  <div className="theme-preview dimmed-theme">
                    <div className="preview-header"></div>
                    <div className="preview-body"></div>
                  </div>
                  <strong>Dark Dimmed</strong>
                </div>
              </div>

              <button type="button" className="btn-primary-save" style={{ marginTop: "24px" }} onClick={handleSaveSettings}>
                Apply Theme
              </button>
            </div>
          )}

          {/* Section 4: Developer Access Tokens */}
          {activeSection === "developer-tools" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Personal Access Tokens</h2>
                <p>Tokens you have generated that can be used to access the GitHub API.</p>
              </div>

              <form onSubmit={handleGenerateToken} className="token-form">
                <div className="form-group">
                  <label>Token Description / Note</label>
                  <input
                    type="text"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="e.g., CLI deployment script or automation token"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary-save">Generate new token</button>
              </form>

              <div className="tokens-list">
                <h3>Active Tokens</h3>
                {tokens.length === 0 ? (
                  <p className="no-tokens-text">No personal access tokens generated yet.</p>
                ) : (
                  tokens.map((t) => (
                    <div className="token-item" key={t.id}>
                      <div>
                        <strong>{t.name}</strong>
                        <div className="token-code">{t.token}</div>
                        <span className="token-date">Created on {t.createdAt}</span>
                      </div>
                      <button
                        className="btn-revoke-token"
                        onClick={() => setTokens(tokens.filter((tok) => tok.id !== t.id))}
                      >
                        Revoke
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
