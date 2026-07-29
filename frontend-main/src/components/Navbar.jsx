import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./navbar.css";
import logo from "../assets/github-mark-white.svg";
import { useAuth } from "../authContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState({ username: "User", avatarUrl: "" });
  const dropdownRef = useRef(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const res = await axios.get(`http://localhost:3002/userProfile/${userId}`);
          if (res.data) {
            setUser(res.data);
          }
        } catch (err) {
          console.error("Failed to fetch navbar user:", err);
        }
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    window.location.href = "/auth";
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="gh-header">
      <div className="gh-header-container">
        {/* Left Section: Brand & Search */}
        <div className="gh-header-left">
          <Link to="/" className="gh-logo-link" title="GitHub Dashboard">
            <img src={logo} alt="GitHub" className="gh-logo" />
          </Link>

          <form className="gh-search-form" onSubmit={handleSearchSubmit}>
            <div className="gh-search-wrapper">
              <svg className="gh-search-icon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M10.68 11.74a6 6 0 1 1 1.06-1.06l3.04 3.04a.75.75 0 1 1-1.06 1.06l-3.04-3.04zM11.5 7a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0z"/>
              </svg>
              <input
                type="text"
                className="gh-search-input"
                placeholder="Type '/' to search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="gh-search-badge">/</span>
            </div>
          </form>

          <nav className="gh-nav-links">
            <Link to="/" className="gh-nav-item">Dashboard</Link>
            <Link to="/explore" className="gh-nav-item">Explore</Link>
            <Link to="/gists" className="gh-nav-item">Gists</Link>
            <Link to="/orgs" className="gh-nav-item">Organizations</Link>
            <Link to="/notifications" className="gh-nav-item">Notifications</Link>
            <Link to="/analytics" className="gh-nav-item highlight-ai">📊 AI Analytics</Link>
          </nav>
        </div>

        {/* Right Section: Actions & User Avatar */}
        <div className="gh-header-right">
          <Link to="/create" className="gh-btn-create" title="Create new repository">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ marginRight: "4px" }}>
              <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2z"/>
            </svg>
            <span>New</span>
          </Link>

          {/* User Profile Dropdown Menu */}
          <div className="gh-user-menu-container" ref={dropdownRef}>
            <button
              className="gh-avatar-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title={user.username || "User profile"}
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} className="gh-avatar-img" />
              ) : (
                <div className="gh-avatar-placeholder">
                  {(user.username || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style={{ marginLeft: "4px" }}>
                <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"/>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="gh-dropdown-menu">
                <div className="gh-dropdown-header">
                  <span className="gh-dropdown-signedin">Signed in as</span>
                  <strong className="gh-dropdown-username">@{user.username || "user"}</strong>
                </div>
                <div className="gh-dropdown-divider" />
                <Link to="/profile" className="gh-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0zM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0z"/></svg>
                  Your Profile
                </Link>
                <Link to="/" className="gh-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-1 1v1h1.75a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 13.25V2.5z"/></svg>
                  Your Repositories
                </Link>
                <Link to="/settings" className="gh-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0zm7-3.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0z"/></svg>
                  Settings & Profile
                </Link>
                <div className="gh-dropdown-divider" />
                <button className="gh-dropdown-item logout-item" onClick={handleLogout}>
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25V2.75zm10.44 4.5H6.75a.75.75 0 0 0 0 1.5h5.69l-1.97 1.97a.75.75 0 1 0 1.06 1.06l3.25-3.25a.75.75 0 0 0 0-1.06l-3.25-3.25a.75.75 0 1 0-1.06 1.06l1.97 1.97z"/></svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
