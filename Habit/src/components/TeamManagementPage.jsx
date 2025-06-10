import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiGrid, FiBarChart2, FiUsers, FiSettings, FiLogOut, FiPlus } from 'react-icons/fi';
import { Calendar } from 'lucide-react';
import axios from 'axios';
import './TeamManagementPage.css';

const TeamManagementPage = () => {
    const navigate = useNavigate();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteData, setInviteData] = useState({ name: '', email: '' });
    const [invitationStatus, setInvitationStatus] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);
    const [habits, setHabits] = useState([]);

    const handleLogout = () => {
        navigate('/');
    };

    useEffect(() => {
        // Load accepted team members and add default if empty
        const invites = JSON.parse(localStorage.getItem('teamInvites') || '[]');
        const acceptedMembers = invites.filter(invite => invite.status === 'accepted');
        
        if (acceptedMembers.length === 0) {
            // Add default team members if none exist
            const defaultMembers = [
                {
                    id: 1,
                    name: 'Jamie',
                    email: 'jamie@example.com',
                    status: 'accepted'
                },
                {
                    id: 2,
                    name: 'Morgan',
                    email: 'morgan@example.com',
                    status: 'accepted'
                }
            ];
            localStorage.setItem('teamInvites', JSON.stringify(defaultMembers));
            setTeamMembers(defaultMembers);
        } else {
            setTeamMembers(acceptedMembers);
        }
    }, []);

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

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            setInvitationStatus('sending');
            
            const newInvite = {
                id: Date.now(),
                name: inviteData.name,
                email: inviteData.email,
                status: 'pending',
                date: new Date().toISOString()
            };

            // Send email invitation with the invite ID
            await axios.post('http://localhost:5001/api/teams/invite', {
                name: inviteData.name,
                email: inviteData.email,
                inviteId: newInvite.id
            });

            // Store invite in localStorage
            const invites = JSON.parse(localStorage.getItem('teamInvites') || '[]');
            invites.push(newInvite);
            localStorage.setItem('teamInvites', JSON.stringify(invites));

            setInvitationStatus('sent');
            setTimeout(() => {
                setShowInviteModal(false);
                setInviteData({ name: '', email: '' });
                setInvitationStatus('');
            }, 1500);
        } catch (error) {
            console.error('Error sending invitation:', error);
            setInvitationStatus('error');
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
                                <FiGrid size={18} />Dashboard
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/statistics" style={{ fontSize: '1.55rem' }}>
                                <FiBarChart2 size={18} />Statistics
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link className="nav-link d-flex align-items-center gap-2 text-dark fw-medium" to="/team" style={{ fontSize: '1.55rem' }}>
                                <FiUsers size={18} />Team
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/calendar" style={{ fontSize: '1.55rem' }}>
                                <Calendar size={18} />Calendar
                            </Link>
                        </li>
                        
                        <li className="nav-item mb-2">
                            <Link className="nav-link d-flex align-items-center gap-2 text-secondary" to="/settings" style={{ fontSize: '1.55rem' }}>
                                <FiSettings size={18} />Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="user-info border-top pt-3 mt-auto">
                    {/* <p className="text-secondary small mb-1">Signed in as:</p>
                    <p className="mb-1 fw-medium">User</p>
                    <p className="text-secondary small mb-3">user@gmail.com</p> */}
                    <button onClick={handleLogout} className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"><FiLogOut size={16} />Log out</button>
                </div>
            </aside>

            <main className="flex-grow-1 bg-white p-4 overflow-auto">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="h3 mb-2 fw-semibold">Team</h2>
                        <p className="text-muted mb-0">Manage your team members</p>
                    </div>
                    <button 
                        className="btn btn-dark d-flex align-items-center gap-2"
                        onClick={() => setShowInviteModal(true)}
                    >
                        <FiPlus size={18} />
                        Invite Team Member
                    </button>
                </div>

                <div className="row g-4">
                    {teamMembers.map(member => (
                        <div key={member.id} className="col-12 col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm" style={{borderRadius: '16px'}}>
                                <div className="card-body d-flex align-items-center gap-3 p-4">
                                    <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                        <span className="fw-medium text-primary">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="h6 mb-1 fw-semibold">{member.name}</h3>
                                        <p className="text-muted small mb-0">{member.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <Calendar className="text-primary" size={20} />
                                    <h6 className="ms-2 mb-0">Habit Calendar</h6>
                                </div>
                                <Calendar habits={habits} />
                            </div>
                        </div>
                    </div>
                </div> */}

                {showInviteModal && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header border-0">
                                    <h5 className="modal-title">Invite Team Member</h5>
                                    <button 
                                        type="button" 
                                        className="btn-close"
                                        onClick={() => setShowInviteModal(false)}
                                    ></button>
                                </div>
                                <form onSubmit={handleInvite}>
                                    <div className="modal-body p-4">
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter team member's name"
                                                value={inviteData.name}
                                                onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email address</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Enter email address"
                                                value={inviteData.email}
                                                onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                                                required
                                            />
                                        </div>
                                        {invitationStatus === 'error' && (
                                            <div className="alert alert-danger">Failed to send invitation. Please try again.</div>
                                        )}
                                         {invitationStatus === 'sent' && (
        <div className="alert alert-primary">Successfully Sent</div>
    )}
                                    </div>
                                    <div className="modal-footer border-0">
                                        <button 
                                            type="submit" 
                                            className="btn btn-dark w-100"
                                            disabled={invitationStatus === 'sending'}
                                        >
                                            {invitationStatus === 'sending' ? 'Sending...' : 
                                             invitationStatus === 'sent' ? 'Invitation Sent!' : 
                                             'Send Invitation'}
                                             
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TeamManagementPage;