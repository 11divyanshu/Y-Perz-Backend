const path = require('path');

const express = require('express');

const adminController = require('../controllers/adminController');
const supervisorController = require('../controllers/supervisorController');
const cleanerController = require('../controllers/cleanerController');
const ServiceSchema = require('../models/service');
const router = express.Router();


// Administration Authentication
router.get('/login', adminController.handleAdminLogin);
router.post('/administratorLogin', adminController.handleAdministrationLoginPost);
router.post('/logout', adminController.handleAdminLogout);
router.get('/adminregister', adminController.handleAdminRegister);
router.post('/adminregister', adminController.handleAdminRegisterPost);

// Home
router.get('/home', adminController.checkAdministration,adminController.handleAdminHome);

// Users
router.get('/users', adminController.checkAdministration,adminController.handleAdminUsers);

// One Time Wash
router.get('/onetimewash', adminController.checkAdministration,adminController.handleOnetimeWash);
router.post('/onetimeassignsupervisor', adminController.checkAdministration,adminController.handleOneTimeSuperAssign);

// Everyday Wash
router.get('/everydaywash', adminController.checkAdministration,adminController.handleEverydayWash);

// Alternate Wash
router.get('/alternatewash', adminController.checkAdministration,adminController.handleAlternateWash);

// Weekly Wash
router.get('/weeklywash', adminController.checkAdministration,adminController.handleWeeklyWash);

// Raise Query
router.get('/raisequery', adminController.checkAdministration,adminController.handleRaiseQuery);

// Loans
router.get('/loans', adminController.checkAdministration,adminController.handleLoans);


// FAQs
router.get('/faqs', adminController.checkAdministration,adminController.handleFaqs);
router.get('/createfaq', adminController.checkAdministration,adminController.handleCreateFaq);
router.post('/createfaqpost', adminController.checkAdministration,adminController.handleCreateFaqPost);
router.post('/answerfaq', adminController.checkAdministration,adminController.handleAnswerFaq);
router.post('/updatestatus', adminController.checkAdministration,adminController.handleUpdateStatus);

// Car Brands
router.get('/carbrands', adminController.checkAdministration,adminController.handleCarBrands);
router.post('/addcarbrands', adminController.checkAdministration,adminController.uploadcarbrand,adminController.handleAddCarBrands);
router.post('/updatecarbrandstatus', adminController.checkAdministration,adminController.handleUpdateCarBrandStatus);

// Car Loan Brands
router.get('/carloanbrands', adminController.checkAdministration,adminController.handleCarLoanBrands);
router.post('/addcarloanbrands', adminController.checkAdministration,adminController.handleAddCarLoanBrands);
router.post('/updatecarloanbrandstatus', adminController.checkAdministration,adminController.handleUpdateCarLoanBrandStatus);

// Car Insurance Brands
router.get('/carinsurancebrands', adminController.checkAdministration,adminController.handleCarInsuranceBrands);
router.post('/addcarinsurancebrands', adminController.checkAdministration,adminController.handleAddCarInsuranceBrands);
router.post('/updatecarinsurancebrandstatus', adminController.checkAdministration,adminController.handleUpdateCarInsuranceBrandStatus);

// Car Drive Learning Brands
router.get('/cardrivelearningbrands', adminController.checkAdministration,adminController.handleCarDriveLearningBrands);
router.post('/addcardrivelearningbrands', adminController.checkAdministration,adminController.handleAddCarDriveLearningBrands);
router.post('/updatecardrivelearningbrandstatus', adminController.checkAdministration,adminController.handleUpdateCarDriveLearningBrandStatus);

// Temporary Routes
// router.get('/offers', adminController.handleAdminOffers);
// router.get('/add-offers', adminController.handleAdminAddOffer);
// router.post('/add-offers', adminController.uploadOffer , adminController.handleAdminAddOfferPost);

// Cleaner Routes
router.get('/cleanerRegister', cleanerController.handleCleanerRegister);
router.post('/cleanerOtpSend', cleanerController.handlePostCleanerOtpSend);
router.post('/cleanerOtpVerify', cleanerController.handlePostCleanerRegister);

// Supervisor Routes 
router.get('/supervisorRegister', supervisorController.handleSupervisorRegister);
router.post('/supervisorOtpSend', supervisorController.handlePostSupervisorOtpSend);
router.post('/supervisorOtpVerify', supervisorController.handlePostSupervisorRegister);
router.get('/supervisorhome', supervisorController.checkAdministration,supervisorController.handleSupervisorHome);
router.get('/suponetimewash', supervisorController.checkAdministration,supervisorController.handleSupervisorOneTimeWash);
router.post('/onetimeassigncleaner', supervisorController.checkAdministration,supervisorController.handleOneTimeCleanerAssign);
// router.post('/administratorLogin', supervisorController.handleAdministratorLogin);


module.exports = router;
