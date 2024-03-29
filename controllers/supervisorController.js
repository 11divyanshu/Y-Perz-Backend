const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const unirest = require('unirest');
const OtpStore = require('../models/userAuth');
const EverydaySchema = require('../models/everydaySchema');
const WeeklySchema = require('../models/weeklySchema');
const AlternateSchema = require('../models/alternateSchema');
const AdministrationSchema = require('../models/administrationSchema');
const DryCleaningSchema = require('../models/dryCleaningSchema');
const RubPolishSchema = require('../models/rubAndPolishSchema');
const multer = require('multer');
const SingleTimeServiceSchema = require('../models/singleTimeServiceSchema');
let LocalStorage = require('node-localstorage').LocalStorage;
if (typeof localStorage === "undefined" || localStorage === null) {
    localStorage = new LocalStorage('./scratch');
}
require('dotenv').config();

exports.handleSupervisorRegister = (req, res) => {
    res.render('admin/supervisorRegister', {
        pageTitle: 'Supervisor Register | Y PEREZ',
        path: '/supervisor/register',
        confirmation: '202',
        otp: 0
    });
}

exports.handlePostSupervisorOtpSend = (req, res) => {
    let data = req.body;
    let lastPhone = data.suvisor_phone.slice(6);
    AdministrationSchema.findAll({
        where: {
            phone: req.body.suvisor_phone
        }
    }).then(d => {
        let fetchedData = JSON.stringify(d, null, 4);
        let data1 = JSON.parse(fetchedData);
        if (data1.length > 0) {
            if (data1[0].verify === 1) {
                // Already Account Created and Verified
                console.log("Otp Store Updated");
                res.status(202);
                res.render('admin/supervisorRegister', {
                    pageTitle: 'Supervisor Register | Y PEREZ',
                    path: '/supervisor/register',
                    confirmation: '202',
                    otp: -1
                });
            } else {
                // Already Account Created and Not Verified
                let otpVal = Math.floor(Math.random() * 10000) + 1001;
                let len = otpVal.toString();
                if (len.length > 4) {
                    otpVal = otpVal / 10;
                }
                otpVal = Math.floor(otpVal);
                len = otpVal.toString();
                var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
                req.headers({
                    authorization:
                        "hVKQnXXGfvK5iOl1sG5wwfWepO9X8igDjI9GmwZXL1aT9Ef7lZkVqQB5zPmm",
                });
                req.form({
                    variables_values: len,
                    route: "otp",
                    numbers: data.suvisor_phone,
                });
                req.end(function (resVar) {
                    if (res.error) throw new Error(res.error);
                    var resData = {
                        userMobNum: data.phone,
                        otp: len,
                    };
                    OtpStore.findAll({ attribute: { phone: data.suvisor_phone } })
                        .then((otpres) => {
                            let fetchedOtp1 = JSON.stringify(otpres, null, 4);
                            let extData1 = JSON.parse(fetchedOtp1);
                            if (extData1.length > 0) {
                                OtpStore.update(
                                    {
                                        otp: len
                                    },
                                    {
                                        where: { phone: data.suvisor_phone }
                                    }
                                )
                                    .then((response2) => {
                                        console.log("Otp Store Updated");
                                        res.status(202);
                                        res.render('admin/otp', {
                                            pageTitle: 'Supervisor OTP Verification | Y PEREZ',
                                            path: '/supervisor/otpverification',
                                            confirmation: '202',
                                            otp: 1,
                                            userPhone: data.suvisor_phone,
                                            lastDigit: lastPhone
                                        });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(205);
                                        res.render('admin/supervisorRegister', {
                                            pageTitle: 'Supervisor Register | Y PEREZ',
                                            path: '/supervisor/register',
                                            confirmation: '205',
                                            otp: 0
                                        });
                                    })
                            } else {

                                OtpStore.create({
                                    phone: data.suvisor_phone,
                                    otp: len
                                }).then((dbres) => {
                                    console.log("Otp Store Updated");
                                    res.status(202);
                                    res.render('admin/otp', {
                                        pageTitle: 'Supervisor OTP Verification | Y PEREZ',
                                        path: '/supervisor/otpverification',
                                        confirmation: '202',
                                        otp: 1,
                                        userPhone: data.suvisor_phone,
                                        lastDigit: lastPhone
                                    });
                                }).catch(err => {
                                    console.log(err);
                                    res.status(205);
                                    res.render('admin/supervisorRegister', {
                                        pageTitle: 'Supervisor Register | Y PEREZ',
                                        path: '/supervisor/register',
                                        confirmation: '205',
                                        otp: 0
                                    });
                                })
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(205);
                            res.render('admin/supervisorRegister', {
                                pageTitle: 'Supervisor Register | Y PEREZ',
                                path: '/supervisor/register',
                                confirmation: '205',
                                otp: 0
                            });
                        })
                })
            }
        } else {
            // No Account Created
            bcrypt.hash(data.suvisor_pass, 12).then(hash => {
                AdministrationSchema.create({
                    fName: data.suvisor_name,
                    email: data.suvisor_email,
                    phone: data.suvisor_phone,
                    password: hash,
                    location: data.suvisor_location,
                    desc: data.suvisor_desc,
                    profilepic: "",
                    type: "2",
                    verify: 0
                }).then((dbres1) => {
                    let otpVal = Math.floor(Math.random() * 10000) + 1001;
                    let len = otpVal.toString();
                    if (len.length > 4) {
                        otpVal = otpVal / 10;
                    }
                    otpVal = Math.floor(otpVal);
                    len = otpVal.toString();
                    var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
                    req.headers({
                        authorization:
                            "hVKQnXXGfvK5iOl1sG5wwfWepO9X8igDjI9GmwZXL1aT9Ef7lZkVqQB5zPmm",
                    });
                    req.form({
                        variables_values: len,
                        route: "otp",
                        numbers: data.suvisor_phone,
                    });
                    req.end(function (resVar) {
                        if (res.error) throw new Error(res.error);
                        var resData = {
                            userMobNum: data.phone,
                            otp: len,
                        };
                        OtpStore.findAll({ attribute: { phone: data.suvisor_phone } })
                            .then((otpres) => {
                                let fetchedOtp1 = JSON.stringify(otpres, null, 4);
                                let extData1 = JSON.parse(fetchedOtp1);
                                if (extData1.length > 0) {
                                    OtpStore.update(
                                        {
                                            otp: len
                                        },
                                        {
                                            where: { phone: data.suvisor_phone }
                                        }
                                    )
                                        .then((response2) => {
                                            console.log("Otp Store Updated");
                                            res.status(202);
                                            res.render('admin/otp', {
                                                pageTitle: 'Supervisor OTP Verification | Y PEREZ',
                                                path: '/supervisor/otpverification',
                                                confirmation: '202',
                                                otp: 1,
                                                userPhone: data.suvisor_phone,
                                                lastDigit: lastPhone
                                            });
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            res.status(205);
                                            res.render('admin/supervisorRegister', {
                                                pageTitle: 'Supervisor Register | Y PEREZ',
                                                path: '/supervisor/register',
                                                confirmation: '205',
                                                otp: 0
                                            });
                                        })
                                } else {

                                    OtpStore.create({
                                        phone: data.suvisor_phone,
                                        otp: len
                                    }).then((dbres) => {
                                        console.log("Otp Store Updated");
                                        res.status(202);
                                        res.render('admin/otp', {
                                            pageTitle: 'Supervisor OTP Verification | Y PEREZ',
                                            path: '/supervisor/otpverification',
                                            confirmation: '202',
                                            otp: 1,
                                            userPhone: data.suvisor_phone,
                                            lastDigit: lastPhone
                                        });
                                    }).catch(err => {
                                        console.log(err);
                                        res.status(205);
                                        res.render('admin/supervisorRegister', {
                                            pageTitle: 'Supervisor Register | Y PEREZ',
                                            path: '/supervisor/register',
                                            confirmation: '205',
                                            otp: 0
                                        });
                                    })
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(205);
                                res.render('admin/supervisorRegister', {
                                    pageTitle: 'Supervisor Register | Y PEREZ',
                                    path: '/supervisor/register',
                                    confirmation: '205',
                                    otp: 0
                                });
                            })
                    })
                }).catch(err => {
                    console.log(err);
                    res.status(205);
                    res.render('admin/supervisorRegister', {
                        pageTitle: 'Supervisor Register | Y PEREZ',
                        path: '/supervisor/register',
                        confirmation: '205',
                        otp: 0
                    });
                })
            })
        }
    }).catch(err => {
        console.log(err);
        res.status(205);
        res.render('admin/supervisorRegister', {
            pageTitle: 'Supervisor Register | Y PEREZ',
            path: '/supervisor/register',
            confirmation: '205',
            otp: 0
        });
    });

}

exports.handlePostSupervisorRegister = (req, res) => {
    let data = req.body;
    let otpVal = data.firstInput + data.secondInput + data.thirdInput + data.fourthInput;
    let userPhone = data.suvisor_phone;
    let lastDigit = data.lastDigit;
    OtpStore.findAll({ attribute: { phone: req.body.suvisor_phone } })
        .then(dbres => {
            let fetchedOtp1 = JSON.stringify(dbres, null, 4);
            let extData1 = JSON.parse(fetchedOtp1);
            if (extData1.length > 0) {
                if (extData1[0].otp === otpVal) {
                    OtpStore.destroy(
                        {
                            where: { phone: req.body.suvisor_phone }
                        }
                    )
                        .then(dbres => {
                            console.log("Otp Store Deleted");
                            AdministrationSchema.update
                                ({
                                    verify: 1
                                },
                                    {
                                        where: {
                                            phone: data.suvisor_phone
                                        }
                                    }
                                ).then((dbres) => {
                                    res.status(200);
                                    res.redirect('/admin/login')
                                }).catch(err => {
                                    console.log("Failed");
                                    res.status(205);
                                    res.redirect('admin/supervisorRegister')
                                })
                        })
                        .catch(err => {
                            console.log("Failed");
                            res.status(205);
                            res.render('admin/otp', {
                                pageTitle: 'Supervisor OTP Verification | Y PEREZ',
                                path: '/supervisor/otpverification',
                                confirmation: '205',
                                otp: 0,
                                userPhone: userPhone,
                                lastDigit: lastDigit
                            });
                        })
                } else {
                    // OTP Invalid
                    res.redirect('/admin/supervisorRegister')
                }
            } else {
                res.redirect('/admin/supervisorRegister')
            }
        }).catch(err => {
            res.redirect('/admin/supervisorRegister')
        })
}

exports.handleSupervisorHome = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    res.status(202);
    res.render('supervisor/suphome', {
        pageTitle: 'Supervisor Home | Y PEREZ',
        path: '/admin/supervisorhome',
        pageName: 'Home | Administration Panel',
        confirmation: '202',
        data: data
    });
}

exports.checkAdministration = (req, res, next) => {
    let data = JSON.parse(localStorage.getItem('data'));
    if (data === null) {
        res.redirect('/admin/login');
    } else {
        return next();
    }
}

// One Time Wash Contorllers
exports.handleSupervisorOneTimeWash = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    SingleTimeServiceSchema.findAll({ where: { supervisor_num: data.phone } })
        .then(response => {
            let fetchedOtp = JSON.stringify(response, null, 4);
            let extData = JSON.parse(fetchedOtp);

            AdministrationSchema.findAll(
                { where: { type: "3" } }
            )
                .then(response1 => {
                    let fetchedOtp1 = JSON.stringify(response1, null, 4);
                    let extData1 = JSON.parse(fetchedOtp1);
                    res.render('supervisor/suponetimewash', {
                        pageTitle: 'Supervisor One Time Wash | YPERZ',
                        pageName: 'One Time Wash | Administration Panel',
                        path: '/admin/suponetimewash',
                        onetimeWash: extData,
                        cleaners: extData1,
                        data: data
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.render('supervisor/suphome', {
                        pageTitle: 'Supervisor Home | YPERZ',
                        pageName: 'Home | Administration Panel',
                        path: '/admin/supervisorhome',
                        data: data
                    });
                });

        })
        .catch(err => {
            console.log(err);
            res.render('supervisor/suphome', {
                pageTitle: 'Supervisor Home | YPERZ',
                pageName: 'Home | Administration Panel',
                path: '/admin/supervisorhome',
                data: data
            });
        });
}

exports.handleOneTimeCleanerAssign = (req, res) => {
    let data = req.body;
    console.log(data);
    SingleTimeServiceSchema.update(
        {
            cleaner_num: data.cleaner_phone,
            cleaner_name: data.cleaner_name
        },
        {
            where: {
                id: data.id,
                phone: data.phone
            }
        }
    )
        .then(response => {
            UserSchema.findAll({
                where: { phone: data.phone }
              })
                .then(response1 => {
                  let fetchedData = JSON.stringify(response1, null, 4);
                  let extData = JSON.parse(fetchedData);
                  let device = [];
                  device.push(extData[0].devices);
                  let message = {
                    app_id: ONE_SIGNAL_CONFIG.APP_ID,
                    contents: {
                      en: `${data.cleaner_name} has assigned you as cleaner to your one time wash service.`
                    },
                    included_segments: ["include_player_ids"],
                    include_player_ids: [extData[0].devices]
                  }
                
                  pushNotificationServices.SendNotifications(message, (error, results) => {
                    if (error) {
                      res.send(error);
                    }
                    console.log(results);
                    res.redirect('/admin/suponetimewash'); 
                  })
                })
                .catch(err => {
                  console.log(err);
                  res.redirect('admin/home');
                })
        })
        .catch(err => {
            console.log(err);
            res.redirect('admin/supervisorhome');
        })
}

// Every Day Wash Contorllers
exports.handleSupervisorEverydayWash = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    EverydaySchema.findAll({ where: { supervisor_num: data.phone } })
        .then(response => {
            let fetchedOtp = JSON.stringify(response, null, 4);
            let extData = JSON.parse(fetchedOtp);

            AdministrationSchema.findAll(
                { where: { type: "3" } }
            )
                .then(response1 => {
                    let fetchedOtp1 = JSON.stringify(response1, null, 4);
                    let extData1 = JSON.parse(fetchedOtp1);
                    res.render('supervisor/supeverydaywash', {
                        pageTitle: 'Supervisor Everyday Wash | YPERZ',
                        pageName: 'Everyday Wash | Administration Panel',
                        path: '/admin/supeverydaywash',
                        everydayWash: extData,
                        cleaners: extData1,
                        data: data
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.render('supervisor/suphome', {
                        pageTitle: 'Supervisor Home | YPERZ',
                        pageName: 'Home | Administration Panel',
                        path: '/admin/supervisorhome',
                        data: data
                    });
                });

        })
        .catch(err => {
            console.log(err);
            res.render('supervisor/suphome', {
                pageTitle: 'Supervisor Home | YPERZ',
                pageName: 'Home | Administration Panel',
                path: '/admin/supervisorhome',
                data: data
            });
        });
}

exports.handleEverydayCleanerAssign = (req, res) => {
    let data = req.body;
    console.log(data);
    EverydaySchema.update(
        {
            cleaner_num: data.cleaner_phone,
            cleaner_name: data.cleaner_name
        },
        {
            where: {
                id: data.id,
                phone: data.phone
            }
        }
    )
        .then(response => {
            UserSchema.findAll({
                where: { phone: data.phone }
              })
                .then(response1 => {
                  let fetchedData = JSON.stringify(response1, null, 4);
                  let extData = JSON.parse(fetchedData);
                  let device = [];
                  device.push(extData[0].devices);
                  let message = {
                    app_id: ONE_SIGNAL_CONFIG.APP_ID,
                    contents: {
                      en: `${data.cleaner_name} has assigned you as cleaner to your everyday wash service.`
                    },
                    included_segments: ["include_player_ids"],
                    include_player_ids: [extData[0].devices]
                  }
                
                  pushNotificationServices.SendNotifications(message, (error, results) => {
                    if (error) {
                      res.send(error);
                    }
                    console.log(results);
                    res.redirect('/admin/supeverydaywash'); 
                  })
                })
                .catch(err => {
                  console.log(err);
                  res.redirect('admin/home');
                })
        })
        .catch(err => {
            console.log(err);
            res.redirect('admin/supervisorhome');
        })
}

// Weekly Wash Contorllers
exports.handleSupervisorWeeklyWash = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    WeeklySchema.findAll({ where: { supervisor_num: data.phone } })
        .then(response => {
            let fetchedOtp = JSON.stringify(response, null, 4);
            let extData = JSON.parse(fetchedOtp);

            AdministrationSchema.findAll(
                { where: { type: "3" } }
            )
                .then(response1 => {
                    let fetchedOtp1 = JSON.stringify(response1, null, 4);
                    let extData1 = JSON.parse(fetchedOtp1);
                    res.render('supervisor/supweeklywash', {
                        pageTitle: 'Supervisor Weekly Wash | YPERZ',
                        pageName: 'Weekly Wash | Administration Panel',
                        path: '/admin/supweeklywash',
                        weeklyWash: extData,
                        cleaners: extData1,
                        data: data
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.render('supervisor/suphome', {
                        pageTitle: 'Supervisor Home | YPERZ',
                        pageName: 'Home | Administration Panel',
                        path: '/admin/supervisorhome',
                        data: data
                    });
                });

        })
        .catch(err => {
            console.log(err);
            res.render('supervisor/suphome', {
                pageTitle: 'Supervisor Home | YPERZ',
                pageName: 'Home | Administration Panel',
                path: '/admin/supervisorhome',
                data: data
            });
        });
}

exports.handleWeeklyCleanerAssign = (req, res) => {
    let data = req.body;
    console.log(data);
    WeeklySchema.update(
        {
            cleaner_num: data.cleaner_phone,
            cleaner_name: data.cleaner_name
        },
        {
            where: {
                id: data.id,
                phone: data.phone
            }
        }
    )
        .then(response => {
            UserSchema.findAll({
                where: { phone: data.phone }
              })
                .then(response1 => {
                  let fetchedData = JSON.stringify(response1, null, 4);
                  let extData = JSON.parse(fetchedData);
                  let device = [];
                  device.push(extData[0].devices);
                  let message = {
                    app_id: ONE_SIGNAL_CONFIG.APP_ID,
                    contents: {
                      en: `${data.cleaner_name} has assigned you as cleaner to your weekly wash service.`
                    },
                    included_segments: ["include_player_ids"],
                    include_player_ids: [extData[0].devices]
                  }
                
                  pushNotificationServices.SendNotifications(message, (error, results) => {
                    if (error) {
                      res.send(error);
                    }
                    console.log(results);
                    res.redirect('/admin/supweeklywash'); 
                  })
                })
                .catch(err => {
                  console.log(err);
                  res.redirect('admin/home');
                })
        })
        .catch(err => {
            console.log(err);
            res.redirect('admin/supervisorhome');
        })
}

// Alternate Wash Contorllers 
exports.handleSupervisorAlternateWash = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    AlternateSchema.findAll({ where: { supervisor_num: data.phone } })
        .then(response => {
            let fetchedOtp = JSON.stringify(response, null, 4);
            let extData = JSON.parse(fetchedOtp);

            AdministrationSchema.findAll(
                { where: { type: "3" } }
            )
                .then(response1 => {
                    let fetchedOtp1 = JSON.stringify(response1, null, 4);
                    let extData1 = JSON.parse(fetchedOtp1);
                    res.render('supervisor/supalternatewash', {
                        pageTitle: 'Supervisor Alternate Wash | YPERZ',
                        pageName: 'Alternate Wash | Administration Panel',
                        path: '/admin/supalternatewash',
                        alternateWash: extData,
                        cleaners: extData1,
                        data: data
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.render('supervisor/suphome', {
                        pageTitle: 'Supervisor Home | YPERZ',
                        pageName: 'Home | Administration Panel',
                        path: '/admin/supervisorhome',
                        data: data
                    });
                });

        })
        .catch(err => {
            console.log(err);
            res.render('supervisor/suphome', {
                pageTitle: 'Supervisor Home | YPERZ',
                pageName: 'Home | Administration Panel',
                path: '/admin/supervisorhome',
                data: data
            });
        });
}

exports.handleAlternateCleanerAssign = (req, res) => {
    let data = req.body;
    console.log(data);
    AlternateSchema.update(
        {
            cleaner_num: data.cleaner_phone,
            cleaner_name: data.cleaner_name
        },
        {
            where: {
                id: data.id,
                phone: data.phone
            }
        }
    )
        .then(response => {
            UserSchema.findAll({
                where: { phone: data.phone }
              })
                .then(response1 => {
                  let fetchedData = JSON.stringify(response1, null, 4);
                  let extData = JSON.parse(fetchedData);
                  let device = [];
                  device.push(extData[0].devices);
                  let message = {
                    app_id: ONE_SIGNAL_CONFIG.APP_ID,
                    contents: {
                      en: `${data.cleaner_name} has assigned you as cleaner to your alternate day wash service.`
                    },
                    included_segments: ["include_player_ids"],
                    include_player_ids: [extData[0].devices]
                  }
                
                  pushNotificationServices.SendNotifications(message, (error, results) => {
                    if (error) {
                      res.send(error);
                    }
                    console.log(results);
                    res.redirect('/admin/supalternatewash'); 
                  })
                })
                .catch(err => {
                  console.log(err);
                  res.redirect('admin/home');
                })
        })
        .catch(err => {
            console.log(err);
            res.redirect('admin/supervisorhome');
        })
}

// Dry Cleaning Contorllers
exports.handleSupervisorDryClean = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    DryCleaningSchema.findAll({ where: { supervisor_num: data.phone } })
        .then(response => {
            let fetchedOtp = JSON.stringify(response, null, 4);
            let extData = JSON.parse(fetchedOtp);

            AdministrationSchema.findAll(
                { where: { type: "3" } }
            )
                .then(response1 => {
                    let fetchedOtp1 = JSON.stringify(response1, null, 4);
                    let extData1 = JSON.parse(fetchedOtp1);
                    res.render('supervisor/supdryclean', {
                        pageTitle: 'Supervisor Dry Cleaning | YPERZ',
                        pageName: 'Dry Cleaning | Administration Panel',
                        path: '/admin/supdryclean',
                        dryClean: extData,
                        cleaners: extData1,
                        data: data
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.render('supervisor/suphome', {
                        pageTitle: 'Supervisor Home | YPERZ',
                        pageName: 'Home | Administration Panel',
                        path: '/admin/supervisorhome',
                        data: data
                    });
                });

        })
        .catch(err => {
            console.log(err);
            res.render('supervisor/suphome', {
                pageTitle: 'Admin Home | YPERZ',
                pageName: 'Home | Administration Panel',
                path: '/admin/supervisorhome',
                data: data
            });
        });
}

exports.handleDryCleanCleanerAssign = (req, res) => {
    let data = req.body;
    console.log(data);
    DryCleaningSchema.update(
        {
            cleaner_num: data.cleaner_phone,
            cleaner_name: data.cleaner_name
        },
        {
            where: {
                id: data.id,
                phone: data.phone
            }
        }
    )
        .then(response => {
            UserSchema.findAll({
                where: { phone: data.phone }
              })
                .then(response1 => {
                  let fetchedData = JSON.stringify(response1, null, 4);
                  let extData = JSON.parse(fetchedData);
                  let device = [];
                  device.push(extData[0].devices);
                  let message = {
                    app_id: ONE_SIGNAL_CONFIG.APP_ID,
                    contents: {
                      en: `${data.cleaner_name} has assigned you as cleaner to your dry cleaning service.`
                    },
                    included_segments: ["include_player_ids"],
                    include_player_ids: [extData[0].devices]
                  }
                
                  pushNotificationServices.SendNotifications(message, (error, results) => {
                    if (error) {
                      res.send(error);
                    }
                    console.log(results);
                    res.redirect('/admin/supdryclean'); 
                  })
                })
                .catch(err => {
                  console.log(err);
                  res.redirect('admin/home');
                })
            res.redirect('/admin/supdryclean');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/admin/supervisorhome');
        })
}

// Rubbing And Polishing Contorllers
exports.handleSupervisorRubPolish = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    RubPolishSchema.findAll({ where: { supervisor_num: data.phone } })
        .then(response => {
            let fetchedOtp = JSON.stringify(response, null, 4);
            let extData = JSON.parse(fetchedOtp);

            AdministrationSchema.findAll(
                { where: { type: "3" } }
            )
                .then(response1 => {
                    let fetchedOtp1 = JSON.stringify(response1, null, 4);
                    let extData1 = JSON.parse(fetchedOtp1);
                    res.render('supervisor/suprubpolish', {
                        pageTitle: 'Supervisor Rubbing and Polishing | YPERZ',
                        pageName: 'Rubbing and Polishing | Administration Panel',
                        path: '/admin/suprubpolish',
                        rubPolish: extData,
                        cleaners: extData1,
                        data: data
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.render('supervisor/suphome', {
                        pageTitle: 'Supervisor Home | YPERZ',
                        pageName: 'Home | Administration Panel',
                        path: '/admin/supervisorhome',
                        data: data
                    });
                });

        })
        .catch(err => {
            console.log(err);
            res.render('supervisor/suphome', {
                pageTitle: 'Admin Home | YPERZ',
                pageName: 'Home | Administration Panel',
                path: '/admin/supervisorhome',
                data: data
            });
        });
}

exports.handleRubPolishCleanerAssign = (req, res) => {
    let data = req.body;
    console.log(data);
    RubPolishSchema.update(
        {
            cleaner_num: data.cleaner_phone,
            cleaner_name: data.cleaner_name
        },
        {
            where: {
                id: data.id,
                phone: data.phone
            }
        }
    )
        .then(response => {
            UserSchema.findAll({
                where: { phone: data.phone }
              })
                .then(response1 => {
                  let fetchedData = JSON.stringify(response1, null, 4);
                  let extData = JSON.parse(fetchedData);
                  let device = [];
                  device.push(extData[0].devices);
                  let message = {
                    app_id: ONE_SIGNAL_CONFIG.APP_ID,
                    contents: {
                      en: `${data.cleaner_name} has assigned you as cleaner to your rubbing and polishing service.`
                    },
                    included_segments: ["include_player_ids"],
                    include_player_ids: [extData[0].devices]
                  }
                
                  pushNotificationServices.SendNotifications(message, (error, results) => {
                    if (error) {
                      res.send(error);
                    }
                    console.log(results);
                    res.redirect('/admin/suprubpolish'); 
                  })
                })
                .catch(err => {
                  console.log(err);
                  res.redirect('admin/home');
                })
        })
        .catch(err => {
            console.log(err);
            res.redirect('/admin/supervisorhome');
        })
}