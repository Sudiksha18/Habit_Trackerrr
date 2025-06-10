import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>Welcome, {userProfile?.name}</h2>
        <p className="email">{userProfile?.email}</p>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>Recent Activities</h3>
          <div className="activities-list">
            {userProfile?.recentActivities?.map((activity, index) => (
              <div key={index} className="activity-item">
                <span className="activity-name">{activity.name}</span>
                <span className="activity-date">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-footer">
        <p>Member since: {new Date(userProfile?.joinedDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default UserProfile;