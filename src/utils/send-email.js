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


export async function sendEmail(from, to, subject, text, html) {
    const mailOptions = {
        from, // Passed from the client
        to, // Passed from the client
        subject, // Passed from the client
        text, // Passed from the client
        html, // Optionally passed from the client
    }

    await new Promise((resolve, reject) => {
        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });

    // Send email
    return await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.log(`Email sent: ${info.response}`);
                resolve(info);
            }
        });
    });
}