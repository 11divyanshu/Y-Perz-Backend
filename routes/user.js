const path = require('path');

const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login',  userController.handleUserLogin);
router.post('/register', userController.handleUserRegisterOTP);
router.post('/otpcheck', userController.handleOtpCheckRegister);
router.post('/logout', userController.handleUserLogout);
router.post('/resendotp', userController.handleOtpResend);
router.post('/forgetPassOtpGen', userController.forgetPassOtpGen);
router.post('/forgetPassOtpCheck', userController.forgetPassOtpCheck);
router.post('/regeneratePasswordFunction', userController.regeneratePasswordFunction);

module.exports = router;
