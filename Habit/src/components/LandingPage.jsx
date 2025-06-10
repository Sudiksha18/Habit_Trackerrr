import React from 'react';
import './LandingPage.css';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartTracking = () => {
    navigate('/login');
  };

  // Remove handleTryDemo function

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/" className="logo">HabitTracker</Link>
          <div className="nav-buttons">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </div>
        </div>
      </nav>

      <main className="hero-section">
        <div className="hero-content">
          <div className="title-container">
            <h1 className="main-title">Build Better Habits,</h1>
            <h2 className="subtitle">One Day at a Time</h2>
          </div>
          <p className="description">
            Track, manage, and visualize your daily habits to create lasting positive<br />change in your life.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="get-started-btn">Get Started →</Link>
            {/* Remove try-demo button */}
          </div>
        </div>
      </main>

      <section className="features-section">
        <div className="features-content">
          <h2 className="features-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Track Your Habits</h3>
              <p>Create and track daily, weekly, or custom habits to build a better you.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>See Your Progress</h3>
              <p>Visualize your growth with beautiful analytics and track your streak.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Stay Consistent</h3>
              <p>Build consistency with streak tracking and achieve your long-term goals.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Achieve Your Goals</h3>
              <p>Transform your life by building positive habits that stick.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Create Your Habits</h3>
              <p>Add the habits you want to develop or maintain. Categorize them and set your frequency goals.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Track Consistently</h3>
              <p>Check off your habits as you complete them each day. Build streaks and see your progress over time.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Analyze & Improve</h3>
              <p>View your statistics and trends to understand your patterns and improve your consistency.</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Build Better Habits?</h2>
          <p>Start your journey toward positive change today with HabitTrack.</p>
          <button 
            className="start-tracking-btn" 
            onClick={handleStartTracking}
          >
            Start Tracking Now →
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;