const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const unirest = require('unirest');
const OtpStore = require('../models/userAuth');
const UserSchema = require('../models/userSchema');
const JwtSchema = require('../models/jwtSchema');
const multer = require('multer');
const path = require('path');
const fs = require('fs')
require('dotenv').config();

// Login OTP Method
// Success - 202
// User Not Found - 203
// Error - 205
exports.handleUserLoginOTP = (req, res) => {
    let data = req.body;
    UserSchema.findAll({ attribute: { phone: data.phone } })
        .then(checkUserRes => {
            let fetchedOtp1 = JSON.stringify(checkUserRes, null, 4);
            let extData1 = JSON.parse(fetchedOtp1);
            if (extData1.length > 0) {
                // Generating OTP
                let otpVal = Math.floor(Math.random() * 10000) + 1001;
                let len = otpVal.toString();
                if (len.length > 4) {
                    otpVal = otpVal / 10;
                }
                len = otpVal.toString();
                var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
                // Setting OTP req headers
                req.headers({
                    authorization:
                        "hVKQnXXGfvK5iOl1sG5wwfWepO9X8igDjI9GmwZXL1aT9Ef7lZkVqQB5zPmm",
                });
                // Setting OTP req data
                req.form({
                    variables_values: len,
                    route: "otp",
                    numbers: data.phone,
                });
                // Making OTP req
                req.end(function (resVar) {
                    if (res.error) throw new Error(res.error);
                    var resData = {
                        userMobNum: data.phone,
                        otp: len,
                    };
                    OtpStore.findAll({ attribute: { phone: data.phone } })
                        .then((otpres) => {
                            let fetchedOtp1 = JSON.stringify(otpres, null, 4);
                            let extData1 = JSON.parse(fetchedOtp1);
                            if (extData1.length > 0) {
                                OtpStore.update(
                                    {
                                        otp: len
                                    },
                                    {
                                        where: { phone: data.phone }
                                    }
                                )
                                    .then((response2) => {
                                        res.status(202);
                                        res.json({
                                            msg: "Otp Stored Successfully",
                                            key: 0
                                        })
                                    })
                                    .catch(err => {
                                        res.status(205);
                                        res.json({
                                            msg: "Fatal Error Occured",
                                            key: 0
                                        })
                                        console.log(err);
                                    })
                            } else {
                                OtpStore.create({
                                    phone: data.phone,
                                    otp: len
                                }).then((dbres) => {
                                    console.log("Otp Stored Successfully");
                                    res.status(202);
                                    res.json({
                                        msg: "Otp Stored Successfully",
                                        key: 0
                                    })
                                }).catch(err => {
                                    res.status(205);
                                    res.json({
                                        msg: "Fatal Error Occured",
                                        key: 0
                                    })
                                    console.log(err);
                                })
                            }
                        })
                        .catch(err => {
                            res.status(205);
                            res.json({
                                msg: "Fatal Error Occured",
                                key: 0
                            })
                            console.log(err);
                        })

                })
            } else {
                res.status(203);
                res.json({
                    msg: "User does not exists please register",
                    key: 1
                });
            }
        }).catch(err => {
            res.status(205);
            res.json({
                msg: "Fatal Error Occured",
                key: 0
            })
            console.log(err);
        })
};

// Login Method
// Success - 202 , JWT
// Incorrect Otp - 203
// Error - 205
exports.handleUserLogin = (req, res) => {
    let data = req.body;
    // Verifying OTP
    OtpStore.findAll({ attribute: [{ phone: data.phone }] })
        .then(response => {
            // Convertin data in form of JSON
            let fetchedOtp = JSON.stringify(response, null, 4);
            console.log(fetchedOtp)
            // JSON - Object
            let extData = JSON.parse(fetchedOtp);
            if (extData[0].otp == data.otp) {
                // Correct OTP
                // Creating User in DB
                // Encrypting password
                console.log("Correct OTP");
                OtpStore.destroy({ where: { phone: data.phone } })
                    .then(() => {
                        jwt.sign({ user: data }, 'secretkey', (err, token) => {
                            // Status 202 - Correct password
                            JwtSchema.create({
                                phone: data.phone,
                                jwt: token
                            })
                                .then((response2) => {
                                    res.status(202);
                                    res.json({
                                        token: token,
                                        msg: "User Logged In Successfully",
                                        key: 1
                                    });
                                })
                                .catch(err => {
                                    res.status(205);
                                    res.json({
                                        msg: "Fatal Error Occured",
                                        key: 0
                                    });
                                })
                        });
                    })
                    .catch(err => {
                        res.status(205);
                        res.json({
                            msg: "Fatal Error Occured",
                            key: 0
                        });
                    });
            } else {
                // Incorrect OTP
                res.status(204);
                res.json({
                    msg: "Incorrect Otp",
                    key: 1
                });
            }
        }).catch(err => {
            res.status(205);
            res.json({
                msg: "Fatal Error Occured",
                key: 0
            });
        })
};

