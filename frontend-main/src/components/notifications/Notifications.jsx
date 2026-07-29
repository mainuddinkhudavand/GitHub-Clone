import React, { useState } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import "./notifications.css";

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "issue", // issue, pr, star, action
    icon: "🟢",
    title: "octocat mentioned you in Issue #12",
    repo: "awesome-react-app",
    time: "10 mins ago",
    read: false,
    preview: "Hey @you, could you review the latest CSS dark mode tokens?"
  },
  {
    id: "notif-2",
    type: "pr",
    icon: "🔀",
    title: "developer_pro requested your review on PR #1",
    repo: "awesome-react-app",
    time: "2 hours ago",
    read: false,
    preview: "feat(ui): add Primer Dark Theme and responsive navigation bar"
  },
  {
    id: "notif-3",
    type: "action",
    icon: "✅",
    title: "Workflow run 'Build and Test Node.js' succeeded",
    repo: "awesome-react-app",
    time: "3 hours ago",
    read: true,
    preview: "All 12 automated unit tests passed cleanly."
  },
  {
    id: "notif-4",
    type: "star",
    icon: "⭐",
    title: "dev_guy starred your repository awesome-react-app",
    repo: "awesome-react-app",
    time: "1 day ago",
    read: true,
    preview: "Your star count reached 12 stars!"
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const toggleRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "issue") return n.type === "issue";
    if (filter === "pr") return n.type === "pr";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications-page dark-bg">
      <Navbar />

      <header className="notif-header">
        <div className="notif-header-inner">
          <div className="notif-title-row">
            <h1>Notifications Center 🔔</h1>
            {unreadCount > 0 && <span className="unread-pill">{unreadCount} unread</span>}
          </div>
          {unreadCount > 0 && (
            <button className="btn-sm btn-secondary" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>
      </header>

      <main className="notif-main-content">
        <div className="notif-tabs-bar">
          <button className={`tab-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            All
          </button>
          <button className={`tab-btn ${filter === "unread" ? "active" : ""}`} onClick={() => setFilter("unread")}>
            Unread ({unreadCount})
          </button>
          <button className={`tab-btn ${filter === "issue" ? "active" : ""}`} onClick={() => setFilter("issue")}>
            Issues
          </button>
          <button className={`tab-btn ${filter === "pr" ? "active" : ""}`} onClick={() => setFilter("pr")}>
            Pull Requests
          </button>
        </div>

        <div className="notif-list-card">
          {filteredNotifs.length === 0 ? (
            <div className="empty-notif-box">
              <h3>All caught up! 🎉</h3>
              <p>You have no notifications matching this filter.</p>
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div key={n.id} className={`notif-item-row ${n.read ? "read" : "unread"}`}>
                <span className="notif-icon">{n.icon}</span>

                <div className="notif-info-col">
                  <div className="notif-title-line">
                    <Link to="/repo/demo" className="notif-title-text">
                      {n.title}
                    </Link>
                    <span className="notif-repo-tag">{n.repo}</span>
                  </div>
                  <p className="notif-preview-text">{n.preview}</p>
                  <span className="notif-time-stamp">{n.time}</span>
                </div>

                <div className="notif-action-col">
                  <button className="btn-read-toggle" onClick={() => toggleRead(n.id)}>
                    {n.read ? "Mark unread" : "Mark read"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
