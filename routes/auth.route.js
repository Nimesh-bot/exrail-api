const express = require('express');
const authController = require('../controllers/auth.cont');
const { verify_user } = require('../middleware/auth.middleware');


const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/changePassword', verify_user, authController.changePassword)
router.post('/verify', authController.verifyOTP);
router.post('/verify/reset', authController.verifyOTPforPasswordReset);
router.post('/requestOTP', authController.resendOTP);
router.post('/passwordReset', authController.passwordResetRequest)
router.put('/newPassword', authController.newPassword)

module.exports = router;