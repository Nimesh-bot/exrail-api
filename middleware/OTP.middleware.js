const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const UserOTPVerification = require('../models/UserOTPVerification');
const { deleteMany } = require('../models/User');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASSWORD,
    },
});

const sendOTPVerification = async({ _id, email }, next) => {
    try {
        const otp = `${1000 + Math.floor(Math.random() * 9000)}`;

        const mailOptions = {
            from: process.env.APP_USER,
            to: email,
            subject: 'Verify your email address',
            html: `
                <div>
                    <p>You have registered for Ex-Rail. To complete your registration and verify yourself, do enter the OTP code below in the app.</p>
                    <p><b>${otp}</b></p>
                    <br>
                    <p>Note that, this code expires in <span style="color: red">5 minutes</span></p>
                </div>
            `
        }

        const saltRounds = 10;

        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const del = await UserOTPVerification.deleteMany({userId: _id})
        const newOTPVerification = new UserOTPVerification({
            userId: _id,
            otp: hashedOTP,
        });

        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        next()
    }
    catch(err) {
        next(err);
    }
}

const sendOTPforPasswordReset = async({ _id, email }, next) => {
    try{
        const otp = `${1000 + Math.floor(Math.random() * 9000)}`;

        const mailOptions = {
            from: process.env.APP_USER,
            to: email,
            subject: 'Request to change password',
            html: `
                <div>
                    <p>You have requested to change your password, do enter the OTP code below in the app to verify and change password.</p>
                    <p><b>${otp}</b></p>
                    <br>
                    <p>Note that, this code expires in <span style="color: red">5 minutes</span></p>
                </div>
            `
        }

        const saltRounds = 10;

        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const del = await UserOTPVerification.deleteMany({userId: _id})
        const newOTPVerification = new UserOTPVerification({
            userId: _id,
            otp: hashedOTP,
        });

        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        next()
    }
    catch(err) {
        next(err);
    }
}

module.exports = { sendOTPVerification, sendOTPforPasswordReset };