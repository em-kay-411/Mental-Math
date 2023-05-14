const nodemailer = require('nodemailer');
const User = require('./user.js');

async function sendMail(email, subject, message) {
    const otp = Math.floor(100000 + Math.random() * 900000);

    await User.findOneAndUpdate(
        { email },
        { password: otp },
        { new: true }
    );

    // Create a Nodemailer transport object
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'kumbharemohit10@gmail.com',
            pass: 'gpjxidigkyeayzlm'
        }
    });

    // Define email message
    const mailOptions = {
        from: 'kumbharemohit10@gmail.com',
        to: email,
        subject: subject,
        text: message + ' ' + otp
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('OTP email sent successfully');
        }
    });
}

module.exports = sendMail;