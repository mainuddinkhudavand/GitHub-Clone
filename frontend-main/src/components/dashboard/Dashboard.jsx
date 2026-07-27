import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3002/repo/user/${userId}`
        );
        const data = await response.json();
        if (response.ok && data && Array.isArray(data.repositories)) {
          setRepositories(data.repositories);
        } else {
          setRepositories([]);
        }
      } catch (err) {
        console.error("Error while fetching user repositories: ", err);
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
        console.error("Error while fetching suggested repositories: ", err);
        setSuggestedRepositories([]);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

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
    <>
      <Navbar />
      <section id="dashboard">
        <aside className="dashboard-aside">
          <h3>Explore Repositories</h3>
          {suggestedRepositories.length === 0 ? (
            <p className="empty-text">No suggested repositories available.</p>
          ) : (
            suggestedRepositories.map((repo) => (
              <div key={repo._id || repo.name} className="suggested-repo-card">
                <h4>{repo.name}</h4>
                <p>{repo.description || "No description provided."}</p>
              </div>
            ))
          )}
        </aside>

        <main className="dashboard-main">
          <div className="main-header">
            <h2>Your Repositories</h2>
            <Link to="/create" className="new-repo-btn">
              + New Repository
            </Link>
          </div>

          <div id="search">
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              placeholder="Find a repository..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="loading-text">Loading repositories...</p>
          ) : searchResults.length === 0 ? (
            <div className="empty-repo-box">
              <p>You don't have any repositories matching your criteria yet.</p>
              <Link to="/create" className="create-first-link">
                Create a repository
              </Link>
            </div>
          ) : (
            searchResults.map((repo) => (
              <div key={repo._id} className="repo-card">
                <div className="repo-header">
                  <h4>{repo.name}</h4>
                  <span className={`badge ${repo.visibility ? "public" : "private"}`}>
                    {repo.visibility ? "Public" : "Private"}
                  </span>
                </div>
                <p className="repo-desc">
                  {repo.description || "No description provided."}
                </p>
              </div>
            ))
          )}
        </main>

        <aside className="dashboard-aside">
          <h3>Upcoming Events</h3>
          <ul className="events-list">
            <li>
              <p className="event-title">Tech Conference</p>
              <span className="event-date">Dec 15</span>
            </li>
            <li>
              <p className="event-title">Developer Meetup</p>
              <span className="event-date">Dec 25</span>
            </li>
            <li>
              <p className="event-title">React Summit</p>
              <span className="event-date">Jan 5</span>
            </li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
