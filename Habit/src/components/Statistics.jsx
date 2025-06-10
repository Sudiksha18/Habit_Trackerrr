// Add useState and useEffect imports
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiGrid, FiBarChart2, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';
import { Calendar } from 'lucide-react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

import './Statistics.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

function Statistics() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [activeTab, setActiveTab] = useState('streaks');
  const [isLoading, setIsLoading] = useState(true);

  // Add pie chart options
  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        enabled: true
      }
    },
    maintainAspectRatio: false,
    cutout: '60%'
  };

  useEffect(() => {
    try {
      const loadHabits = () => {
        const savedHabits = JSON.parse(localStorage.getItem('habits')) || [];
        setHabits(savedHabits);
        setIsLoading(false);
      };
      
      loadHabits();
      window.addEventListener('storage', loadHabits);
      return () => window.removeEventListener('storage', loadHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
      setIsLoading(false);
    }
  }, []);

  // Add loading state check in return
  if (isLoading) {
    return (
      <div className="dashboard-container">
        <aside className="sidebar bg-white border-end p-4 d-flex flex-column" style={{width: '250px'}}>
          <h1 className="h5 mb-4 fw-semibold">HabitTracker</h1>
          <nav className="flex-grow-1">
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/dashboard">
                  <FiGrid size={18} />Dashboard
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link d-flex align-items-center gap-2 text-dark fw-medium" to="/statistics">
                  <FiBarChart2 size={18} />Statistics
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/calendar">
                  <Calendar size={18} />Calendar
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/team">
                  <FiUsers size={18} />Team
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/settings">
                  <FiSettings size={18} />Settings
                </Link>
              </li>
            </ul>
          </nav>
          <div className="user-info border-top pt-3 mt-auto">
            <p className="text-secondary small mb-1">Signed in as:</p>
            <p className="mb-1 fw-medium">User</p>
            <p className="text-secondary small mb-3">user@gmail.com</p>
            <button onClick={() => navigate('/')} className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"><FiLogOut size={16} />Log out</button>
          </div>
        </aside>
  
        <main className="flex-grow-1 bg-white p-4 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </main>
      </div>
    );
  }

  // Update completion data
  const completionData = {
    labels: ['Completed', 'Pending'],
    datasets: [{
      data: [
        habits.filter(h => h.completed).length,
        habits.filter(h => !h.completed).length
      ],
      backgroundColor: ['#8b5cf6', '#e2e8f0'],
      borderWidth: 0
    }]
  };

  // Update categories data
  const categoriesData = {
    labels: [...new Set(habits.map(h => h.category))],
    datasets: [{
      data: [...new Set(habits.map(h => h.category))].map(category => 
        habits.filter(h => h.category === category).length
      ),
      backgroundColor: ['#0ea5e9', '#f97316', '#10b981', '#6366f1'],
      borderWidth: 0
    }]
  };

  // Update frequency data
  const frequencyData = {
    labels: ['Daily'],
    datasets: [{
      data: [habits.length],
      backgroundColor: ['#f97316'],
      borderWidth: 0
    }]
  };

  // Update streaks section JSX
  const streaksContent = (
    <div className="bars">
      {habits.map(habit => (
        <div 
          key={habit.id} 
          className="bar" 
          style={{ height: `${(habit.streak / 8) * 100}%` }}
        >
          <span>{habit.text}</span>
        </div>
      ))}
    </div>
  );

  // Update weekly data
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Habits Completed',
      data: Array(7).fill().map(() => habits.filter(h => h.completed).length),
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#0ea5e9',
      pointBorderWidth: 2
    }]
  };

  // In the return statement, update the streaks section
  return (
    <div className="dashboard-container">
      <aside className="sidebar bg-white border-end p-4 d-flex flex-column" style={{width: '250px'}}>
        <h1 className="h5 mb-4 fw-semibold">HabitTracker</h1>
        <nav className="flex-grow-1">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/dashboard">
                <FiGrid size={18} />Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-dark fw-medium" to="/statistics">
                <FiBarChart2 size={18} />Statistics
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/calendar">
                <Calendar size={18} />Calendar
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/team">
                <FiUsers size={18} />Team
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/settings">
                <FiSettings size={18} />Settings
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
            <h2 className="h3 mb-2 fw-semibold">Statistics</h2>
            <p className="text-muted mb-0" style={{color: '#667085'}}>Visualize and analyze your habit data</p>
          </div>
        </div>

        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Habit Completion</h3>
              <div className="chart-container">
                <Pie data={completionData} options={pieOptions} />
              </div>
            </div>

            <div className="stat-card">
              <h3>Categories</h3>
              <div className="chart-container">
                <Pie data={categoriesData} options={pieOptions} />
              </div>
            </div>

            <div className="stat-card">
              <h3>Frequency</h3>
              <div className="chart-container">
                <Pie data={frequencyData} options={pieOptions} />
              </div>
            </div>
          </div>

          <div className="tabs">
            <button className={`tab ${activeTab === 'streaks' ? 'active' : ''}`} onClick={() => setActiveTab('streaks')}>
              Streaks
            </button>
            <button className={`tab ${activeTab === 'weekly' ? 'active' : ''}`} onClick={() => setActiveTab('weekly')}>
              Weekly Trend
            </button>
          </div>

          {activeTab === 'streaks' && (
            <div className="streaks-section">
              <h2>Habit Streaks</h2>
              <div className="bar-chart">
                <div className="y-axis">
                  {[8, 6, 4, 2, 0].map(num => (
                    <span key={num}>{num}</span>
                  ))}
                </div>
                {streaksContent}
              </div>
            </div>
          )}

          {activeTab === 'weekly' && (
            <div className="weekly-section">
              <h2>Weekly Completion</h2>
              <div className="line-chart-container" style={{ height: '400px', marginTop: '2rem' }}>
                <Line
                  data={weeklyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: Math.max(habits.length, 3),
                        ticks: {
                          stepSize: 1
                        },
                        grid: {
                          color: '#f1f5f9'
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
    
  );
}

export default Statistics;