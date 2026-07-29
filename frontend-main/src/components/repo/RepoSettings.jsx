import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./repoSettings.css";

const RepoSettings = ({ repo }) => {
  const navigate = useNavigate();
  const [repoName, setRepoName] = useState(repo?.name || "awesome-react-app");
  const [description, setDescription] = useState(repo?.description || "");
  const [isPublic, setIsPublic] = useState(repo?.visibility ?? true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmNameInput, setConfirmNameInput] = useState("");

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteRepository = () => {
    if (confirmNameInput !== repoName) return;
    alert(`Repository "${repoName}" has been permanently deleted.`);
    navigate("/");
  };

  return (
    <div className="repo-settings-container">
      <div className="settings-section-card">
        <h3>General Settings</h3>
        <p className="settings-desc">Update repository metadata and access preferences.</p>

        {saveSuccess && (
          <div className="alert-success-banner">
            ✅ Repository settings updated successfully!
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="settings-form">
          <label>Repository Name</label>
          <input
            type="text"
            className="settings-input"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
          />

          <label>Description</label>
          <textarea
            rows="3"
            className="settings-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <label>Visibility</label>
          <div className="visibility-options">
            <label className="radio-label">
              <input
                type="radio"
                name="visibility"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
              />
              <div>
                <strong>Public</strong>
                <p>Anyone on the internet can see this repository.</p>
              </div>
            </label>

            <label className="radio-label">
              <input
                type="radio"
                name="visibility"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
              />
              <div>
                <strong>Private</strong>
                <p>You choose who can see and commit to this repository.</p>
              </div>
            </label>
          </div>

          <div className="form-submit-row">
            <button type="submit" className="btn-sm btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="danger-zone-card">
        <h3 className="danger-heading">Danger Zone</h3>

        <div className="danger-row">
          <div>
            <strong>Change repository visibility</strong>
            <p>This repository is currently {isPublic ? "Public" : "Private"}.</p>
          </div>
          <button className="btn-sm btn-secondary" onClick={() => setIsPublic(!isPublic)}>
            Make {isPublic ? "Private" : "Public"}
          </button>
        </div>

        <div className="danger-row">
          <div>
            <strong>Delete this repository</strong>
            <p>Once you delete a repository, there is no going back. Please be certain.</p>
          </div>
          <button className="btn-sm btn-danger" onClick={() => setShowDeleteModal(true)}>
            Delete Repository
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal-content danger-modal">
            <div className="modal-header">
              <h3>Are you absolutely sure?</h3>
              <button className="close-x" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>This action <strong>cannot</strong> be undone. This will permanently delete the <strong>{repoName}</strong> repository and all associated issues, pull requests, and releases.</p>
              <p>Please type <code>{repoName}</code> to confirm:</p>
              <input
                type="text"
                className="modal-input"
                value={confirmNameInput}
                onChange={(e) => setConfirmNameInput(e.target.value)}
              />

              <div className="modal-footer">
                <button className="btn-sm btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn-sm btn-danger"
                  disabled={confirmNameInput !== repoName}
                  onClick={handleDeleteRepository}
                >
                  I understand the consequences, delete this repository
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoSettings;
