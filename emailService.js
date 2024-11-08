// emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail password or App Password
    }
});

export const sendApprovalEmail = async (recipientEmail, recipientName) => {
    const mailOptions = {
        from: '"Admin for online Institute " <your.email@gmail.com>', // sender address
        to: recipientEmail, // list of receivers
      subject: 'Your Teacher Account has been Approved', // Subject line
        text: `Hello ${recipientName}, your teacher account has been approved. You can now login and start working on the playlist and videos as assigned by the admin.`, // Plain text body
        html: `<p>Hello ${recipientName},</p>
               <h3>Your teacher account has been <strong>approved</strong>.</h3>
               <p>You can now <strong>login</strong> and start working on the playlist and videos as assigned by the admin.</p>
               <p>Best regards,</p>
               <p>The Admin Team</p>`, // HTML body
               };

    // Send the email
    transporter.sendMail(mailOptions, (error, result) => {
        if (error) {
            console.log('Error occurred:', error);
        } else {
            console.log('Email sent:', result.response);
        }
    });
};
