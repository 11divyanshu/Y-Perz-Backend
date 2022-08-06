const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const unirest = require('unirest');
const OtpStore = require('../models/userAuth');
const EverydaySchema = require('../models/everydaySchema');
const AdministrationSchema = require('../models/administrationSchema');
const multer = require('multer');
const SingleTimeServiceSchema = require('../models/singleTimeServiceSchema');
const WeeklySchema = require('../models/weeklySchema');
const DryCleaningSchema = require('../models/dryCleaningSchema');
const RubPolishSchema = require('../models/rubAndPolishSchema');
const AlternateSchema = require('../models/alternateSchema');
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

exports.checkAdministration = (req, res, next) => {
    let data = JSON.parse(localStorage.getItem('data'));
    if (data === null) {
        res.redirect('/admin/login');
    } else {
        return next();
    }
}

// Cleaner Home
exports.handleCleanerHome = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    res.status(202);
    res.render('cleaner/cleanerhome', {
        pageTitle: 'Cleaner Home | Y PEREZ',
        path: '/admin/cleanerhome',
        pageName: 'Home | Administration Panel',
        confirmation: '202',
        data: data
    });
}

// Cleaner One Time Wash
exports.handleCleanerOneTimeWash = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    SingleTimeServiceSchema.findAll(
        {
            where: {
                cleaner_num : data.phone
            }
        }
    )
    .then(response => {
        let fetchedOtp = JSON.stringify(response, null, 4);
        let extData = JSON.parse(fetchedOtp);

        AdministrationSchema.findAll(
            { where: { type: "2" } }
        )
            .then(response1 => {
                let fetchedOtp1 = JSON.stringify(response1, null, 4);
                let extData1 = JSON.parse(fetchedOtp1);
                res.render('cleaner/cleaneronetimewash', {
                    pageTitle: 'Cleaner One Time Wash | YPERZ',
                    pageName: 'One Time Wash | Administration Panel',
                    path: '/admin/cleaneronetimewash',
                    onetimeWash: extData,
                    supervisors: extData1,
                    data: data
                });
            })
            .catch(err => {
                console.log(err);
                res.render('cleaner/cleanerhome', {
                    pageTitle: 'Cleaner Home | YPERZ',
                    pageName: 'Home | Administration Panel',
                    path: '/admin/cleanerhome',
                    data: data
                });
            });

    })
    .catch(err => {
        console.log(err);
        res.render('cleaner/cleanerhome', {
            pageTitle: 'Cleaner Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/cleanerhome',
            data: data
        });
    });
}

exports.handleOneTimeCleanerComplete = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    SingleTimeServiceSchema.update(
        {
            status: 1
        },
        {
            where: {
                id: req.body.id,
                phone: req.body.phone
            }
        }
    )
    .then(response => {
        res.status(202);
        res.redirect('/admin/cleaneronetimewash');
    }).catch(err => {
        console.log(err);
        res.redirect('/admin/cleanerhome');
    });
}

// Cleaner Everyday Wash
exports.handleCleanerEverydayWash = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    EverydaySchema.findAll(
        {
            where: {
                cleaner_num : data.phone
            }
        }
    )
    .then(response => {
        let fetchedOtp = JSON.stringify(response, null, 4);
        let extData = JSON.parse(fetchedOtp);

        AdministrationSchema.findAll(
            { where: { type: "2" } }
        )
            .then(response1 => {
                let fetchedOtp1 = JSON.stringify(response1, null, 4);
                let extData1 = JSON.parse(fetchedOtp1);
                res.render('cleaner/cleanereverydaywash', {
                    pageTitle: 'Cleaner Everyday Wash | YPERZ',
                    pageName: 'Everyday Wash | Administration Panel',
                    path: '/admin/cleanereverydaywash',
                    everydayWash: extData,
                    supervisors: extData1,
                    data: data
                });
            })
            .catch(err => {
                console.log(err);
                res.render('cleaner/cleanerhome', {
                    pageTitle: 'Cleaner Home | YPERZ',
                    pageName: 'Home | Administration Panel',
                    path: '/admin/cleanerhome',
                    data: data
                });
            });

    })
    .catch(err => {
        console.log(err);
        res.render('cleaner/cleanerhome', {
            pageTitle: 'Cleaner Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/cleanerhome',
            data: data
        });
    });
}

