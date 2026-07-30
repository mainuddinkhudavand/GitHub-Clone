import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./createRepo.css";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [addReadme, setAddReadme] = useState(true);
  const [gitignoreTemplate, setGitignoreTemplate] = useState("Node");
  const [license, setLicense] = useState("MIT");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ username: "user" });
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      const token = localStorage.getItem("token");
      axios.get(`http://localhost:3002/userProfile/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => { if (res.data) setUser(res.data); })
        .catch((err) => console.error(err));
    }
  }, [userId]);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please login first!");
      navigate("/auth");
      return;
    }

    if (!name.trim()) {
      alert("Repository name is required!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3002/repo/create", {
        owner: userId,
        name: name.trim(),
        description: description.trim(),
        visibility: visibility,
        readme: addReadme,
        gitignore: gitignoreTemplate,
        license: license,
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setLoading(false);
      alert(`Repository '${name.trim()}' created successfully!`);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.response?.data?.message || "Failed to create repository!");
      setLoading(false);
    }
  };

  return (
    <div className="gh-page-container">
      <Navbar />
      <div className="create-repo-container">
        <div className="create-repo-header">
          <h2>Create a new repository</h2>
          <p className="subtitle">
            A repository contains all project files, including the revision history and issue tracking.
          </p>
        </div>

        <form onSubmit={handleCreate} className="create-repo-form">
          <div className="owner-repo-row">
            <div className="form-group owner-group">
              <label className="label">Owner *</label>
              <div className="owner-badge">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="owner-avatar" />
                ) : (
                  <div className="owner-avatar-placeholder">{(user.username || "U").charAt(0).toUpperCase()}</div>
                )}
                <span>{user.username}</span>
              </div>
            </div>
            <span className="slash-separator">/</span>
            <div className="form-group repo-name-group">
              <label className="label">Repository name *</label>
              <input
                type="text"
                className="input"
                value={name}
                placeholder="e.g. my-awesome-project"
                onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                required
              />
            </div>
          </div>
          <p className="field-hint">Great repository names are short and memorable. Need inspiration? How about <strong>super-duper-app</strong>?</p>

          <div className="form-group">
            <label className="label">Description (optional)</label>
            <input
              type="text"
              className="input"
              value={description}
              placeholder="Short summary of your repository"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="divider" />

          {/* Visibility Options */}
          <div className="visibility-options">
            <label className={`vis-card ${visibility === true ? "selected" : ""}`}>
              <input
                type="radio"
                name="visibility"
                checked={visibility === true}
                onChange={() => setVisibility(true)}
              />
              <svg viewBox="0 0 16 16" width="24" height="24" fill="#8b949e" style={{ flexShrink: 0 }}><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-1 1v1h1.75a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 13.25V2.5z"/></svg>
              <div>
                <strong>Public</strong>
                <p>Anyone on the internet can see this repository. You choose who can commit.</p>
              </div>
            </label>

            <label className={`vis-card ${visibility === false ? "selected" : ""}`}>
              <input
                type="radio"
                name="visibility"
                checked={visibility === false}
                onChange={() => setVisibility(false)}
              />
              <svg viewBox="0 0 16 16" width="24" height="24" fill="#8b949e" style={{ flexShrink: 0 }}><path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4V4zm4-2.5A2.5 2.5 0 0 0 5.5 4v2h5V4A2.5 2.5 0 0 0 8 1.5z"/></svg>
              <div>
                <strong>Private</strong>
                <p>You choose who can see and commit to this repository.</p>
              </div>
            </label>
          </div>

          <div className="divider" />

          {/* Initialization Settings */}
          <div className="init-section">
            <h3>Initialize this repository with:</h3>
            
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={addReadme}
                onChange={(e) => setAddReadme(e.target.checked)}
              />
              <div>
                <strong>Add a README file</strong>
                <p>This is where you can write a long description for your project.</p>
              </div>
            </label>

            <div className="select-row">
              <div className="form-group">
                <label className="label">Add .gitignore template</label>
                <select value={gitignoreTemplate} onChange={(e) => setGitignoreTemplate(e.target.value)} className="select-input">
                  <option value="None">None</option>
                  <option value="Node">Node.js</option>
                  <option value="Python">Python</option>
                  <option value="React">React</option>
                  <option value="Go">Go</option>
                </select>
              </div>

              <div className="form-group">
                <label className="label">Choose a license</label>
                <select value={license} onChange={(e) => setLicense(e.target.value)} className="select-input">
                  <option value="None">None</option>
                  <option value="MIT">MIT License</option>
                  <option value="Apache-2.0">Apache License 2.0</option>
                  <option value="GPL-3.0">GNU General Public License v3.0</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divider" />

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating repository..." : "Create Repository"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRepo;
