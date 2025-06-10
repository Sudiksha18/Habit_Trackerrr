import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  TrendingUp, 
  Calendar, 
  Award, 
  Target, 
  Activity,
  Grid,
  Users,
  Settings,
  LogOut,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

function Statistics() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('7'); // 7, 30, 90 days
  const [selectedMetric, setSelectedMetric] = useState('completion');

  useEffect(() => {
    const fetchHabits = async () => {
      const userEmail = localStorage.getItem('userEmail');
      
      if (!userEmail) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/habits/byEmail?email=${userEmail}`);
        if (!response.ok) {
          throw new Error('Failed to fetch habits');
        }
        const data = await response.json();
        setHabits(data);
      } catch (error) {
        console.error('Error fetching habits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [navigate]);

  const handleLogout = () => {
    navigate('/');
  };

  // Generate mock time series data for trend analysis
  const generateTrendData = () => {
    const days = parseInt(timeFilter);
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Simulate completion data with some variation
      const baseCompletion = 60 + Math.sin(i * 0.1) * 20;
      const completionRate = Math.max(0, Math.min(100, baseCompletion + (Math.random() - 0.5) * 30));
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completion: Math.round(completionRate),
        streaks: Math.round(habits.length * (completionRate / 100)),
        active: habits.filter(h => !h.completed).length + Math.round((Math.random() - 0.5) * 3)
      });
    }
    return data;
  };

  // Category distribution data
  const categoryData = React.useMemo(() => {
    const categories = habits.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {});

    const colors = {
      health: '#10B981',
      productivity: '#3B82F6', 
      learning: '#F59E0B',
      other: '#8B5CF6'
    };

    return Object.entries(categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: colors[name] || '#6B7280'
    }));
  }, [habits]);

  // Frequency analysis data
  const frequencyData = React.useMemo(() => {
    const frequencies = habits.reduce((acc, habit) => {
      acc[habit.frequency] = (acc[habit.frequency] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(frequencies).map(([name, count]) => ({
      frequency: name.charAt(0).toUpperCase() + name.slice(1),
      count,
      completed: habits.filter(h => h.frequency === name && h.completed).length
    }));
  }, [habits]);

  // Streak distribution data
  const streakDistribution = React.useMemo(() => {
    const ranges = [
      { range: '0 days', min: 0, max: 0 },
      { range: '1-7 days', min: 1, max: 7 },
      { range: '8-30 days', min: 8, max: 30 },
      { range: '31-90 days', min: 31, max: 90 },
      { range: '90+ days', min: 91, max: Infinity }
    ];

    return ranges.map(({ range, min, max }) => ({
      range,
      count: habits.filter(h => h.streak >= min && h.streak <= max).length
    }));
  }, [habits]);

  // Performance metrics
  const metrics = React.useMemo(() => {
    const total = habits.length;
    const completed = habits.filter(h => h.completed).length;
    const avgStreak = total > 0 ? habits.reduce((sum, h) => sum + h.streak, 0) / total : 0;
    const maxStreak = Math.max(...habits.map(h => h.streak), 0);
    
    return {
      totalHabits: total,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      averageStreak: Math.round(avgStreak * 10) / 10,
      longestStreak: maxStreak,
      activeHabits: total - completed,
      improvement: Math.round((Math.random() - 0.3) * 20) // Mock improvement percentage
    };
  }, [habits]);

  const trendData = generateTrendData();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <aside className="sidebar bg-white border-end p-4 d-flex flex-column position-fixed" style={{width: '250px', height: '100vh'}}>
        <h1 className="h5 mb-4 fw-semibold">HabitTracker</h1>
        <nav className="flex-grow-1">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/dashboard">
                <Grid size={18} />Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-dark fw-semibold" to="/statistics"style={{ fontSize: '1.55rem' }}>
                <BarChart2 size={18} />Statistics
              </Link>
            </li>
            
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/team" style={{ fontSize: '1.55rem' }}>
                <Users size={18} />Team
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/calendar" style={{ fontSize: '1.55rem' }}>
                <Calendar size={18} />Calendar
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/settings" style={{ fontSize: '1.55rem' }}>
                <Settings size={18} />Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="user-info border-top pt-3 mt-auto">
          <button onClick={handleLogout} className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2">
            <LogOut size={16} />Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className="flex-grow-1" 
        style={{ 
          marginLeft: '250px',
          height: '100vh',
          overflowY: 'auto',
          paddingBottom: '2rem'
        }}
      >
        <div className="container-fluid py-4" style={{ maxWidth: '1400px' }}>
          {/* Header with Controls */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 mb-1">📊 Analytics Dashboard</h1>
              <p className="text-muted mb-0">Deep insights into your habit tracking journey</p>
            </div>
            
            <div className="d-flex gap-2">
              <select 
                className="form-select form-select-sm" 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                style={{ width: '120px' }}
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
              
              <select 
                className="form-select form-select-sm" 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                style={{ width: '140px' }}
              >
                <option value="completion">Completion Rate</option>
                <option value="streaks">Streak Analysis</option>
                <option value="active">Active Habits</option>
              </select>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="row g-3 mb-4">
            <div className="col-xl-2 col-md-4 col-6">
              <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="card-body p-3 text-white">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h3 className="mb-0">{metrics.totalHabits}</h3>
                      <small className="opacity-75">Total Habits</small>
                    </div>
                    <Target size={24} className="opacity-75" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-md-4 col-6">
              <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <div className="card-body p-3 text-white">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h3 className="mb-0">{metrics.completionRate}%</h3>
                      <small className="opacity-75">Completion Rate</small>
                    </div>
                    <Activity size={24} className="opacity-75" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-md-4 col-6">
              <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                <div className="card-body p-3 text-white">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h3 className="mb-0">{metrics.averageStreak}</h3>
                      <small className="opacity-75">Avg Streak</small>
                    </div>
                    <TrendingUp size={24} className="opacity-75" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-md-4 col-6">
              <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                <div className="card-body p-3 text-white">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h3 className="mb-0">{metrics.longestStreak}</h3>
                      <small className="opacity-75">Best Streak</small>
                    </div>
                    <Award size={24} className="opacity-75" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-md-4 col-6">
              <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
                <div className="card-body p-3 text-dark">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h3 className="mb-0">{metrics.activeHabits}</h3>
                      <small className="text-muted">Active Today</small>
                    </div>
                    <Activity size={24} className="text-muted" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-md-4 col-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h3 className="mb-0 d-flex align-items-center">
                        {metrics.improvement > 0 ? '+' : ''}{metrics.improvement}%
                        {metrics.improvement > 0 ? 
                          <ArrowUp size={16} className="text-success ms-1" /> : 
                          <ArrowDown size={16} className="text-danger ms-1" />
                        }
                      </h3>
                      <small className="text-muted">vs Last Period</small>
                    </div>
                    <BarChart2 size={24} className="text-muted" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="row g-4 mb-4">
            {/* Trend Analysis Chart */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-bottom py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-0">📈 Performance Trends</h5>
                    <div className="d-flex gap-2">
                      <span className="badge bg-primary">Completion Rate</span>
                      <span className="badge bg-success">Active Streaks</span>
                    </div>
                  </div>
                </div>
                <div className="card-body p-4">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorStreaks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#666"
                        fontSize={12}
                      />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="completion" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCompletion)" 
                        name="Completion %"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="streaks" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorStreaks)" 
                        name="Active Streaks"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-bottom py-3">
                  <h5 className="mb-0">🏷️ Category Distribution</h5>
                </div>
                <div className="card-body p-4">
                  <ResponsiveContainer width="100%" height={350}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={40}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Charts */}
          <div className="row g-4">
            {/* Frequency Analysis */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-bottom py-3">
                  <h5 className="mb-0">📅 Frequency Analysis</h5>
                </div>
                <div className="card-body p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={frequencyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="frequency" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" fill="#8B5CF6" name="Total Habits" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Streak Distribution */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-bottom py-3">
                  <h5 className="mb-0">🔥 Streak Distribution</h5>
                </div>
                <div className="card-body p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={streakDistribution} layout="horizontal" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" stroke="#666" fontSize={12} />
                      <YAxis dataKey="range" type="category" stroke="#666" fontSize={11} width={60} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" fill="#F59E0B" name="Habits Count" radius={[0, 4, 4, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Insights Panel */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="mb-0">💡 AI Insights & Recommendations</h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="border rounded p-3 h-100" style={{ borderColor: '#10B981', backgroundColor: '#F0FDF4' }}>
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-success rounded-circle p-2 me-2">
                        <TrendingUp size={16} className="text-white" />
                      </div>
                      <strong className="text-success">Improvement Trend</strong>
                    </div>
                    <p className="text-sm mb-0">Your completion rate has improved by {Math.abs(metrics.improvement)}% compared to last period. Keep up the momentum!</p>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="border rounded p-3 h-100" style={{ borderColor: '#F59E0B', backgroundColor: '#FFFBEB' }}>
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-warning rounded-circle p-2 me-2">
                        <Target size={16} className="text-white" />
                      </div>
                      <strong className="text-warning">Focus Area</strong>
                    </div>
                    <p className="text-sm mb-0">
                      {categoryData.length > 0 && `${categoryData[0].name} habits are your strongest category. Consider adding more variety to your routine.`}
                    </p>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="border rounded p-3 h-100" style={{ borderColor: '#3B82F6', backgroundColor: '#EFF6FF' }}>
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-primary rounded-circle p-2 me-2">
                        <Award size={16} className="text-white" />
                      </div>
                      <strong className="text-primary">Achievement</strong>
                    </div>
                    <p className="text-sm mb-0">Your longest streak is {metrics.longestStreak} days! Aim for {metrics.longestStreak + 7} days to set a new personal record.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Statistics;