exports.handleEverydayCleanerComplete = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    EverydaySchema.update(
        {
            status: 1
        },
        {
            where: {
                id: req.body.id,
                phone: req.body.phone
            }
        }
    )
    .then(response => {
        res.status(202);
        res.redirect('/admin/cleanereverydaywash');
    }).catch(err => {
        console.log(err);
        res.redirect('/admin/cleanerhome');
    });
}

// Cleaner Weekly Wash
exports.handleCleanerWeeklyWash = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    WeeklySchema.findAll(
        {
            where: {
                cleaner_num : data.phone
            }
        }
    )
    .then(response => {
        let fetchedOtp = JSON.stringify(response, null, 4);
        let extData = JSON.parse(fetchedOtp);

        AdministrationSchema.findAll(
            { where: { type: "2" } }
        )
            .then(response1 => {
                let fetchedOtp1 = JSON.stringify(response1, null, 4);
                let extData1 = JSON.parse(fetchedOtp1);
                res.render('cleaner/cleanerweeklywash', {
                    pageTitle: 'Cleaner Weekly Wash | YPERZ',
                    pageName: 'Weekly Wash | Administration Panel',
                    path: '/admin/cleanerweeklywash',
                    weeklyWash: extData,
                    supervisors: extData1,
                    data: data
                });
            })
            .catch(err => {
                console.log(err);
                res.render('cleaner/cleanerhome', {
                    pageTitle: 'Cleaner Home | YPERZ',
                    pageName: 'Home | Administration Panel',
                    path: '/admin/cleanerhome',
                    data: data
                });
            });

    })
    .catch(err => {
        console.log(err);
        res.render('cleaner/cleanerhome', {
            pageTitle: 'Cleaner Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/cleanerhome',
            data: data
        });
    });
}

exports.handleWeeklyCleanerComplete = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    WeeklySchema.update(
        {
            status: 1
        },
        {
            where: {
                id: req.body.id,
                phone: req.body.phone
            }
        }
    )
    .then(response => {
        res.status(202);
        res.redirect('/admin/cleanereverydaywash');
    }).catch(err => {
        console.log(err);
        res.redirect('/admin/cleanerhome');
    });
}

// Cleaner Alternate Wash
exports.handleCleanerAlternateWash = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    AlternateSchema.findAll(
        {
            where: {
                cleaner_num : data.phone
            }
        }
    )
    .then(response => {
        let fetchedOtp = JSON.stringify(response, null, 4);
        let extData = JSON.parse(fetchedOtp);

        AdministrationSchema.findAll(
            { where: { type: "2" } }
        )
            .then(response1 => {
                let fetchedOtp1 = JSON.stringify(response1, null, 4);
                let extData1 = JSON.parse(fetchedOtp1);
                res.render('cleaner/cleaneralternatewash', {
                    pageTitle: 'Cleaner Alternate Wash | YPERZ',
                    pageName: 'Alternate Wash | Administration Panel',
                    path: '/admin/cleaneralternatewash',
                    weeklyWash: extData,
                    supervisors: extData1,
                    data: data
                });
            })
            .catch(err => {
                console.log(err);
                res.render('cleaner/cleanerhome', {
                    pageTitle: 'Cleaner Home | YPERZ',
                    pageName: 'Home | Administration Panel',
                    path: '/admin/cleanerhome',
                    data: data
                });
            });

    })
    .catch(err => {
        console.log(err);
        res.render('cleaner/cleanerhome', {
            pageTitle: 'Cleaner Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/cleanerhome',
            data: data
        });
    });
}

