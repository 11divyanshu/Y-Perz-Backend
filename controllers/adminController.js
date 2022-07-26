const multer = require('multer');
const path = require('path');
const ServiceSchema = require('../models/service');
const OfferSchema = require('../models/offer');
const VehicleSchema = require('../models/vehicle');
const UserSchema = require('../models/userSchema');
const AdministrationSchema = require('../models/administrationSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
exports.handleAdminLogin = (req, res) => {
  res.render('admin/login', {
    pageTitle: 'Admin Login | Y PEREZ',
    path: '/admin/login'
  });
};

exports.handleAdminHome = (req, res) => {
  res.render('admin/home', {
    pageTitle: 'Admin Home | Y PEREZ',
    path: '/admin/home'
  });
};

exports.handleAdminUsers = (req,res) => {
  UserSchema.findAll()
    .then(function(usersData){
      var data = JSON.parse(JSON.stringify(usersData)); 
      res.render('admin/users', {
        pageTitle: 'Admin Users | Y PEREZ',
        path: '/admin/users',
        data: data
      });
    }).catch(function(err){
      console.log('Oops! something went wrong, : ', err);
    });
  
}

exports.handleAdminServices = (req,res) => {
  ServiceSchema.findAll()
  .then(function(serviceData){
    var data = JSON.parse(JSON.stringify(serviceData)); 
    console.log(data);
    // res.send(data);
    res.render('admin/services', {
      pageTitle: 'Admin Services | Y PEREZ',
      path: '/admin/services',
      confirmation: '205',
      data: data
    });
  }).catch(function(err){
    console.log('Oops! something went wrong, : ', err);
  });
}

exports.handleAdminAddService = (req,res) => {
  res.render('admin/add-service', {
    pageTitle: 'Admin Add Service | Y PEREZ',
    path: '/admin/add-service',
    confirmation: '205'
  });
}

exports.handleAdminAddServicePost = (req,res) => {
  let data = {
    title : req.body.service_title,
    link : req.body.service_link,
    desc : req.body.service_description,
    icon : req.file.path,
  }
  ServiceSchema.create(data)
  .then((response) => { 
    console.log("Service Created Successfully")
    res.render('admin/add-service', {
      pageTitle: 'Admin Add Service | Y PEREZ',
      path: '/admin/add-service',
      confirmation: '202'
    }); 
  })
  .catch(err => {  
    console.log("Service Not Created");
    res.status(204);
    res.render('admin/add-service', {
      pageTitle: 'Admin Add Service | Y PEREZ',
      path: '/admin/add-service',
      confirmation: '204'
    }); 
  }); 
}

exports.handleAdminOffers = (req,res) => {
  OfferSchema.findAll()
  .then(function(offersData){
    var data = JSON.parse(JSON.stringify(offersData)); 
    res.render('admin/offers', {
      pageTitle: 'Admin Offers | Y PEREZ',
      path: '/admin/offers',
      confirmation: '205',
      data: data
    });
  }).catch(function(err){
    console.log('Oops! something went wrong, : ', err);
  });
}

exports.handleAdminAddOffer = (req,res) => {
  res.render('admin/add-offers', {
    pageTitle: 'Admin Add Offer | Y PEREZ',
    path: '/admin/add-offers',
    confirmation: '205'
  });
}

exports.handleAdminAddOfferPost = (req,res) => {
  let data = {
    title : req.body.offer_title,
    price : req.body.offer_price,
    desc : req.body.offer_description,
    offerimage : req.file.path,
  }
  OfferSchema.create(data)
  .then((response) => { 
    console.log("Offer Created Successfully")
    res.render('admin/add-offers', {
      pageTitle: 'Admin Add Service | Y PEREZ',
      path: '/admin/add-offers',
      confirmation: '202'
    }); 
  })
  .catch(err => {  
    console.log("Offer Not Created");
    res.status(204);
    res.render('admin/add-offers', {
      pageTitle: 'Admin Add Offer | Y PEREZ',
      path: '/admin/add-offers',
      confirmation: '204'
    }); 
  }); 
}

exports.handleAdminVehicle = (req,res) => {
  VehicleSchema.findAll()
  .then(function(vehicleData){
    var data = JSON.parse(JSON.stringify(vehicleData)); 
    console.log(data);
    // res.send(data);
    res.render('admin/vehicle', {
      pageTitle: 'Admin Vehicle | Y PEREZ',
      path: '/admin/vehicle',
      confirmation: '205',
      data: data
    });
  }).catch(function(err){
    console.log('Oops! something went wrong, : ', err);
  });
}

exports.handleAdminAddVehicle = (req,res) => {
  res.render('admin/add-vehicle', {
    pageTitle: 'Admin Add Vehicle | Y PEREZ',
    path: '/admin/add-vehicle',
    confirmation: '205'
  });
}

exports.handleAdminAddVehiclePost = (req,res) => {
  let data = {
    vtitle : req.body.vehicle_title,
    vnumber : req.body.vehicle_number,
  }
  console.log(data);
  VehicleSchema.create(data)
  .then((response) => { 
    console.log("Vehicle Added Successfully")
    res.render('admin/add-vehicle', {
      pageTitle: 'Admin Add Vehicle | Y PEREZ',
      path: '/admin/add-vehicle',
      confirmation: '202'
    }); 
  })
  .catch(err => {  
    console.log("Vehicle Not Added");
    res.status(204);
    res.render('admin/add-vehicle', {
      pageTitle: 'Admin Add Vehicle | Y PEREZ',
      path: '/admin/add-vehicle',
      confirmation: '204'
    }); 
  }); 
}

// exports.handleAdministratorLogin = (req,res) => {
//   let data = req.body;
//   // UserSchema.findAll({attribute : {email:data.email}})
//   // .then((response) => {
//   //     let fetchedOtp = JSON.stringify(response, null, 4);
//   //     let extData = JSON.parse(fetchedOtp);
//   //     bcrypt.compare(data.password,extData[0].password, (err,response) => {
//   //         if(response){

//   //         }
//   //     });
//   //   }).catch(function(err){
//   //     console.log('Oops! something went wrong, : ', err);
//   //   });
//   res.send("nice")
// }

const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, 'Images')
  },
  filename : (req,file,cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

exports.upload = multer({
  storage:storage,
  limits: {fileSize:'5000000'},
  fileFilter: (req,file,cb) => {
    const fileTypes = /jpeg|jgp|png|gif/
    const mimeType = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(path.extname(file.originalname))
    if(mimeType && extname){
      return cb(null, true)
    }else{
      return ("Give proper file format to upload");
    }
  }
}).single('icon')

exports.uploadOffer = multer({
  storage:storage,
  limits: {fileSize:'5000000'},
  fileFilter: (req,file,cb) => {
    const fileTypes = /jpeg|jgp|png|gif/
    const mimeType = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(path.extname(file.originalname))
    if(mimeType && extname){
      return cb(null, true)
    }else{
      return ("Give proper file format to upload");
    }
  }
}).single('offerimage')