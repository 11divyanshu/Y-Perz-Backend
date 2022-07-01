const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const unirest = require('unirest');
const OtpStore = require('../models/userAuth');
const UserSchema = require('../models/userSchema');
const JwtSchema = require('../models/jwtSchema');
require('dotenv').config(); 

// Login Method
exports.handleUserLogin = (req, res) => {
    // Fetching user login email and password
    let data = req.body;
    UserSchema.findAll({attribute : {email:data.email}})
    .then((response) => {
        let fetchedOtp = JSON.stringify(response, null, 4);
        let extData = JSON.parse(fetchedOtp);
        bcrypt.compare(data.password,extData[0].password, (err,response) => {
            if(response){
                JwtSchema.findAll({attribute : {email : data.email}})
                .then((jwtRes) => {
                    let fetchedOtp1 = JSON.stringify(jwtRes, null, 4);
                    let extData1 = JSON.parse(fetchedOtp1);
                    if(extData1.length > 0){
                        jwt.sign({user:data},'secretkey',(err,token) =>{
                            // Status 202 - Correct password
                            JwtSchema.update(
                                {
                                    jwt : token
                                },
                                {
                                    where : { email : data.email }
                                }
                            )
                            .then((response2) => {
                                res.status(202);
                                res.json({
                                    token
                                });
                            })
                            .catch(err => {
                                console.log(err);
                            })
                        })
                    }else{
                        jwt.sign({user:data},'secretkey',(err,token) =>{
                            // Status 202 - Correct password
                            JwtSchema.create({
                                email : data.email,
                                jwt : token
                            })
                            .then((response2) => {
                                res.status(202);
                                res.json({
                                    token
                                });
                            })
                            .catch(err => {
                                console.log(err);
                            })
                        })
                    }
                })
                .catch(err => {

                })
                
            }else{
                // Status 204 - incorrect password
                console.log("CHECK LOGIN FUNCTION");
                res.status(204)
                res.send("Incorrect Password");
            }
        })
        
    })
};

// User Logout Method
exports.handleUserLogout = (req,res) => {
    let data = req.body;
    JwtSchema.findOne({
        where: { email: data.email },  
    }).then(jwtRes => {
        if (jwtRes) {
            jwtRes.destroy().then(() => {
                res.status(202);
                res.send("User Loggeed Out Successfully");
            }).catch((err) => {
                console.log(err);
            });
        }
    }).catch(err => {
        console.log(err);
    })
}

