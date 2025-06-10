const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter with updated configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    debug: true
});

router.post('/invite', async (req, res) => {
    console.log("inviting")
    try {
        const { name, email } = req.body;
        
        console.log('Attempting to send email with config:', {
            from: process.env.EMAIL_USER,
            to: email,
            auth: { user: process.env.EMAIL_USER }
        });

        const mailOptions = {
            from: `"Habit Tracker" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Team Invitation',
            html: `
                <h2>Hello ${name}!</h2>
                <p>You've been invited to join a team on Habit Tracker.</p>
                <p>Click the link below to accept the invitation:</p>
                <a href="${process.env.FRONTEND_URL}/accept-invite?id=${req.body.inviteId}">Accept Invitation</a>
            `
        };

        await transporter.verify();
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully:', info.messageId);
        res.status(200).json({ message: 'Invitation sent successfully' });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            message: 'Failed to send invitation',
            error: error.message 
        });
    }
});

module.exports = router;