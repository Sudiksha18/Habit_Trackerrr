import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const InvitationPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const inviteId = searchParams.get('id');

    const handleInvitation = (accepted) => {
        const invites = JSON.parse(localStorage.getItem('teamInvites') || '[]');
        const updatedInvites = invites.map(invite => 
            invite.id === parseInt(inviteId) 
                ? {...invite, status: accepted ? 'accepted' : 'declined'} 
                : invite
        );
        localStorage.setItem('teamInvites', JSON.stringify(updatedInvites));
        navigate('/team');
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-body text-center p-5">
                    <h2 className="mb-4">Team Invitation</h2>
                    <p className="mb-4">You've been invited to join the team!</p>
                    <div className="d-flex justify-content-center gap-3">
                        <button 
                            className="btn btn-success"
                            onClick={() => handleInvitation(true)}
                        >
                            Accept Invitation
                        </button>
                        <button 
                            className="btn btn-outline-danger"
                            onClick={() => handleInvitation(false)}
                        >
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvitationPage;