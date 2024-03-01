import nodemailer from 'nodemailer';

import { MAIL } from 'src/config-global';

const transporter = nodemailer.createTransport({
    host: MAIL.host,
    port: MAIL.port,
    auth: {
        user: MAIL.user,
        pass: MAIL.password,
    },
    tls: {
        rejectUnauthorized: false
    }
});


export function sendEmail(from, to, subject, text, html) {
    const mailOptions = {
        from, // Passed from the client
        to, // Passed from the client
        subject, // Passed from the client
        text, // Passed from the client
        html, // Optionally passed from the client
    }

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
}