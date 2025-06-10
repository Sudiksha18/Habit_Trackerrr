import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiGrid, FiBarChart2, FiUsers, FiSettings, FiLogOut, FiBell, FiUser, FiLock } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';
import { Calendar } from 'lucide-react';
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("notifications");
  const [notificationSettings, setNotificationSettings] = useState({
    dailyReminders: false,
    weeklyReport: true,
    emailNotifications: true,
    pushNotifications: false,
  });

  // Toggle Switch Handler
  const toggleSetting = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
  };

  // Clear Data Handler
  const handleClearData = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all your data? This action cannot be undone."
    );

    if (confirmDelete) {
      localStorage.clear(); // Clear all stored data
      setNotificationSettings({ // Reset state
        dailyReminders: false,
        weeklyReport: false,
        emailNotifications: false,
        pushNotifications: false,
      });

      alert("All data has been cleared!");
      navigate("/dashboard"); // Redirect user after clearing data
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar bg-white border-end p-4 d-flex flex-column" style={{width: '250px'}}>
        <h1 className="h5 mb-4 fw-semibold">HabitTracker</h1>
        <nav className="flex-grow-1">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/dashboard" style={{ fontSize: '1.55rem' }}>
                <FiGrid size={16} />Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/statistics"style={{ fontSize: '1.55rem' }}>
                <FiBarChart2 size={16} />Statistics
              </Link>
            </li>
            
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/team" style={{ fontSize: '1.55rem' }}>
                <FiUsers size={16} />Team
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/calendar" style={{ fontSize: '1.55rem' }}>
                <Calendar size={16} />Calendar
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-dark fw-medium" to="/settings" style={{ fontSize: '1.55rem' }}>
                <FiSettings size={16} />Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="user-info border-top pt-3 mt-auto">
          {/* <p className="text-secondary small mb-1">Signed in as:</p>
          <p className="mb-1 fw-medium">User</p>
          <p className="text-secondary small mb-3">user@gmail.com</p> */}
          <button onClick={() => navigate('/')} className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"><FiLogOut size={16} />Log out</button>
        </div>
      </aside>

      <main className="flex-grow-1 bg-white p-4 overflow-auto">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="h3 mb-2 fw-semibold">Settings</h2>
            <p className="text-muted mb-0" style={{color: '#667085'}}>Manage your account and preferences</p>
          </div>
        </div>

        <div className="nav nav-tabs border-0 mb-4 bg-light rounded-4 p-2 d-flex gap-2 w-75 mx-auto justify-content-center" style={{maxWidth: '600px', margin: '0 auto'}}>
          <button className={`nav-link border-0 px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${activeTab === "profile" ? "bg-white shadow-sm text-dark" : "text-secondary bg-transparent"}`} onClick={() => setActiveTab("profile")}>
            <FiUser size={18} /> Profile
          </button>
          <button className={`nav-link border-0 px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${activeTab === "notifications" ? "bg-white shadow-sm text-dark" : "text-secondary bg-transparent"}`} onClick={() => setActiveTab("notifications")}>
            <FiBell size={18} /> Notifications
          </button>
          <button className={`nav-link border-0 px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${activeTab === "account" ? "bg-white shadow-sm text-dark" : "text-secondary bg-transparent"}`} onClick={() => setActiveTab("account")}>
            <FiLock size={18} /> Account
          </button>
        </div>

        {/* Tab Content */}
        <div className="settings-content bg-light rounded-3 p-4">
          {activeTab === "profile" && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h3 className="h5 mb-4 fw-semibold">Profile Information</h3>
                <div className="mb-3">
                  <label className="form-label text-muted">Name</label>
                  <input type="text" className="form-control" placeholder="John Doe" />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted">Email</label>
                  <input type="email" className="form-control" placeholder="john.doe@example.com" />
                </div>
                <button className="btn btn-dark w-100">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h3 className="h5 mb-4 fw-semibold">Notification Settings</h3>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                    <div>
                      <h4 className="h6 mb-1">Daily Reminders</h4>
                      <p className="text-muted mb-0">Receive a daily reminder to complete your habits</p>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" role="switch" checked={notificationSettings.dailyReminders} onChange={() => toggleSetting("dailyReminders")} style={{width: '48px', height: '24px'}} />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                    <div>
                      <h4 className="h6 mb-1">Weekly Report</h4>
                      <p className="text-muted mb-0">Get a weekly summary of your habit progress</p>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" role="switch" checked={notificationSettings.weeklyReport} onChange={() => toggleSetting("weeklyReport")} style={{width: '48px', height: '24px'}} />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                    <div>
                      <h4 className="h6 mb-1">Email Notifications</h4>
                      <p className="text-muted mb-0">Receive notifications via email</p>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" role="switch" checked={notificationSettings.emailNotifications} onChange={() => toggleSetting("emailNotifications")} style={{width: '48px', height: '24px'}} />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-4">
                    <div>
                      <h4 className="h6 mb-1">Push Notifications</h4>
                      <p className="text-muted mb-0">Receive push notifications in your browser</p>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" role="switch" checked={notificationSettings.pushNotifications} onChange={() => toggleSetting("pushNotifications")} style={{width: '48px', height: '24px'}} />
                    </div>
                  </div>
                </div>
                <button className="btn btn-dark w-100 mt-4">Save Notification Settings</button>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h3 className="h5 mb-4 fw-semibold">Account Management</h3>
                <div className="mb-3">
                  <label className="form-label text-muted">Current Password</label>
                  <input type="password" className="form-control" placeholder="Enter current password" />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">New Password</label>
                  <input type="password" className="form-control" placeholder="Enter new password" />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted">Confirm New Password</label>
                  <input type="password" className="form-control" placeholder="Confirm new password" />
                </div>
                <button className="btn btn-dark w-100 mb-4">Update Password</button>

                <div className="border-top pt-4 mt-2">
                  <h4 className="h6 mb-3 fw-semibold text-danger d-flex align-items-center gap-2"><FiTrash2 /> Danger Zone</h4>
                  <p className="text-muted small mb-3">Permanently delete all your data and habits.</p>
                  <button className="btn btn-outline-danger w-100" onClick={handleClearData}>Clear All Data</button>
                </div>
              </div>
            </div>
          )}
        </div>

        
      </main>
    </div>
  );
}

export default Settings;