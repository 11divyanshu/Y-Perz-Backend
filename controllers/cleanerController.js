const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const unirest = require('unirest');
const OtpStore = require('../models/userAuth');
const UserSchema = require('../models/userSchema');
const JwtSchema = require('../models/jwtSchema');
const EverydaySchema = require('../models/everydaySchema');
const AdministrationSchema = require('../models/administrationSchema');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SingleTimeServiceSchema = require('../models/singleTimeServiceSchema');
let LocalStorage = require('node-localstorage').LocalStorage;
if (typeof localStorage === "undefined" || localStorage === null) {
    localStorage = new LocalStorage('./scratch');
}
require('dotenv').config();

exports.handleCleanerRegister = (req, res) => { 
    res.render('admin/cleanerRegister', {
        pageTitle: 'Cleaner Register | Y PEREZ',
        path: '/admin/cleanerregister',
        confirmation: '202',
        otp: 0
    });
}

exports.handlePostCleanerOtpSend = (req, res) => {
    let data = req.body;
    let lastPhone = data.cleaner_phone.slice(6);
    AdministrationSchema.findAll({
        where: {
            phone: req.body.cleaner_phone
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
                    numbers: data.cleaner_phone,
                });
                req.end(function (resVar) {
                    if (res.error) throw new Error(res.error);
                    var resData = {
                        userMobNum: data.phone,
                        otp: len,
                    };
                    OtpStore.findAll({ where: { phone: data.cleaner_phone } })
                        .then((otpres) => {
                            let fetchedOtp1 = JSON.stringify(otpres, null, 4);
                            let extData1 = JSON.parse(fetchedOtp1);
                            if (extData1.length > 0) {
                                OtpStore.update(
                                    {
                                        otp: len
                                    },
                                    {
                                        where: { phone: data.cleaner_phone }
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
                                            userPhone: data.cleaner_phone,
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
                                    phone: data.cleaner_phone,
                                    otp: len
                                }).then((dbres) => {
                                    console.log("Otp Store Updated");
                                    res.status(202);
                                    res.render('admin/otp', {
                                        pageTitle: 'Supervisor OTP Verification | Y PEREZ',
                                        path: '/supervisor/otpverification',
                                        confirmation: '202',
                                        otp: 1,
                                        userPhone: data.cleaner_phone,
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
            bcrypt.hash(data.cleaner_pass, 12).then(hash => {
                AdministrationSchema.create({
                    fName: data.cleaner_name,
                    email: data.cleaner_email,
                    phone: data.cleaner_phone,
                    password: hash,
                    location: data.cleaner_location,
                    desc: data.cleaner_desc,
                    profilepic: "",
                    type: "3",
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
                        numbers: data.cleaner_phone,
                    });
                    req.end(function (resVar) {
                        if (res.error) throw new Error(res.error);
                        var resData = {
                            userMobNum: data.cleaner_phone,
                            otp: len,
                        };
                        OtpStore.findAll({ where: { phone: data.cleaner_phone } })
                            .then((otpres) => {
                                let fetchedOtp1 = JSON.stringify(otpres, null, 4);
                                let extData1 = JSON.parse(fetchedOtp1);
                                if (extData1.length > 0) {
                                    OtpStore.update(
                                        {
                                            otp: len
                                        },
                                        {
                                            where: { phone: data.cleaner_phone }
                                        }
                                    )
                                        .then((response2) => {
                                            console.log("Otp Store Updated");
                                            res.status(202);
                                            res.render('admin/otp', {
                                                pageTitle: 'Cleaner OTP Verification | Y PEREZ',
                                                path: '/cleaner/otpverification',
                                                confirmation: '202',
                                                otp: 1,
                                                userPhone: data.cleaner_phone,
                                                lastDigit: lastPhone
                                            });
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            res.status(205);
                                            res.render('admin/cleanerRegister', {
                                                pageTitle: 'Cleaner Register | Y PEREZ',
                                                path: '/admin/cleanerregister',
                                                confirmation: '205',
                                                otp: 0
                                            });
                                        })
                                } else {

                                    OtpStore.create({
                                        phone: data.cleaner_phone,
                                        otp: len
                                    }).then((dbres) => {
                                        console.log("Otp Store Updated");
                                        res.status(202);
                                        res.render('admin/otp', {
                                            pageTitle: 'Cleaner OTP Verification | Y PEREZ',
                                            path: '/cleaner/otpverification',
                                            confirmation: '202',
                                            otp: 1,
                                            userPhone: data.cleaner_phone,
                                            lastDigit: lastPhone
                                        });
                                    }).catch(err => {
                                        console.log(err);
                                        res.status(205);
                                        res.render('admin/cleanerRegister', {
                                            pageTitle: 'Cleaner Register | Y PEREZ',
                                            path: '/admin/cleanerregister',
                                            confirmation: '205',
                                            otp: 0
                                        });
                                    })
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(205);
                                res.render('admin/cleanerRegister', {
                                    pageTitle: 'Cleaner Register | Y PEREZ',
                                    path: '/admin/cleanerregister',
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


exports.handlePostCleanerRegister = (req, res) => {
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
                                    res.render('admin/supervisorRegister', {
                                        pageTitle: 'Supervisor Register | Y PEREZ',
                                        path: '/supervisor/register',
                                        confirmation: '202',
                                        otp: 1,
                                    });
                                }).catch(err => {
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
                    console.log("Failed");
                    res.status(205);
                    res.render('admin/otp', {
                        pageTitle: 'Supervisor OTP Verification | Y PEREZ',
                        path: '/supervisor/otpverification',
                        confirmation: '205',
                        otp: -1,
                        userPhone: userPhone,
                        lastDigit: lastDigit
                    });
                }
            } else {
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
            }
        }).catch(err => {
            console.log("Failed");
            res.status(205);
            res.render('admin/otp', {
                pageTitle: 'Supervisor OTP Verification | Y PEREZ',
                path: '/supervisor/otpverification',
                confirmation: '205',
                otp: 0
            });
        })
}
