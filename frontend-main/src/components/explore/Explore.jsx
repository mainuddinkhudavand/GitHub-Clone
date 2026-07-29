import React, { useState } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import "./explore.css";

const EXPLORE_REPOS = [
  {
    id: "exp-1",
    name: "facebook/react",
    description: "The library for web and native user interfaces.",
    stars: "224.5k",
    forks: "45.2k",
    language: "JavaScript",
    langColor: "#f1e05a",
    updated: "Updated 1 hour ago",
    topics: ["react", "ui", "frontend"]
  },
  {
    id: "exp-2",
    name: "vercel/next.js",
    description: "The React Framework for the Web. Used by top engineering teams globally.",
    stars: "121.8k",
    forks: "26.1k",
    language: "TypeScript",
    langColor: "#3178c6",
    updated: "Updated 3 hours ago",
    topics: ["nextjs", "react", "ssr"]
  },
  {
    id: "exp-3",
    name: "torvalds/linux",
    description: "Linux kernel source tree.",
    stars: "172.1k",
    forks: "54.8k",
    language: "C",
    langColor: "#555555",
    updated: "Updated 30 mins ago",
    topics: ["kernel", "os", "linux"]
  },
  {
    id: "exp-4",
    name: "openai/gpt-3",
    description: "GPT-3 model architecture specifications and dataset loader utilities.",
    stars: "94.2k",
    forks: "18.3k",
    language: "Python",
    langColor: "#3572A5",
    updated: "Updated 1 day ago",
    topics: ["ai", "machine-learning", "gpt"]
  },
  {
    id: "exp-5",
    name: "shadcn/ui",
    description: "Beautifully designed components that you can copy and paste into your apps.",
    stars: "62.4k",
    forks: "4.9k",
    language: "TypeScript",
    langColor: "#3178c6",
    updated: "Updated 4 hours ago",
    topics: ["ui", "tailwind", "components"]
  }
];

const Explore = () => {
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [search, setSearch] = useState("");
  const [starredMap, setStarredMap] = useState({});

  const toggleStar = (id) => {
    setStarredMap({ ...starredMap, [id]: !starredMap[id] });
  };

  const filtered = EXPLORE_REPOS.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesTopic =
      selectedTopic === "All" || r.topics.includes(selectedTopic.toLowerCase());
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="explore-page-container dark-bg">
      <Navbar />

      <header className="explore-hero-header">
        <div className="explore-hero-inner">
          <h1>Explore GitHub Repositories 🌟</h1>
          <p>Discover trending projects, popular open-source repositories, and developer ecosystems.</p>

          <div className="explore-search-bar">
            <input
              type="text"
              placeholder="Search trending repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="explore-main-content">
        {/* Topic Filters */}
        <div className="topic-pills-row">
          {["All", "React", "TypeScript", "Python", "UI", "AI"].map((topic) => (
            <button
              key={topic}
              className={`topic-pill ${selectedTopic === topic ? "active" : ""}`}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Repository Grid */}
        <div className="explore-repos-grid">
          {filtered.map((repo) => (
            <div key={repo.id} className="explore-repo-card">
              <div className="card-header-line">
                <Link to="/repo/demo" className="explore-repo-title">
                  {repo.name}
                </Link>
                <button
                  className={`btn-sm btn-star ${starredMap[repo.id] ? "starred" : ""}`}
                  onClick={() => toggleStar(repo.id)}
                >
                  ★ {starredMap[repo.id] ? "Starred" : "Star"}
                </button>
              </div>

              <p className="explore-repo-desc">{repo.description}</p>

              <div className="explore-topics-list">
                {repo.topics.map((t) => (
                  <span key={t} className="topic-badge">
                    {t}
                  </span>
                ))}
              </div>

              <div className="explore-card-footer">
                <div className="lang-stat">
                  <span className="lang-dot" style={{ backgroundColor: repo.langColor }} />
                  <span>{repo.language}</span>
                </div>
                <span className="stat-item">⭐ {repo.stars}</span>
                <span className="stat-item">🔀 {repo.forks}</span>
                <span className="stat-time">{repo.updated}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Explore;