// Register OTP Method
exports.handleUserRegisterOTP = (req, res) => {
    // Fetching user register request data
    let data = req.body;
    // Generating OTP
    let otpVal = Math.floor(Math.random() * 10000) + 1001;
    let len = otpVal.toString();
    if (len.length > 4) {
        otpVal = otpVal % 10;
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
        OtpStore.findAll({attribute : {email : data.email}})
        .then((otpres) => {
            let fetchedOtp1 = JSON.stringify(otpres, null, 4);
            let extData1 = JSON.parse(fetchedOtp1);
            if(extData1.length > 0){
                OtpStore.update(
                    {
                        otp : len
                    },
                    {
                        where : { email : data.email }
                    }
                )
                .then((response2) => {
                    res.status(202);
                    res.send(resData);
                })
                .catch(err => {
                    console.log(err);
                })
            }else{   
                OtpStore.create({
                    email: data.email,
                    phone: data.phone,
                    otp: len
                }).then((dbres) => {
                    console.log("Otp Stored Successfully");
                    res.status(202);
                    res.send(dbres);
                }).catch(err => {
                    console.log(err);
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
        
    })
};

// OTP Verification , Deletion , User Create ,  JWT Work
exports.handleOtpCheckRegister = (req,res) => {
    // Fetching user register request data
    let data = req.body;
    console.log(data.email);
    // Verifying OTP
    OtpStore.findAll({attribute: [{ email: data.email}]})
    .then(response => {
        // Convertin data in form of JSON
        let fetchedOtp = JSON.stringify(response, null, 4);
        console.log(fetchedOtp)
        // JSON - Object
        let extData = JSON.parse(fetchedOtp);
        console.log(extData);
        if(extData[0].otp == data.otp){
            // Correct OTP
            // Creating User in DB
            // Encrypting password
            OtpStore.destroy({where : {email : data.email}})
            .then(() => {
                bcrypt.hash(data.password, 12).then(hash => {
                    data.password = hash;

                    UserSchema.findAll({ attribute : { email : data.email , phone : data.phone } })
                    .then(checkUserRes => {

                        let fetchedOtp1 = JSON.stringify(checkUserRes, null, 4);
                        let extData1 = JSON.parse(fetchedOtp1);
                        if(extData1.length > 0){
                            res.status(205);
                            res.send("User already exists with these credentials");
                        }else{
                            UserSchema.create({
                                fName:data.name,
                                email:data.email,
                                phone:data.phone,
                                password:data.password,
                                location:"",
                                desc:"",
                                profilepic:""
                            }).then((dbres) => {
                                console.log("User Created Successfully");
                                jwt.sign({user:data},'secretkey',(err,token) =>{
                                    // Status 202 - Correct password
                                    JwtSchema.create({
                                        email : data.email,
                                        jwt : token
                                    })
                                    .then((response2) => {
                                        res.status(202);
                                        res.json({
                                            token
                                        });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                                });
                            }).catch(err => {
                                console.log(err);
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                });
            })
            .catch(err => console.log(err));
        }else{
            // Incorrect OTP
            res.status(203);
            res.send("Incorrect Otp");
        }
    }).catch(err => {
        console.log(err);
    })
};
  
// Resend OTP Method
exports.handleOtpResend = (req,res) => {
    // Fetching user register request data
    let data = req.body;
    // Generating OTP
    let otpVal = Math.floor(Math.random() * 10000) + 1001;
    let len = otpVal.toString();
    if (len.length > 4) {
        otpVal = otpVal % 10;
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
        OtpStore.findAll({attribute : {email : data.email}})
        .then((otpres) => {
            let fetchedOtp1 = JSON.stringify(otpres, null, 4);
            let extData1 = JSON.parse(fetchedOtp1);
            if(extData1.length > 0){
                OtpStore.update(
                    {
                        otp : len
                    },
                    {
                        where : { email : data.email }
                    }
                )
                .then((response2) => {
                    res.status(202);
                    res.send(resData);
                })
                .catch(err => {
                    console.log(err);
                })
            }else{   
                OtpStore.create({
                    email: data.email,
                    phone: data.phone,
                    otp: len
                }).then((dbres) => {
                    console.log("Otp Stored Successfully");
                    res.status(202);
                    res.send(dbres);
                }).catch(err => {
                    console.log(err);
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
        
    })
}

// Forget pass otp generator
exports.forgetPassOtpGen = (req,res) => {
    console.log("CHECK FUNCTION");
    // Fetching user request data
    let data = req.body;
    // Generating OTP
    let otpVal = Math.floor(Math.random() * 10000) + 1001;
    let len = otpVal.toString();
    if (len.length > 4) {
        otpVal = otpVal % 10;
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
        OtpStore.findAll({attribute : {email : data.email}})
        .then((otpres) => {
            let fetchedOtp1 = JSON.stringify(otpres, null, 4);
            let extData1 = JSON.parse(fetchedOtp1);
            if(extData1.length > 0){
                OtpStore.update(
                    {
                        otp : len
                    },
                    {
                        where : { email : data.email }
                    }
                )
                .then((response2) => {
                    res.status(202);
                    res.send(resData);
                })
                .catch(err => {
                    console.log(err);
                })
            }else{   
                OtpStore.create({
                    email: data.email,
                    phone: data.phone,
                    otp: len
                }).then((dbres) => {
                    console.log("Otp Stored Successfully");
                    res.status(202);
                    res.send(dbres);
                }).catch(err => {
                    console.log(err);
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
        
    })
}

// Otp check method 
exports.forgetPassOtpCheck = (req,res) => {
    let data = req.body;
    OtpStore.findAll({ attribute : { email : data.email } })
    .then((otpRes) => {
        let fetchedOtp1 = JSON.stringify(otpRes, null, 4);
        let extData1 = JSON.parse(fetchedOtp1);
        if(extData1.length > 0){
            let otpData = extData1[0].otp;
            if(otpData === data.otp){
                let data = req.body;
                OtpStore.findOne({
                    where: { email: data.email },  
                }).then(otpRow => {
                    if (otpRow) {
                        otpRow.destroy().then(() => {
                            res.status(202);
                            res.send("Otp Verified Successfully");
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                }).catch(err => {
                    console.log(err);
                })
            }else{
                res.status(203);
                res.send("Incorrect otp");
            }
        }else{
            res.status(203);
            res.send("Otp not present please press resend otp");
        }
    })
    .catch(err => {
        console.log(err);
    })
}

// Change Password Function
exports.regeneratePasswordFunction = (req,res) => {
    let data = req.body;
    bcrypt.hash(data.password, 12).then(hash => {
        UserSchema.update(
            {
                password : hash
            },
            {
                where : { email : data.email , phone : data.phone }
            }
        )
        .then((response) => {
            res.status(202);
            res.send(response);
        })
        .catch(err => {
            res.status(204);
            res.send("Password Update Failed");
        })
    });
}