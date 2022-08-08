const path = require('path');

const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

// User Authentication
router.post('/otplogin',  userController.handleUserLoginOTP);
router.post('/login',  userController.handleUserLogin);
router.post('/checkUser',  userController.handleCheckUser);
router.post('/register', userController.handleUserRegisterOTP);
router.post('/otpcheckregister', userController.handleOtpCheckRegister);
router.post('/logout', userController.handleUserLogout);
router.post('/resendotp', userController.handleOtpResend);

// User Profile Management
router.post('/userprofileupdate', userController.userProfileUpdate);
router.post('/userprofilepicupdate', userController.uploadProfilePic, userController.userProfilePicUpdate);
router.post('/userprofilepicremove', userController.userProfilePicRemove);
router.post('/adduservehicle', userController.addUserVehicle);

// Single Time Service
router.post('/singleServiceAddRoute', userController.addSingleTimeServiceModule);
router.post('/singleServicePaymentConfirm', userController.singleServicePaymentConfirm);
router.post('/getSingleServiceUserData', userController.getSingleServiceUserData);

// Weekly Service
router.post('/weeklyServiceAddRoute', userController.addWeeklyServiceModule);
router.post('/weeklyServicePaymentConfirm', userController.weeklyServicePaymentConfirm);
router.post('/getWeeklyServiceUserData', userController.getWeeklyServiceUserData);

// Alternate Service
router.post('/alternateServiceAddRoute', userController.addAlternateServiceModule);
router.post('/alternateServicePaymentConfirm', userController.alternateServicePaymentConfirm);
router.post('/getAlternateServiceUserData', userController.getAlternateServiceUserData);

// Everyday Service
router.post('/everydayServiceAddRoute', userController.addeverydayservice);
router.post('/everydayServicePaymentConfirm', userController.everydayServicePaymentConfirm);
router.post('/getEverydayServiceUserData', userController.getEverydayServiceUserData);

// Dry Cleaning Service
router.post('/drycleanServiceAddRoute', userController.addDryCleanService);
router.post('/drycleanServicePaymentConfirm', userController.drycleanServicePaymentConfirm);
router.post('/getDryCleanServiceUserData', userController.getDryCleanServiceUserData);

// Rubbing And Polishing Service
router.post('/rubpolishServiceAddRoute', userController.addRubPolishService);
router.post('/rubpolishServicePaymentConfirm', userController.rubpolishServicePaymentConfirm);
router.post('/getRubPolishServiceUserData', userController.getRubPolishServiceUserData);

// Brands Data Fetching
router.post('/getCarBrands', userController.getCarBrands);
router.post('/getCarLoanBrands', userController.getCarLoanBrands);
router.post('/getCarInsuranceBrands', userController.getCarInsuranceBrands);
router.post('/getCarDriveLearnBrands', userController.getCarDriveLearnBrands);
router.post('/getRSACarBrands', userController.getRSACarBrands);


// Get Faqs
router.post('/getFaq', userController.getFaqs);

// Add Queries
router.post('/addquery', userController.addQuery);

// Add Loans
router.post('/addloan', userController.addLoan);

// Create Order IDs
router.post('/createOrderID', userController.createOrderID);

module.exports = router;

