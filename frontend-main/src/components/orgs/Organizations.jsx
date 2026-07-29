import React, { useState } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import "./organizations.css";

const INITIAL_ORGS = [
  {
    id: "org-1",
    name: "Acme Enterprise Software",
    handle: "acme-corp",
    description: "Building scalable cloud computing solutions and AI infrastructure.",
    avatar: "https://avatars.githubusercontent.com/u/1342004?v=4",
    membersCount: 14,
    reposCount: 8,
    members: [
      { name: "octocat", role: "Owner", avatar: "https://avatars.githubusercontent.com/u/583231?v=4" },
      { name: "developer_pro", role: "Maintainer", avatar: "https://avatars.githubusercontent.com/u/9919?v=4" }
    ],
    repos: ["acme-core-api", "acme-dashboard-ui", "acme-microservices"]
  }
];

const Organizations = () => {
  const [orgs, setOrgs] = useState(INITIAL_ORGS);
  const [selectedOrg, setSelectedOrg] = useState(INITIAL_ORGS[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgHandle, setOrgHandle] = useState("");
  const [orgDesc, setOrgDesc] = useState("");

  const handleCreateOrg = (e) => {
    e.preventDefault();
    if (!orgName.trim() || !orgHandle.trim()) return;

    const newOrg = {
      id: "org-" + Date.now(),
      name: orgName,
      handle: orgHandle.toLowerCase(),
      description: orgDesc || "No description provided.",
      avatar: "https://avatars.githubusercontent.com/u/1342004?v=4",
      membersCount: 1,
      reposCount: 0,
      members: [{ name: "you", role: "Owner", avatar: "https://avatars.githubusercontent.com/u/583231?v=4" }],
      repos: []
    };

    setOrgs([...orgs, newOrg]);
    setSelectedOrg(newOrg);
    setOrgName("");
    setOrgHandle("");
    setOrgDesc("");
    setShowCreateModal(false);
  };

  return (
    <div className="orgs-page-container dark-bg">
      <Navbar />

      <header className="orgs-header">
        <div className="orgs-header-inner">
          <div>
            <h1>GitHub Organizations 🏢</h1>
            <p>Collaborate across teams, manage repository permissions, and centralize projects.</p>
          </div>
          <button className="btn-sm btn-primary" onClick={() => setShowCreateModal(true)}>
            + New Organization
          </button>
        </div>
      </header>

      <main className="orgs-main-content">
        <div className="orgs-grid-layout">
          {/* Left Sidebar: Orgs list */}
          <div className="orgs-sidebar-card">
            <div className="sidebar-title">Your Organizations ({orgs.length})</div>
            <div className="orgs-list">
              {orgs.map((org) => (
                <div
                  key={org.id}
                  className={`org-item ${selectedOrg?.id === org.id ? "active" : ""}`}
                  onClick={() => setSelectedOrg(org)}
                >
                  <img src={org.avatar} alt="org" className="org-avatar-sm" />
                  <div className="org-item-text">
                    <strong>{org.name}</strong>
                    <span>@{org.handle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Selected Org detail */}
          <div className="org-detail-card">
            {selectedOrg && (
              <div>
                <div className="org-banner-header">
                  <img src={selectedOrg.avatar} alt="avatar" className="org-banner-avatar" />
                  <div>
                    <h2>{selectedOrg.name}</h2>
                    <span className="org-handle-pill">@{selectedOrg.handle}</span>
                    <p className="org-desc-text">{selectedOrg.description}</p>
                  </div>
                </div>

                <div className="org-tabs-section">
                  <h3>Team Members ({selectedOrg.members.length})</h3>
                  <div className="members-grid">
                    {selectedOrg.members.map((m, idx) => (
                      <div key={idx} className="member-card">
                        <img src={m.avatar} alt="m" className="member-avatar" />
                        <div>
                          <strong>{m.name}</strong>
                          <span className="member-role-badge">{m.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="section-margin-top">Organization Repositories</h3>
                  <div className="org-repos-list">
                    {selectedOrg.repos.length === 0 ? (
                      <p className="empty-text">No repositories linked to this organization yet.</p>
                    ) : (
                      selectedOrg.repos.map((r, rIdx) => (
                        <div key={rIdx} className="org-repo-item">
                          <span className="icon">📘</span>
                          <Link to="/repo/demo" className="org-repo-title">{selectedOrg.handle} / {r}</Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Org Modal */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create a new GitHub Organization</h3>
              <button className="close-x" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateOrg} className="modal-body">
              <label>Organization Name</label>
              <input
                type="text"
                required
                className="modal-input"
                placeholder="e.g. Acme Corporation"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />

              <label>Organization Handle</label>
              <input
                type="text"
                required
                className="modal-input"
                placeholder="e.g. acme-corp"
                value={orgHandle}
                onChange={(e) => setOrgHandle(e.target.value)}
              />

              <label>Description</label>
              <textarea
                rows="3"
                className="modal-textarea"
                placeholder="What does your team build?"
                value={orgDesc}
                onChange={(e) => setOrgDesc(e.target.value)}
              ></textarea>

              <div className="modal-footer">
                <button type="button" className="btn-sm btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-sm btn-primary">
                  Create Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organizations;
