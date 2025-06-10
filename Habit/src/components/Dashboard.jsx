import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Award, BarChart2, Medal, Plus, Grid, Users, Settings, LogOut, MoreVertical, Calendar } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserProfile from './UserProfile';

function Dashboard() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({
    text: '',
    description: '',
    category: 'health',
    frequency: 'weekly'
  });

  useEffect(() => {
    const fetchHabits = async () => {
      const userEmail = localStorage.getItem('userEmail');
      
      if (!userEmail) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/habits/byEmail?email=${userEmail}`);
        if (!response.ok) {
          throw new Error('Failed to fetch habits');
        }
        const data = await response.json();
        setHabits(data);
      } catch (error) {
        console.error('Error fetching habits:', error);
      }
    };

    fetchHabits();
  }, [navigate]);

  const deleteHabit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/habits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete habit');
      }

      setHabits(prevHabits => prevHabits.filter(habit => habit._id !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (newHabit.text.trim()) {
      try {
        const userEmail = localStorage.getItem('userEmail');
        console.log(userEmail);
  
        // Prepare the request body
        const body = {
          habit: {
            text: newHabit.text,
            description: newHabit.description,
            category: newHabit.category,
            streak: 0,
            frequency:newHabit.frequency,
            completed: false
          },
          userEmail: userEmail
        };
  
        // Print the request body to console
        console.log('Request Body:', JSON.stringify(body, null, 2));
  
        const response = await fetch('http://localhost:5001/api/habits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        });
  
        if (!response.ok) {
          throw new Error('Failed to add habit');
        }
  
        const savedHabit = await response.json();
        setHabits(prevHabits => [...prevHabits, savedHabit]);
        setShowAddModal(false);
        setNewHabit({
          text: '',
          description: '',
          category: 'health',
          frequency:'weekly'
        });
      } catch (error) {
        console.error('Error adding habit:', error);
      }
    }
  };
  

  const handleEditHabit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/habits/${editingHabit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingHabit)
      });

      if (!response.ok) {
        throw new Error('Failed to update habit');
      }

      const updatedHabit = await response.json();
      setHabits(prevHabits => 
        prevHabits.map(habit => habit._id === editingHabit._id ? updatedHabit : habit)
      );
      setShowEditModal(false);
      setEditingHabit(null);
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const editHabit = (id) => {
    const habitToEdit = habits.find(habit => habit._id === id);
    setEditingHabit(habitToEdit);
    setShowEditModal(true);
  };

  useEffect(() => {
    const fetchHabits = async () => {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
      
      if (!token || !userEmail) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/habits?userEmail=${userEmail}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch habits');
        }

        const data = await response.json();
        setHabits(data);
      } catch (error) {
        console.error('Error fetching habits:', error);
        navigate('/login');
      }
    };

      fetchHabits();
    }, [navigate]);
  // const deleteHabit = async (id) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch(`http://localhost:5001/api/habits/${id}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to delete habit');
  //     }

  //     setHabits(habits.filter(habit => habit._id !== id));
  //   } catch (error) {
  //     console.error('Error deleting habit:', error);
  //   }
  // };

  // Remove the localStorage initialization
  // const [habits, setHabits] = useState([]);
  
  // Remove this useEffect since we're using server data
  // useEffect(() => {
  //   localStorage.setItem('habits', JSON.stringify(habits));
  // }, [habits]);
  const toggleHabit = async (id) => {
    console.log("togglong habit with id:", id);
  try {
    // Optimistically update local state:
    setHabits(prevHabits =>
      prevHabits.map(habit =>
        habit._id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
      const userEmail =await localStorage.getItem('userEmail');

const response = await fetch(`http://localhost:5001/api/habits/${id}/toggle`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userEmail: userEmail
  })
});



    if (!response.ok) {
      throw new Error('Failed to toggle habit');
    }

    const updatedHabit = await response.json();

    // Update local state with response (to sync server state)
    setHabits(prevHabits =>
      prevHabits.map(habit =>
        habit._id === id ? updatedHabit : habit
      )
    );
  } catch (error) {
    console.error('Error toggling habit:', error);
  }
};

  
     

  const handleLogout = () => {
    navigate('/'); // Navigate to landing page
  };

  // Add these calculations
  const completedHabits = habits.filter(h => h.completed);
  const pendingHabits = habits.filter(h => !h.completed);
  const totalHabits = habits.length;
  
  // Calculate progress percentage
  const progressPercentage = Math.round((completedHabits.length / totalHabits) * 100) || 0;
  
  // Calculate highest streak
  const highestStreak = Math.max(...habits.map(h => h.streak));
  
  // Calculate weekly average (assuming daily habits)
  const weeklyAverage = ((completedHabits.length / totalHabits) * 7).toFixed(1);
  
  // Find top category
  const categoryCount = habits.reduce((acc, habit) => {
    acc[habit.category] = (acc[habit.category] || 0) + 1;
    return acc;
  }, {});
  
  const topCategory = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)[0] || ['None', 0];

  // Basic layout structure for each component
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <aside className="sidebar bg-white border-end p-4 d-flex flex-column position-fixed" style={{width: '250px', height: '100vh'}}>
        <h1 className="h5 mb-4 fw-semibold">HabitTracker</h1>
        <nav className="flex-grow-1">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-dark fw-small" to="/dashboard" style={{ fontSize: '1.55rem' }}>
                <Grid size={18} />Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/statistics" style={{ fontSize: '1.55rem' }}>
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
          {/* <p className="text-secondary small mb-1">Signed in as:</p>
          <p className="mb-1 fw-medium">User</p>
          <p className="text-secondary small mb-3">user@gmail.com</p> */}

          <button onClick={handleLogout} className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2">
            <LogOut size={16} />Log out
          </button>
        </div>
      </aside>

      <main 
        className="flex-grow-1 bg-white" 
        style={{ 
          marginLeft: '250px',
          height: '100vh',
          overflowY: 'auto',
          position: 'relative',
          paddingBottom: '2rem',
          paddingRight: '1rem'
        }}
      >
        <div className="container py-3" style={{ maxWidth: '1200px' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 className="h3 mb-0">Your Habits</h1>
              <p className="text-muted mb-0" style={{ fontSize: '1.2rem' }}>Track and manage your daily habits</p>
            </div>
            
            <button 
              onClick={() => setShowAddModal(true)} 
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
            >
              <Plus size={16} />
              Add New Habit
            </button>

          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="card border-0 h-100 shadow-sm">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center mb-2">
                    <Activity className="text-primary" size={20} />
                    <h6 className="ms-2 mb-0 small">Today's Progress</h6>
                  </div>
                  <h3 className="mb-2">{progressPercentage}%</h3>
                  <div className="progress mb-2" style={{ height: '4px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${progressPercentage}%` }} 
                      aria-valuenow={progressPercentage} 
                      aria-valuemin={0} 
                      aria-valuemax={100}
                    ></div>
                  </div>
                  <small className="text-muted">{completedHabits.length} of {totalHabits} habits completed</small>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 h-100 shadow-sm">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center mb-2">
                    <Award className="text-warning" size={20} />
                    <h6 className="ms-2 mb-0 small">Highest Streak</h6>
                  </div>
                  <h3 className="mb-2">{highestStreak} days</h3>
                  <small className="text-muted">Keep going to increase your streak!</small>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 h-100 shadow-sm">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center mb-2">
                    <BarChart2 className="text-success" size={20} />
                    <h6 className="ms-2 mb-0 small">Weekly Average</h6>
                  </div>
                  <h3 className="mb-2">{weeklyAverage}/7</h3>
                  <small className="text-muted">Average habits completed per week</small>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 h-100 shadow-sm">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center mb-2">
                    <Medal className="text-info" size={20} />
                    <h6 className="ms-2 mb-0 small">Top Category</h6>
                  </div>
                  <h3 className="mb-2">{topCategory[0]}</h3>
                  <small className="text-muted">{topCategory[1]} habits in this category</small>
                </div>
              </div>
            </div>
          </div>

         
          <div className="mt-4">
            <h6 className="mb-2">Pending ({habits.filter(h => !h.completed).length})</h6>
            {habits.filter(habit => !habit.completed).map(habit => (
              <div key={habit._id} className="card border-0 shadow-sm mb-2">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 small">{habit.text}</h6>
                      <p className="text-muted mb-0 small">{habit.description}</p>
                      <div className="mt-1">
                        <span className="badge bg-info me-2">{habit.category}</span>
                        <small className="text-muted">Streak: {habit.streak}.{habit.frequency} </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="dropdown">
                        <button className="btn btn-link text-secondary p-0" data-bs-toggle="dropdown">
                          <MoreVertical size={16} />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <button className="dropdown-item" onClick={() => editHabit(habit._id)}>
                              <i className="bi bi-pencil me-2"></i>Edit
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item text-danger" onClick={() => deleteHabit(habit._id)}>
                              <i className="bi bi-trash me-2"></i>Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="form-check ms-2">
                      <input 
  className="form-check-input" 
  type="checkbox" 
  checked={habit.completed}
  onChange={() => toggleHabit(habit._id)}
/>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <h6 className="mb-2 mt-3">Completed ({habits.filter(h => h.completed).length})</h6>
            {habits.filter(habit => habit.completed).map(habit => (
              <div key={habit._id} className="card border-0 shadow-sm mb-2">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 small">{habit.text}</h6>
                      <p className="text-muted mb-0 small">{habit.description}</p>
                      <div className="mt-1">
                        <span className="badge bg-info me-2">{habit.category}</span>
                        <small className="text-muted">Streak: {habit.streak}.{habit.frequency} </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="dropdown">
                        <button className="btn btn-link text-secondary p-0" data-bs-toggle="dropdown">
                          <MoreVertical size={16} />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <button className="dropdown-item" onClick={() => editHabit(habit._id)}>
                              <i className="bi bi-pencil me-2"></i>Edit
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item text-danger" onClick={() => deleteHabit(habit._id)}>
                              <i className="bi bi-trash me-2"></i>Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="form-check ms-2">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={habit.completed}
                          onChange={() => toggleHabit(habit._id)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {(showAddModal || (showEditModal && editingHabit)) && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
              <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '450px' }}>
                <div className="modal-content shadow-lg" style={{ 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div className="modal-header border-bottom px-3 py-2">
                    <h5 className="modal-title" style={{ fontSize: '1.1rem' }}>
                      {showAddModal ? 'Add New Habit' : 'Edit Habit'}
                    </h5>
                    <button type="button" className="btn-close" onClick={() => {
                      showAddModal ? setShowAddModal(false) : setShowEditModal(false);
                      setEditingHabit(null);
                    }}></button>
                  </div>
                  <form onSubmit={showAddModal ? handleAddHabit : handleEditHabit}>
                    <div className="modal-body p-3">
                      <div className="mb-3">
                        <label className="form-label" style={{ fontSize: '0.9rem' }}>Name</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ 
                            fontSize: '0.9rem',
                            padding: '0.5rem',
                            border: '1px solid #dee2e6',
                            borderRadius: '4px'
                          }}
                          placeholder="Exercise, Read, Meditate..."
                          value={showAddModal ? newHabit.text : (editingHabit?.text || '')}
                          onChange={(e) => showAddModal 
                            ? setNewHabit({...newHabit, text: e.target.value})
                            : setEditingHabit({...editingHabit, text: e.target.value})
                          }
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label" style={{ fontSize: '0.9rem' }}>Description (optional)</label>
                        <textarea
                          className="form-control"
                          style={{ 
                            fontSize: '0.9rem',
                            padding: '0.5rem',
                            border: '1px solid #dee2e6',
                            borderRadius: '4px',
                            resize: 'none',
                            height: '80px'
                          }}
                          placeholder="Add notes about your habit..."
                          value={showAddModal ? newHabit.description : editingHabit.description}
                          onChange={(e) => showAddModal
                            ? setNewHabit({...newHabit, description: e.target.value})
                            : setEditingHabit({...editingHabit, description: e.target.value})
                          }
                          rows="3"
                        />
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <div className="mb-2">
                            <label className="form-label" style={{ fontSize: '0.9rem' }}>Category</label>
                            <select
                              className="form-select"
                              style={{ 
                                fontSize: '0.9rem',
                                padding: '0.5rem',
                                border: '1px solid #dee2e6',
                                borderRadius: '4px'
                              }}
                              value={showAddModal ? newHabit.category : editingHabit.category}
                              onChange={(e) => showAddModal
                                ? setNewHabit({...newHabit, category: e.target.value})
                                : setEditingHabit({...editingHabit, category: e.target.value})
                              }
                            >
                              <option value="productivity">Productivity</option>
                              <option value="health">Health</option>
                              <option value="learning">Learning</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="mb-2">
                            <label className="form-label" style={{ fontSize: '0.9rem' }}>Frequency</label>
                            <select 
                              className="form-select"
                              style={{ 
                                fontSize: '0.9rem',
                                padding: '0.5rem',
                                border: '1px solid #dee2e6',
                                borderRadius: '4px'
                              }}
                              value={showAddModal ? newHabit.frequency : editingHabit.frequency}
                            onChange={(e) => showAddModal
                            ? setNewHabit({...newHabit, frequency: e.target.value})
                              : setEditingHabit({...editingHabit, frequency: e.target.value})
      }
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer border-top p-3">
                      <button 
                        type="submit" 
                        className="btn btn-dark w-100"
                        style={{ 
                          fontSize: '0.9rem',
                          padding: '0.5rem',
                          borderRadius: '4px'
                        }}
                      >
                        {showAddModal ? 'Add Habit' : 'Update Habit'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
    </div>
  );
}

export default Dashboard;
