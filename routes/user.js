const path = require('path');

const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.post('/otplogin',  userController.handleUserLoginOTP);
router.post('/login',  userController.handleUserLogin);
router.post('/checkUser',  userController.handleCheckUser);
router.post('/register', userController.handleUserRegisterOTP);
router.post('/otpcheckregister', userController.handleOtpCheckRegister);
router.post('/logout', userController.handleUserLogout);
router.post('/resendotp', userController.handleOtpResend);
router.post('/userprofileupdate', userController.userProfileUpdate);
router.post('/userprofilepicupdate', userController.uploadProfilePic, userController.userProfilePicUpdate);
router.post('/userprofilepicremove', userController.userProfilePicRemove);
router.post('/adduservehicle', userController.addUserVehicle);
router.post('/singleServiceAddRoute', userController.addSingleTimeServiceModule);
router.post('/singleServicePaymentConfirm', userController.singleServicePaymentConfirm);
router.post('/getSingleServiceUserData', userController.getSingleServiceUserData);
router.post('/everydayServiceAddRoute', userController.addeverydayservice);
router.post('/everydayServicePaymentConfirm', userController.everydayServicePaymentConfirm);
router.post('/getEverydayServiceUserData', userController.getEverydayServiceUserData);
router.post('/addfaq', userController.addFaqs);
router.post('/addquery', userController.addQuery);
router.post('/addloan', userController.addLoan);


module.exports = router;