// Check Logged in user method
// Success 
// if user found -> 202
// if user not found -> 203
// Error -> 205
exports.handleCheckUser = (req, res) => {
    let data = req.body;
    JwtSchema.findOne({
        where: { phone: data.phone },
    }).then(jwtRes => {
        if (jwtRes) {
            let fetchedOtp1 = JSON.stringify(jwtRes, null, 4);
            let extData1 = JSON.parse(fetchedOtp1);
            if (extData1) {
                let tkn = extData1.jwt;
                UserSchema
                    .findOne({
                        where: { phone: data.phone },
                    })
                    .then(userRes => {
                        let fetchedData = JSON.stringify(userRes, null, 4);
                        let extData2 = JSON.parse(fetchedData);
                        let resDataSet = extData2;
                        resDataSet.token = tkn;
                        res.status(202);
                        res.json({
                            key: 1,
                            data: resDataSet,
                            msg: "User Found"
                        })
                    })
            } else {
                res.status(203)
                res.json({
                    key: "0",
                    data: "User not found"
                });
            }
        } else {
            res.status(203)
            res.json({
                key: "0",
                data: "User not found"
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(205)
        res.json({
            key: "0",
            data: "Error Happened"
        });
    })
}

// User Logout Method
// Success - 202
// Error - 205
exports.handleUserLogout = (req, res) => {
    let data = req.body;
    JwtSchema.findOne({
        where: { phone: data.phone },
    }).then(jwtRes => {
        let fetchedOtp1 = JSON.stringify(jwtRes, null, 4);
        let extData1 = JSON.parse(fetchedOtp1);
        if (jwtRes) {
            JwtSchema.destroy({
                where: { phone: data.phone },
            }).then(() => {
                res.status(202);
                res.json({
                    key: 1,
                    message: "User Loggeed Out Successfully"
                });
            }).catch((err) => {
                console.log(err);
                res.status(205);
                res.json({
                    key: 0,
                    message: "Unexpected error occured"
                });
            });
        } else {
            res.status(205);
            res.json({
                key: 0,
                message: "Unexpected error occured"
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(205);
        res.json({
            key: 0,
            message: "Unexpected error occured"
        });
    })
}

// Register OTP Method
// Success - 202
// Error - 205
exports.handleUserRegisterOTP = (req, res) => {
    // Fetching user register request data
    let data = req.body;
    // Generating OTP
    let otpVal = Math.floor(Math.random() * 10000) + 1001;
    let len = otpVal.toString();
    if (len.length > 4) {
        otpVal = otpVal / 10;
    }
    len = otpVal.toString();
    var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
    // Setting OTP req headers
    req.headers({
        authorization:
            "hVKQnXXGfvK5iOl1sG5wwfWepO9X8igDjI9GmwZXL1aT9Ef7lZkVqQB5zPmm",
    });
    // Setting OTP req data
    req.form({
        variables_values: len,
        route: "otp",
        numbers: data.phone,
    });
    // Making OTP req
    req.end(function (resVar) {
        if (res.error) throw new Error(res.error);
        var resData = {
            userMobNum: data.phone,
            otp: len,
        };
        OtpStore.findAll({ attribute: { phone: data.phone } })
            .then((otpres) => {
                let fetchedOtp1 = JSON.stringify(otpres, null, 4);
                let extData1 = JSON.parse(fetchedOtp1);
                if (extData1.length > 0) {
                    OtpStore.update(
                        {
                            otp: len
                        },
                        {
                            where: { phone: data.phone }
                        }
                    )
                        .then((response2) => {
                            res.status(202);
                            res.json({
                                msg: "Otp Stored Successfully",
                                key: 0
                            })
                        })
                        .catch(err => {
                            res.status(205);
                            res.json({
                                msg: "Fatal Error Occured",
                                key: 0
                            })
                            console.log(err);
                        })
                } else {
                    OtpStore.create({
                        phone: data.phone,
                        otp: len
                    }).then((dbres) => {
                        console.log("Otp Stored Successfully");
                        res.status(202);
                        res.json({
                            msg: "Otp Stored Successfully",
                            key: 0
                        })
                    }).catch(err => {
                        res.status(205);
                        res.json({
                            msg: "Fatal Error Occured",
                            key: 0
                        })
                        console.log(err);
                    })
                }
            })
            .catch(err => {
                res.status(205);
                res.json({
                    msg: "Fatal Error Occured",
                    key: 0
                })
                console.log(err);
            })

    })
};

// OTP Verification , Deletion , User Create ,  JWT Work
// Success - 202
// User Already Exists - 203
// Incorrect Otp - 204
// Error - 205
exports.handleOtpCheckRegister = (req, res) => {
    // Fetching user register request data
    let data = req.body;
    // Verifying OTP
    OtpStore.findAll({ attribute: [{ phone: data.phone }] })
        .then(response => {
            // Convertin data in form of JSON
            let fetchedOtp = JSON.stringify(response, null, 4);
            console.log(fetchedOtp)
            // JSON - Object
            let extData = JSON.parse(fetchedOtp);
            if (extData[0].otp == data.otp) {
                // Correct OTP
                // Creating User in DB
                // Encrypting password
                console.log("Correct OTP");
                OtpStore.destroy({ where: { phone: data.phone } })
                    .then(() => {
                        console.log("Deleted OTP");
                        console.log("User Data : " + data);
                        UserSchema.findAll({ attribute: { phone: data.phone } })
                            .then(checkUserRes => {
                                let fetchedOtp1 = JSON.stringify(checkUserRes, null, 4);
                                let extData1 = JSON.parse(fetchedOtp1);
                                if (extData1.length > 0) {
                                    res.status(203);
                                    res.json({
                                        msg: "User already exists please login",
                                        key: 1
                                    });
                                } else {
                                    UserSchema.create({
                                        fName: "",
                                        email: "",
                                        phone: data.phone,
                                        location: "",
                                        desc: "",
                                        profilepic: ""
                                    }).then((dbres) => {
                                        jwt.sign({ user: data }, 'secretkey', (err, token) => {
                                            // Status 202 - Correct password
                                            JwtSchema.create({
                                                phone: data.phone,
                                                jwt: token
                                            })
                                                .then((response2) => {
                                                    res.status(202);
                                                    res.json({
                                                        token: token,
                                                        msg: "User Created Successfully",
                                                        key: 1
                                                    });
                                                })
                                                .catch(err => {
                                                    res.status(205);
                                                    res.json({
                                                        msg: "Fatal Error Occured",
                                                        key: 0
                                                    });
                                                })
                                        });
                                    }).catch(err => {
                                        res.status(205);
                                        res.json({
                                            msg: "Fatal Error Occured",
                                            key: 0
                                        });
                                    });
                                }
                            })
                            .catch(err => {
                                res.status(205);
                                res.json({
                                    msg: "Fatal Error Occured",
                                    key: 0
                                });
                            })
                    })
                    .catch(err => {
                        res.status(205);
                        res.json({
                            msg: "Fatal Error Occured",
                            key: 0
                        });
                    });
            } else {
                // Incorrect OTP
                res.status(204);
                res.json({
                    msg: "Incorrect Otp",
                    key: 1
                });
            }
        }).catch(err => {
            res.status(205);
            res.json({
                msg: "Fatal Error Occured",
                key: 0
            });
        })
};

// Resend OTP Method
// Success - 202
// Error - 205
exports.handleOtpResend = (req, res) => {
    // Fetching user register request data
    let data = req.body;
    // Generating OTP
    let otpVal = Math.floor(Math.random() * 10000) + 1001;
    let len = otpVal.toString();
    if (len.length > 4) {
        otpVal = otpVal / 10;
    }
    len = otpVal.toString();
    var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
    // Setting OTP req headers
    req.headers({
        authorization:
            process.env.SMS_API_KEY,
    });
    // Setting OTP req data
    req.form({
        variables_values: len,
        route: "otp",
        numbers: data.phone,
    });
    // Making OTP req
    req.end(function (resVar) {
        if (res.error) throw new Error(res.error);
        var resData = {
            userMobNum: data.phone,
            otp: len,
        };
        OtpStore.findAll({ attribute: { phone: data.phone } })
            .then((otpres) => {
                let fetchedOtp1 = JSON.stringify(otpres, null, 4);
                let extData1 = JSON.parse(fetchedOtp1);
                if (extData1.length > 0) {
                    OtpStore.update(
                        {
                            otp: len
                        },
                        {
                            where: { phone: data.phone }
                        }
                    )
                        .then((response2) => {
                            res.status(202);
                            res.json({
                                msg: "Otp Stored Successfully",
                                key: 0
                            })
                        })
                        .catch(err => {
                            res.status(205);
                            res.json({
                                msg: "Fatal Error Occured",
                                key: 0
                            })
                            console.log(err);
                        })
                } else {
                    OtpStore.create({
                        phone: data.phone,
                        otp: len
                    }).then((dbres) => {
                        console.log("Otp Stored Successfully");
                        res.status(202);
                        res.json({
                            msg: "Otp Stored Successfully",
                            key: 0
                        })
                    }).catch(err => {
                        res.status(205);
                        res.json({
                            msg: "Fatal Error Occured",
                            key: 0
                        })
                        console.log(err);
                    })
                }
            })
            .catch(err => {
                res.status(205);
                res.json({
                    msg: "Fatal Error Occured",
                    key: 0
                })
                console.log(err);
            })

    })
}

// User profile update method
// Success - 202
// Error - 205
exports.userProfileUpdate = (req, res) => {
    let data = req.body;
    UserSchema.update(
        {
            fName: data.fName,
            email: data.email,
            location: data.location,
            desc: data.desc,
        },
        {
            where: { phone: data.phone }
        }
    ).then(response => {
        res.status(202);
        res.json({
            msg: "User Profile Updated Successfully",
            key: 1
        })
    }).catch(err => {
        res.status(205);
        res.json({
            msg: "Fatal Error Occured",
            key: 0
        })
    })
}

// User Profile Picture Update Method
// Success - 202
// Error - 205
exports.userProfilePicUpdate = (req, res) => {
    UserSchema.findAll({ attribute: { phone: data.phone } })
        .then(response => {
            let fetchedOtp1 = JSON.stringify(checkUserRes, null, 4);
            let extData1 = JSON.parse(fetchedOtp1);
            if (extData1.profilepic.length > 0) {
                fs.unlink(`Images/Profile/${req.body.fileName}`, (err) => {
                    if (err) {
                        res.status(205);
                        res.json({
                            msg: "Fatal Error Occured",
                            key: 0
                        })
                    }
                    UserSchema.update(
                        {
                            profilepic: req.file.path
                        },
                        {
                            where: { phone: data.phone }
                        }
                    ).then(response => {
                        res.status(202);
                        res.json({
                            msg: "User Profile Picture Updated Successfully",
                            key: 1
                        })
                    }).catch(err => {
                        res.status(205);
                        res.json({
                            msg: "Fatal Error Occured",
                            key: 0
                        })
                    })
                  })
            } else {
                UserSchema.update(
                    {
                        profilepic: req.file.path
                    },
                    {
                        where: { phone: data.phone }
                    }
                ).then(response => {
                    res.status(202);
                    res.json({
                        msg: "User Profile Picture Updated Successfully",
                        key: 1
                    })
                }).catch(err => {
                    res.status(205);
                    res.json({
                        msg: "Fatal Error Occured",
                        key: 0
                    })
                })
            }
        }).catch(err => {
            res.status(205);
            res.json({
                msg: "Fatal Error Occured",
                key: 0
            })
        })
}

// User Profile Pic Remove
// Success - 202
// Error - 205
exports.userProfilePicRemove = (req,res) => {
    let data = req.body;
    fs.unlink(`Images/Profile/${req.body.fileName}`, (err) => {
        if (err) {
            console.log(err);
            res.status(205);
            res.json({
                msg: "Fatal Error Occured",
                key: 0
            })
        }
        UserSchema.update(
            {
                profilepic: ""
            },
            {
                where: { phone: data.phone }
            }
        ).then(response => {
            res.status(202);
            res.json({
                msg: "User Profile Picture Removed Successfully",
                key: 1
            })
        }).catch(err => {
            res.status(205);
            res.json({
                msg: "Fatal Error Occured",
                key: 0
            })
        })
    })
}

// Multer image handeling method
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images/Profile')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

exports.uploadProfilePic = multer({
    storage: storage,
    limits: { fileSize: '5000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jgp|png|gif/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))
        if (mimeType && extname) {
            return cb(null, true)
        } else {
            return ("Give proper file format to upload");
        }
    }
}).single('icon');