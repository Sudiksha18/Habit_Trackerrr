import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

const Dashboard = () => {
  const habits = [
    {
      name: "Morning Exercise",
      category: "health",
      description: "30 minutes of cardio or strength training",
      streak: 3,
      frequency: "daily"
    },
    {
      name: "Read a Book",
      category: "learning",
      description: "Read at least 20 pages",
      streak: 5,
      frequency: "daily"
    }
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="title">Your Habits</h1>
        <button className="add-habit-btn">
          Add<br />New<br />Habit
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Today's Progress</span>
          <div className="metric-value">0%</div>
          <span className="metric-description">0 of 2 habits completed</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Highest Streak</span>
          <div className="metric-value">5 days</div>
          <span className="metric-description">Keep going to increase your streak!</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Weekly Average</span>
          <div className="metric-value">0.0/7</div>
          <span className="metric-description">Average habits completed per week</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Top Category</span>
          <div className="metric-value">Health</div>
          <span className="metric-description">1 habits in this category</span>
        </div>
      </div>

      <div className="habits-section">
        <h2 className="section-title">Pending (2)</h2>
        {habits.map((habit, index) => (
          <div key={index} className="habit-card">
            <div className="habit-content">
              <div className="habit-checkbox">
                <input type="checkbox" />
              </div>
              <div className="habit-details">
                <h3 className="habit-title">{habit.name}</h3>
                <span className={`habit-tag ${habit.category}`}>
                  {habit.category}
                </span>
                <p className="habit-description">{habit.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 