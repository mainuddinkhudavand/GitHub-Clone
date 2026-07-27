import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import logo from "../assets/github-mark-white.svg";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate("/")}>
          <img src={logo} alt="GitHub Logo" className="navbar-logo" />
          <span className="navbar-title">GitHub Clone</span>
        </div>

        <nav className="navbar-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/create" className="nav-link nav-btn">+ Create Repository</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
