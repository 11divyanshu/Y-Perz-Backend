const path = require('path');

const express = require('express');

const adminController = require('../controllers/adminController');
const ServiceSchema = require('../models/service');
const router = express.Router();

router.get('/login', adminController.handleAdminLogin);
router.get('/home', adminController.handleAdminHome);
router.get('/users', adminController.handleAdminUsers);
router.get('/offers', adminController.handleAdminOffers);
router.get('/vehicle', adminController.handleAdminVehicle);
router.get('/services', adminController.handleAdminServices);
router.get('/add-service', adminController.handleAdminAddService);
router.get('/add-offers', adminController.handleAdminAddOffer);
router.get('/add-vehicle', adminController.handleAdminAddVehicle);
router.post('/add-service', adminController.upload , adminController.handleAdminAddServicePost);
router.post('/add-offers', adminController.uploadOffer , adminController.handleAdminAddOfferPost);
router.post('/add-vehicle' , adminController.handleAdminAddVehiclePost);

module.exports = router;