exports.handleAlternateCleanerComplete = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    AlternateSchema.update(
        {
            status: 1
        },
        {
            where: {
                id: req.body.id,
                phone: req.body.phone
            }
        }
    )
    .then(response => {
        res.status(202);
        res.redirect('/admin/cleaneralternatewash');
    }).catch(err => {
        console.log(err);
        res.redirect('/admin/cleanerhome');
    });
}

// Cleaner Dry Cleaning
exports.handleCleanerDryClean = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    DryCleaningSchema.findAll(
        {
            where: {
                cleaner_num : data.phone
            }
        }
    )
    .then(response => {
        let fetchedOtp = JSON.stringify(response, null, 4);
        let extData = JSON.parse(fetchedOtp);

        AdministrationSchema.findAll(
            { where: { type: "2" } }
        )
            .then(response1 => {
                let fetchedOtp1 = JSON.stringify(response1, null, 4);
                let extData1 = JSON.parse(fetchedOtp1);
                res.render('cleaner/cleanerdryclean', {
                    pageTitle: 'Cleaner Dry Cleaning | YPERZ',
                    pageName: 'Dry Cleaning | Administration Panel',
                    path: '/admin/cleanerdryclean',
                    dryClean: extData,
                    supervisors: extData1,
                    data: data
                });
            })
            .catch(err => {
                console.log(err);
                res.render('cleaner/cleanerhome', {
                    pageTitle: 'Cleaner Home | YPERZ',
                    pageName: 'Home | Administration Panel',
                    path: '/admin/cleanerhome',
                    data: data
                });
            });

    })
    .catch(err => {
        console.log(err);
        res.render('cleaner/cleanerhome', {
            pageTitle: 'Cleaner Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/cleanerhome',
            data: data
        });
    });
}

exports.handleDryCleanCleanerComplete = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    DryCleaningSchema.update(
        {
            status: 1
        },
        {
            where: {
                id: req.body.id,
                phone: req.body.phone
            }
        }
    )
    .then(response => {
        res.status(202);
        res.redirect('/admin/cleanerdryclean');
    }).catch(err => {
        console.log(err);
        res.redirect('/admin/cleanerhome');
    });
}

// Cleaner Rubbing And Polishing
exports.handleCleanerRubPolish = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    RubPolishSchema.findAll(
        {
            where: {
                cleaner_num : data.phone
            }
        }
    )
    .then(response => {
        let fetchedOtp = JSON.stringify(response, null, 4);
        let extData = JSON.parse(fetchedOtp);

        AdministrationSchema.findAll(
            { where: { type: "2" } }
        )
            .then(response1 => {
                let fetchedOtp1 = JSON.stringify(response1, null, 4);
                let extData1 = JSON.parse(fetchedOtp1);
                res.render('cleaner/cleanerrubpolish', {
                    pageTitle: 'Cleaner Rubbing And Polishing | YPERZ',
                    pageName: 'Rubbing And Polishing | Administration Panel',
                    path: '/admin/cleanerrubpolish',
                    rubPolish: extData,
                    supervisors: extData1,
                    data: data
                });
            })
            .catch(err => {
                console.log(err);
                res.render('cleaner/cleanerhome', {
                    pageTitle: 'Cleaner Home | YPERZ',
                    pageName: 'Home | Administration Panel',
                    path: '/admin/cleanerhome',
                    data: data
                });
            });

    })
    .catch(err => {
        console.log(err);
        res.render('cleaner/cleanerhome', {
            pageTitle: 'Cleaner Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/cleanerhome',
            data: data
        });
    });
}

exports.handleRubPolishCleanerComplete = (req, res) => {
    let data = JSON.parse(localStorage.getItem('data'));
    RubPolishSchema.update(
        {
            status: 1
        },
        {
            where: {
                id: req.body.id,
                phone: req.body.phone
            }
        }
    )
    .then(response => {
        res.status(202);
        res.redirect('/admin/cleanerrubpolish');
    }).catch(err => {
        console.log(err);
        res.redirect('/admin/cleanerhome');
    });
}