import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiGrid, FiBarChart2, FiUsers, FiCalendar, FiSettings, FiLogOut } from 'react-icons/fi';
import axios from 'axios';
import DashboardLayout from './DashboardLayout';
import './Calendar.css';

function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchWorkouts();
  }, [currentDate.getMonth()]);

  const fetchWorkouts = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;

      const response = await axios.get(`http://localhost:5001/api/workouts?userEmail=${userEmail}`);
      if (response.data) {
        setWorkouts(response.data);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowWorkoutModal(true);
  };

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    
    if (!workoutType) {
      alert('Please select a workout type');
      return;
    }
    if (!duration || duration < 1) {
      alert('Please enter a valid duration (minimum 1 minute)');
      return;
    }

    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        alert('Please log in to add workouts');
        return;
      }

      const response = await axios.post('http://localhost:5001/api/workouts', {
        userEmail: userEmail,
        date: selectedDate.toISOString().split('T')[0],
        type: workoutType,
        duration: parseInt(duration),
        notes: notes
      });

      if (response.status === 201) {
        await fetchWorkouts();
        setShowWorkoutModal(false);
        setWorkoutType('');
        setDuration('');
        setNotes('');
        alert('Workout added successfully!');
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        alert('You already have a workout logged for this date. Please choose a different date or update the existing workout.');
      } else {
        console.error('Error adding workout:', error);
        alert('Error adding workout. Please try again.');
      }
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Add days from previous month
    const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        hasWorkout: workouts.some(w => new Date(w.date).toDateString() === date.toDateString()),
        workoutType: workouts.find(w => new Date(w.date).toDateString() === date.toDateString())?.type
      });
    }

    // Add days from current month
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        hasWorkout: workouts.some(w => new Date(w.date).toDateString() === date.toDateString()),
        workoutType: workouts.find(w => new Date(w.date).toDateString() === date.toDateString())?.type
      });
    }

    // Add days from next month
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        hasWorkout: workouts.some(w => new Date(w.date).toDateString() === date.toDateString()),
        workoutType: workouts.find(w => new Date(w.date).toDateString() === date.toDateString())?.type
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <DashboardLayout>
      <div className="content-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', minHeight: 'calc(100vh - 64px)' }}>
        <div className="calendar-section" style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div className="calendar-header d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0" style={{ fontSize: '1.5rem' }}>Calendar</h1>
              <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary" 
                onClick={prevMonth}
                style={{ fontSize: '1rem' }}
              >
                Previous
              </button>
              <button 
                className="btn btn-outline-primary" 
                onClick={nextMonth}
                style={{ fontSize: '1rem' }}
              >
                Next
              </button>
            </div>
          </div>

          <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-header" style={{ fontSize: '1rem', textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${day.isCurrentMonth ? '' : 'other-month'} ${
                  day.isToday ? 'today' : ''
                } ${day.hasWorkout ? 'has-workout' : ''}`}
                onClick={() => handleDateClick(day.date)}
                style={{ 
                  fontSize: '1rem',
                  padding: '1rem',
                  textAlign: 'center',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  position: 'relative',
                  backgroundColor: day.isToday ? '#f1f5f9' : 'transparent',
                  color: day.isCurrentMonth ? '#1e293b' : '#94a3b8',
                  border: '1px solid #e2e8f0',
                  minHeight: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <span>{day.date.getDate()}</span>
                {day.hasWorkout && (
                  <div className="workout-indicator" style={{ 
                    position: 'absolute',
                    bottom: '4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.75rem',
                    color: '#4CAF50',
                    backgroundColor: '#e8f5e9',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    marginTop: '4px'
                  }}>
                    {day.workoutType}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Workout Modal */}
        {showWorkoutModal && (
          <div className="modal-backdrop" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div className="modal-content" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              width: '100%',
              maxWidth: '500px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Add Workout</h2>
              <form onSubmit={handleAddWorkout}>
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: '1rem' }}>Workout Type</label>
                  <select
                    className="form-select"
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value)}
                    required
                    style={{ fontSize: '1rem' }}
                  >
                    <option value="">Select a type</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="Flexibility">Flexibility</option>
                    <option value="Yoga">Yoga</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Dance">Dance</option>
                    <option value="Swimming">Swimming</option>
                    <option value="Cycling">Cycling</option>
                    <option value="Running">Running</option>
                    <option value="Walking">Walking</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: '1rem' }}>Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    required
                    style={{ fontSize: '1rem' }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: '1rem' }}>Notes</label>
                  <textarea
                    className="form-control"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ fontSize: '1rem', minHeight: '100px' }}
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowWorkoutModal(false)}
                    style={{ fontSize: '1rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ fontSize: '1rem' }}
                  >
                    {/* Add Workout */}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Calendar;