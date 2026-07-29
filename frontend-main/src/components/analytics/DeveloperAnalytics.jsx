import React from "react";
import Navbar from "../Navbar";
import "./developerAnalytics.css";

const DeveloperAnalytics = () => {
  return (
    <div className="analytics-page dark-bg">
      <Navbar />

      <header className="analytics-header">
        <div className="analytics-header-inner">
          <h1>Developer Productivity & AI Sentiment Matrix 📊</h1>
          <p>Advanced engineering metrics, code churn velocity, and AI workload sentiment analysis.</p>
        </div>
      </header>

      <main className="analytics-main-content">
        {/* KPI Cards Row */}
        <div className="kpi-cards-grid">
          <div className="kpi-card">
            <span className="kpi-title">Total Commits</span>
            <span className="kpi-value">142</span>
            <span className="kpi-sub green">+18% this month</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Code Churn Rate</span>
            <span className="kpi-value">+4,820 / -1,150</span>
            <span className="kpi-sub">Efficiency ratio 4.2x</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">AI Assistance Impact</span>
            <span className="kpi-value">92.4%</span>
            <span className="kpi-sub purple">High Impact Commits</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Avg PR Lead Time</span>
            <span className="kpi-value">4.2 Hours</span>
            <span className="kpi-sub green">Fast merge cycle</span>
          </div>
        </div>

        {/* Analytics Breakdown Grid */}
        <div className="analytics-charts-grid">
          {/* Language Breakdown */}
          <div className="chart-card">
            <h3>Language Distribution</h3>
            <div className="lang-bar-container">
              <div className="lang-bar js" style={{ width: "65%" }}>65% JS</div>
              <div className="lang-bar ts" style={{ width: "20%" }}>20% TS</div>
              <div className="lang-bar css" style={{ width: "15%" }}>15% CSS</div>
            </div>
            <div className="lang-legend">
              <span><span className="dot js-dot"></span> JavaScript</span>
              <span><span className="dot ts-dot"></span> TypeScript</span>
              <span><span className="dot css-dot"></span> CSS & HTML</span>
            </div>
          </div>

          {/* AI Sentiment Analysis */}
          <div className="chart-card">
            <h3>AI Sentiment Contribution Score</h3>
            <div className="sentiment-bars">
              <div className="sentiment-row">
                <span>Feature Additions</span>
                <div className="progress-bg"><div className="progress-fill green" style={{ width: "70%" }}>70%</div></div>
              </div>
              <div className="sentiment-row">
                <span>Bug Fixes & Refactoring</span>
                <div className="progress-bg"><div className="progress-fill blue" style={{ width: "20%" }}>20%</div></div>
              </div>
              <div className="sentiment-row">
                <span>Documentation & Tests</span>
                <div className="progress-bg"><div className="progress-fill purple" style={{ width: "10%" }}>10%</div></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeveloperAnalytics;
