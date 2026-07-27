import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./createRepo.css";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

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
      const res = await axios.post("http://localhost:3002/repo/create", {
        owner: userId,
        name: name.trim(),
        description: description.trim(),
        visibility: visibility,
      });

      setLoading(false);
      alert("Repository created successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.response?.data?.message || "Failed to create repository!");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-repo-container">
        <h2>Create a new repository</h2>
        <p className="subtitle">
          A repository contains all project files, including the revision history.
        </p>

        <form onSubmit={handleCreate} className="create-repo-form">
          <div className="form-group">
            <label className="label">Repository name *</label>
            <input
              type="text"
              className="input"
              value={name}
              placeholder="e.g. my-awesome-project"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Description (optional)</label>
            <input
              type="text"
              className="input"
              value={description}
              placeholder="Short description of your repository"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group visibility-group">
            <label className="label">Visibility</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === true}
                  onChange={() => setVisibility(true)}
                />
                Public
              </label>
              <label>
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === false}
                  onChange={() => setVisibility(false)}
                />
                Private
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Repository"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateRepo;
