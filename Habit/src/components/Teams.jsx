import { Link } from 'react-router-dom';
import { Grid, BarChart2, Users, Settings } from 'lucide-react';
import { Calendar } from 'lucide-react';

function Teams() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar bg-white border-end p-4 d-flex flex-column" style={{width: '250px'}}>
        <h1 className="h5 mb-4 fw-semibold">HabitTracker</h1>
        <nav className="flex-grow-1">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/dashboard">
                <Grid size={18} />Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/statistics">
                <BarChart2 size={18} />Statistics
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/calendar">
                <Calendar size={18} />Calendar
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-dark fw-medium" to="/team">
                <Users size={18} />Team
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/settings">
                <Settings size={18} />Settings
              </Link>
            </li>
          </ul>
        </nav>
        {/* ...existing code... */}
      </aside>
      {/* ...rest of the component... */}
    </div>
  );
}

export default Teams;