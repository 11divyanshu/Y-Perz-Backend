const path = require('path');

const express = require('express');

const adminController = require('../controllers/adminController');
const supervisorController = require('../controllers/supervisorController');
const cleanerController = require('../controllers/cleanerController');
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
router.post('/everydayassignsupervisor', adminController.checkAdministration,adminController.handleEverydaySuperAssign);

// Alternate Wash
router.get('/alternatewash', adminController.checkAdministration,adminController.handleAlternateWash);
router.post('/alternateassignsupervisor', adminController.checkAdministration,adminController.handleAlternateSuperAssign);

// Weekly Wash
router.get('/weeklywash', adminController.checkAdministration,adminController.handleWeeklyWash);
router.post('/weeklyassignsupervisor', adminController.checkAdministration,adminController.handleWeeklySuperAssign);

// Dry Cleaning
router.get('/dryclean', adminController.checkAdministration,adminController.handleDryClean);
router.post('/drycleanassignsupervisor', adminController.checkAdministration,adminController.handleDryCleanSuperAssign);

// Dry Cleaning
router.get('/rubpolish', adminController.checkAdministration,adminController.handleRubPolish);
router.post('/rubpolishassignsupervisor', adminController.checkAdministration,adminController.handleRubPolishSuperAssign);

// Raise Query
router.get('/raisequery', adminController.checkAdministration,adminController.handleRaiseQuery);

// Loans
router.get('/loans', adminController.checkAdministration,adminController.handleLoans);

// Insurance
router.get('/insurance', adminController.checkAdministration,adminController.handleInsurance);

// Drive Learn
router.get('/drivelearn', adminController.checkAdministration,adminController.handleDriveLearn);

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
router.post('/addcarloanbrands', adminController.checkAdministration,adminController.uploadcarbrand,adminController.handleAddCarLoanBrands);
router.post('/updatecarloanbrandstatus', adminController.checkAdministration,adminController.handleUpdateCarLoanBrandStatus);

// Car Insurance Brands
router.get('/carinsurancebrands', adminController.checkAdministration,adminController.handleCarInsuranceBrands);
router.post('/addcarinsurancebrands', adminController.checkAdministration,adminController.uploadcarbrand,adminController.handleAddCarInsuranceBrands);
router.post('/updatecarinsurancebrandstatus', adminController.checkAdministration,adminController.handleUpdateCarInsuranceBrandStatus);

// Car Drive Learning Brands
router.get('/cardrivelearningbrands', adminController.checkAdministration,adminController.handleCarDriveLearningBrands);
router.post('/addcardrivelearningbrands', adminController.checkAdministration,adminController.handleAddCarDriveLearningBrands);
router.post('/updatecardrivelearningbrandstatus', adminController.checkAdministration,adminController.handleUpdateCarDriveLearningBrandStatus);

// RSA Car Brands
router.get('/rsaservices', adminController.checkAdministration,adminController.handleRSACarBrands);
router.post('/addrsabrand', adminController.checkAdministration,adminController.uploadcarbrand,adminController.handleAddRSACarBrands);
router.post('/updatersacarbrandstatus', adminController.checkAdministration,adminController.handleUpdateRSACarBrandStatus);







// Cleaner Routes
// Cleaner Authentication
router.get('/cleanerRegister', cleanerController.handleCleanerRegister);
router.post('/cleanerOtpSend', cleanerController.handlePostCleanerOtpSend);
router.post('/cleanerOtpVerify', cleanerController.handlePostCleanerRegister);

// Cleaner Home
router.get('/cleanerhome', cleanerController.checkAdministration,cleanerController.handleCleanerHome);

// Cleaner One Time Wash
router.get('/cleaneronetimewash', cleanerController.checkAdministration,cleanerController.handleCleanerOneTimeWash);
router.post('/cleaneronetimecompleteservice', cleanerController.checkAdministration,cleanerController.handleOneTimeCleanerComplete);

// Cleaner Everyday Wash
router.get('/cleanereverydaywash', cleanerController.checkAdministration,cleanerController.handleCleanerEverydayWash);
router.post('/cleanereverydaycompleteservice', cleanerController.checkAdministration,cleanerController.handleEverydayCleanerComplete);

// Cleaner Weekly Wash
router.get('/cleanerweeklywash', cleanerController.checkAdministration,cleanerController.handleCleanerWeeklyWash);
router.post('/cleanerweeklycompleteservice', cleanerController.checkAdministration,cleanerController.handleWeeklyCleanerComplete);

// Cleaner Weekly Wash
router.get('/cleaneralternatewash', cleanerController.checkAdministration,cleanerController.handleCleanerAlternateWash);
router.post('/cleaneralternatecompleteservice', cleanerController.checkAdministration,cleanerController.handleAlternateCleanerComplete);

// Cleaner Dry Cleaning
router.get('/cleanerdryclean', cleanerController.checkAdministration,cleanerController.handleCleanerDryClean);
router.post('/cleanerdrycleancompleteservice', cleanerController.checkAdministration,cleanerController.handleDryCleanCleanerComplete);

// Cleaner Rubbing And Polishing
router.get('/cleanerrubpolish', cleanerController.checkAdministration,cleanerController.handleCleanerRubPolish);
router.post('/cleanerrubpolishcompleteservice', cleanerController.checkAdministration,cleanerController.handleRubPolishCleanerComplete);











// Supervisor Routes 
// Supervisor Authentication
router.get('/supervisorRegister', supervisorController.handleSupervisorRegister);
router.post('/supervisorOtpSend', supervisorController.handlePostSupervisorOtpSend);
router.post('/supervisorOtpVerify', supervisorController.handlePostSupervisorRegister);

// Supervisor Home
router.get('/supervisorhome', supervisorController.checkAdministration,supervisorController.handleSupervisorHome);

// Supervisor One Time Wash
router.get('/suponetimewash', supervisorController.checkAdministration,supervisorController.handleSupervisorOneTimeWash);
router.post('/onetimeassigncleaner', supervisorController.checkAdministration,supervisorController.handleOneTimeCleanerAssign);

// Supervisor Everyday Wash
router.get('/supeverydaywash', supervisorController.checkAdministration,supervisorController.handleSupervisorEverydayWash);
router.post('/everydayassigncleaner', supervisorController.checkAdministration,supervisorController.handleEverydayCleanerAssign);

// Supervisor Weekly Wash
router.get('/supweeklywash', supervisorController.checkAdministration,supervisorController.handleSupervisorWeeklyWash);
router.post('/weeklyassigncleaner', supervisorController.checkAdministration,supervisorController.handleWeeklyCleanerAssign);

// Supervisor Alternate Wash
router.get('/supalternatewash', supervisorController.checkAdministration,supervisorController.handleSupervisorAlternateWash);
router.post('/alternateassigncleaner', supervisorController.checkAdministration,supervisorController.handleAlternateCleanerAssign);

// Supervisor Dry Cleaning 
router.get('/supdryclean', supervisorController.checkAdministration,supervisorController.handleSupervisorDryClean);
router.post('/drycleanassigncleaner', supervisorController.checkAdministration,supervisorController.handleDryCleanCleanerAssign);

// Supervisor Rubbing And Cleaning
router.get('/suprubpolish', supervisorController.checkAdministration,supervisorController.handleSupervisorRubPolish);
router.post('/rubpolishassigncleaner', supervisorController.checkAdministration,supervisorController.handleRubPolishCleanerAssign);

module.exports = router;
