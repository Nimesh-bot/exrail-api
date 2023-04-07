const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { access_token, refresh_token } = require('../services/createToken');
const { verifyRefresh } = require('../middleware/auth.middleware');
const { sendOTPVerification, sendOTPforPasswordReset } = require('../middleware/OTP.middleware');
const UserOTPVerification = require('../models/UserOTPVerification');

const register = async (req, res, next) => {
    const user_info = req.body;

    try {
        // Validations
        if(user_info.password.length < 8) throw new Error('Password must be at least 8 characters long');
        if(!user_info.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            let err = new Error(`Password must have at least one uppercase, one lowercase, one digit and one special character`);
            err.status = 400;
            return next(err)
        }
        // Hashing password
        const salt = await bcrypt.genSalt();
        const hashed_password = await bcrypt.hash(user_info.password, salt);

        user_info.password = hashed_password;

        // Saving User
        const temp_user = new User(user_info);
        const user = await temp_user.save();
        const {password, ...others} = user._doc;
        res.status(200).json({
            message: 'User registration successful',
            user: { _id: user._id }
        })
    }
    catch(err) {
        next(err);
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    // console.log(email, password)
    try {   
        const check_user = await User.findOne({email: email});
        if(!check_user) throw new Error('User is not registered');

        const auth = await bcrypt.compare(password, check_user.password);
        if(!auth) throw new Error('Incorrect password');

        const access = await access_token(check_user._id);
        const refresh = await refresh_token(check_user._id);

        res.status(200).json({
            message: 'Logged in successfully',
            access,
            refresh,
        })
    }
    catch(err) {
        next(err);
    }
}

const changePassword = async(req, res, next)=>{
    const {oldpassword, newpassword} = req.body
    
    try{

        const check_user = await User.findById(req.user.aud)
        if(!check_user) throw new Error('User is not registered');

        const auth = await bcrypt.compare(oldpassword, check_user.password);
        if(!auth) throw new Error('Incorrect password');

        if(newpassword.length < 8) throw new Error('Password must be at least 8 characters long');
        if(!newpassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            let err = new Error(`Password must have at least one uppercase, one lowercase, one digit and one special character`);
            err.status = 400;
            return next(err)
        }
        // Hashing password
        const salt = await bcrypt.genSalt();
        const hashed_password = await bcrypt.hash(newpassword, salt);

        await check_user.updateOne({password: hashed_password})

        res.status(200).json({
            message: 'Password changed successfully',
        })


    }catch(err){
        next(err)
    }
}

const verifyOTP = async(req, res, next) => {
    try{
        let { userId, otp } = req.body;
        if(!userId || !otp) throw new Error('User ID and OTP are required');
        const UserOTPVerificationRecords = await UserOTPVerification.findOne({userId})
        if(!UserOTPVerificationRecords) throw new Error('User either does not exist or is already verified');
        const { expiresAt } = UserOTPVerificationRecords;
        const hashedOTP = UserOTPVerificationRecords.otp;

        if(Date.now() > expiresAt) {
            await UserOTPVerification.deleteMany({ userId });
            throw new Error('OTP has expired');
        }
        else {
            const validOTP = await bcrypt.compare(otp, hashedOTP);
            if(!validOTP) {
                throw new Error('Invalid OTP');
            }
            else {
                User.findByIdAndUpdate(userId, { $set: { isVerified: true } }, (err, result) => {
                    if(err) throw new Error(err);
                    res.json({
                        message: 'User verified successfully',
                        data: {
                            result,
                        },
                    });
                });
            }
        }
    }
    catch(err) {
        next(err);
    }
}

const verifyOTPforPasswordReset = async(req, res, next) => {
    try {
        let { _id, otp } = req.body;
        if(!_id || !otp) throw new Error('User ID and OTP are required');
        const UserOTPVerificationRecord = await UserOTPVerification.findOne({userId: _id});
        const hashedOTP = UserOTPVerificationRecord.otp;

        const validOTP = await bcrypt.compare(otp, hashedOTP);
        if(!validOTP) {
            throw new Error('Invalid OTP');
        }
        else {
            await UserOTPVerification.deleteMany({ userId: _id });
            // set isVerified of user model to true
            User.findByIdAndUpdate(_id, { $set: { passResetVerified: true } }, (err, result) => {
                if(err) throw new Error(err);
                res.json({
                    message: 'Request sent successfully',
                    data: {
                        result,
                    },
                });
            });
        }
    }
    catch(err) {
        next(err);
    }
}

const resendOTP = async(req, res, next) => {
    try {
        const { email } = req.body;
        if(!email) {
            throw new Error('Either user ID or email is required');
        }
        else {
            const user = await User.findOne({email});
            if(user.isVerified) {
                throw new Error('User is already verified');
            }
            else {
                await sendOTPVerification(user, next);
            }
        }
        res.status(200).json({
            message: 'OTP re-sent successfully',
        })
    }
    catch(err) {
        next(err);
    }
}

const request_access = async (req, res, next) => {
    const { refresh_token } = req.body

    try {
        if(!refresh_token) throw new Error('Unauthorized access, refresh token not provided');
        const verify = await verifyRefresh(refresh_token);

        if(verify.Error) {
            return res.status(401).json({
                "Unauthorized": "Invalid Token"
            })
        };
        const access_token = await access_token(verify.aud);

        res.status(200).json({
            message: 'Access token generated successfully',
            access_token
        })
    }
    catch(err) {
        next(err);
    }
}

const passwordResetRequest = async (req, res, next) => {
    try {
        const { email } = req.body;
        if(!email) throw new Error('Email is required');
        const user = await User.findOne({email})
        if(!user) throw Error("User not found")
        await sendOTPforPasswordReset(user, next);
        res.status(200).json({
            message: 'Otp requested successful',
            userId: user._id
        })
    }
    catch(err) {
        next(err);
    }
}

const newPassword = async(req, res, next)=>{
    const {userId, password} = req.body

    console.log(userId, password)

    try{

        const check_user = await User.findById(userId)
        if(!check_user) throw new Error('User is not registered');


        if(password.length < 8) throw new Error('Password must be at least 8 characters long');
        if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            let err = new Error(`Password must have at least one uppercase, one lowercase, one digit and one special character`);
            err.status = 400;
            return next(err)
        }
        // Hashing password
        const salt = await bcrypt.genSalt();
        const hashed_password = await bcrypt.hash(password, salt);

        await check_user.updateOne({password: hashed_password})

        User.findOneAndUpdate(userId, { $set: { passResetVerified: false } }, (err, result) => {
            if(err) throw new Error(err);
            res.json({
                message: 'Password reset successfully',
            });
        });        
    }catch(err){
        next(err)
    }
}

module.exports = { register, login, changePassword, request_access, verifyOTP, verifyOTPforPasswordReset, resendOTP, passwordResetRequest, newPassword }