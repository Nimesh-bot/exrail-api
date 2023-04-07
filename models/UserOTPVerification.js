const mongoose = require('mongoose')

const UserOTPVerificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        // expire in 5 minutes
        default: Date.now() + 5 * 60 * 1000,
    }
});

module.exports = mongoose.model('UserOTPVerification', UserOTPVerificationSchema)