import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiBarChart2, FiUsers, FiSettings, FiCalendar, FiLogOut } from 'react-icons/fi';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar bg-white border-end p-4 d-flex flex-column">
        <h1 className="h5 mb-4 fw-semibold">HabitTracker</h1>
        <nav className="flex-grow-1">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link 
                className={`nav-link d-flex align-items-center gap-2 ${isActive('/dashboard') ? 'text-dark fw-medium' : 'text-secondary'}`} 
                to="/dashboard" style={{ fontSize: '1.55rem' }}
              >
                <FiGrid size={18} />Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link 
                className={`nav-link d-flex align-items-center gap-2 ${isActive('/statistics') ? 'text-dark fw-medium' : 'text-secondary'}`} 
                to="/statistics" style={{ fontSize: '1.55rem' }}
              >
                <FiBarChart2 size={18} />Statistics
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link 
                className={`nav-link d-flex align-items-center gap-2 ${isActive('/team') ? 'text-dark fw-medium' : 'text-secondary'}`} 
                to="/team" style={{ fontSize: '1.55rem' }}
              >
                <FiUsers size={18} />Team
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link 
                className={`nav-link d-flex align-items-center gap-2 ${isActive('/calendar') ? 'text-dark fw-medium' : 'text-secondary'}`} 
                to="/calendar" style={{ fontSize: '1.55rem' }}
              >
                <FiCalendar size={18} />Calendar
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link 
                className={`nav-link d-flex align-items-center gap-2 ${isActive('/settings') ? 'text-dark fw-medium' : 'text-secondary'}`} 
                to="/settings" style={{ fontSize: '1.55rem' }}
              >
                <FiSettings size={18} />Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="user-info border-top pt-3 mt-auto">
          <button onClick={() => navigate('/')} className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2">
            <FiLogOut size={16} />Log out
          </button>
        </div>
      </aside>

      <main className="flex-grow-1 bg-white p-4">
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 