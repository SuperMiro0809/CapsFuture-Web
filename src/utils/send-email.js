import nodemailer from 'nodemailer';

import { MAIL } from 'src/config-global';

const transporter = nodemailer.createTransport({
    host: 'mail.caps-for-future.org',
    port: 25,
    auth: {
        user: 'capsforf',
        pass: 'y9AHZy2,a]rN',
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