const multer = require('multer');
const path = require('path');
const UserSchema = require('../models/userSchema');
const AdministrationSchema = require('../models/administrationSchema');
const SingleTimeServiceSchema = require('../models/singleTimeServiceSchema.js');
const EverydaySchema = require('../models/everydaySchema.js');
const WeeklySchema = require('../models/weeklySchema.js');
const AlternateSchema = require('../models/alternateSchema.js');
const JwtSchema = require('../models/jwtSchema');
const CarBrand = require('../models/carBrandSchema');
const CarLoanBrand = require('../models/carLoanBrandSchema');
const CarInsuranceBrand = require('../models/carInsuranceBrandSchema');
const CarDriveLearningBrand = require('../models/carDriveLearningBrand');
const RaiseQuery = require('../models/querySchema');
const LoanSchema = require('../models/loanSchema');
const DryCleaningSchema = require('../models/dryCleaningSchema');
const RubPolishSchema = require('../models/rubAndPolishSchema');
const { ONE_SIGNAL_CONFIG } = require('../config/app.config');
const pushNotificationServices = require('../services/push-notification.services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nextTick } = require('process');
const Faqs = require('../models/faqSchema');
var FCM = require('fcm-node');
var serverKey = 'YOURSERVERKEYHERE'; //put your server key here
var fcm = new FCM(serverKey);
let LocalStorage = require('node-localstorage').LocalStorage;
if (typeof localStorage === "undefined" || localStorage === null) {
  localStorage = new LocalStorage('./scratch');
}

exports.SendNotification = (req, res) => {
  let message = {
    app_id: ONE_SIGNAL_CONFIG.APP_ID,
    contents: {
      en: "Supervisor Assigned to You"
    },
    included_segments: ["included_player_ids"],
    included_player_ids: ["c93c8741-2f1b-462c-b8f6-5bbfb4488812"],
    content_available: true,
    small_icon: "ic_notification_icon",
    data: {
      PushTitle: "Service Notification",
    }
  }

  pushNotificationServices.SendNotifications(message, (error, results) => {
    if (error) {
      res.send(error);
    }
    return res.status(200).json({
      message: "Notification sent successfully",
      data: results
    });
  })

}



exports.handleAdminRegister = (req, res) => {
  res.render('admin/adminregister', {
    pageTitle: 'Admin Register | YPERZ',
    path: '/admin/adminregister',
    confirmation: '205'
  });
}

exports.handleAdminRegisterPost = (req, res) => {
  let data = req.body;
  bcrypt.hash(data.admin_pass, 12).then(hash => {
    AdministrationSchema.create({
      fName: data.admin_name,
      email: data.admin_email,
      phone: data.admin_phone,
      password: hash,
      location: data.admin_location,
      desc: data.admin_desc,
      profilepic: "",
      type: "1",
      verify: 1
    }).then((dbres1) => {
      console.log("Admin Created Successfully");
      res.status(202);
      res.render('admin/login', {
        pageTitle: 'Admin Login | YPERZ',
        pageName: 'Login | Administration Panel',
        path: '/admin/login'
      });
    }).catch(err => {
      console.log(err);
      res.status(205);
      res.render('admin/adminregister', {
        pageTitle: 'Admin Register | YPERZ',
        path: '/admin/adminregister',
        confirmation: '205'
      });
    })
  })
}

exports.handleAdminLogin = (req, res) => {
  res.render('admin/login', {
    pageTitle: 'Admin Login | YPERZ',
    path: '/admin/login'
  });
};

exports.handleAdministrationLoginPost = (req, res) => {
  let data = req.body;
  AdministrationSchema.findAll({ where: { phone: data.ad_phone } })
    .then((response) => {
      let fetchedOtp = JSON.stringify(response, null, 4);
      let extData = JSON.parse(fetchedOtp);
      console.log(extData);
      bcrypt.compare(data.ad_password, extData[0].password, (err, response) => {
        if (response) {
          JwtSchema.findOne({ where: { phone: data.ad_phone } })
            .then((jwtRes) => {
              let fetchedOtp1 = JSON.stringify(jwtRes, null, 4);
              let extData1 = JSON.parse(fetchedOtp1);
              if (extData1 !== null) {
                jwt.sign({ user: data }, 'secretkey', (err, token) => {
                  JwtSchema.update(
                    {
                      jwt: token
                    },
                    {
                      where: { phone: data.ad_phone }
                    }
                  )
                    .then((response2) => {
                      if (typeof localStorage === "undefined" || localStorage === null) {
                        var LocalStorage = require('node-localstorage').LocalStorage;
                        localStorage = new LocalStorage('./scratch');
                      }
                      if (extData[0].type == "1") {
                        localStorage.setItem('data', JSON.stringify(extData[0]));
                        res.render('admin/home', {
                          pageTitle: 'Admin Home | YPERZ',
                          pageName: 'Home | Administration Panel',
                          path: '/admin/home',
                          confirmation: '202',
                          data: extData[0]
                        });
                      } else if (extData[0].type == "2") {
                        localStorage.setItem('data', JSON.stringify(extData[0]));
                        res.render('supervisor/suphome', {
                          pageTitle: 'Supervisor Home | Y PEREZ',
                          pageName: 'Home | Administration Panel',
                          path: '/admin/suphome',
                          confirmation: '202',
                          data: extData[0]
                        });
                      } else if (extData[0].type == "3") {
                        localStorage.setItem('data', JSON.stringify(extData[0]));
                        res.render('cleaner/cleanerhome', {
                          pageTitle: 'Cleaner Home | Y PEREZ',
                          pageName: 'Home | Administration Panel',
                          path: '/admin/cleanerhome',
                          confirmation: '202',
                          data: extData[0]
                        });
                      }
                    })
                    .catch(err => {
                      console.log(err);
                    })
                })
              } else {
                console.log("CHECK");
                jwt.sign({ user: data }, 'secretkey', (err, token) => {
                  console.log(token);
                  JwtSchema.create({
                    phone: data.ad_phone,
                    jwt: token
                  })
                    .then((response2) => {
                      if (typeof localStorage === "undefined" || localStorage === null) {
                        var LocalStorage = require('node-localstorage').LocalStorage;
                        localStorage = new LocalStorage('./scratch');
                      }
                      localStorage.setItem('data', JSON.stringify(extData[0]));
                      if (extData[0].type == "1") {
                        console.log(localStorage.getItem('data'));
                        res.render('admin/home', {
                          pageTitle: 'Admin Home | YPERZ',
                          path: '/admin/home',
                          pageName: 'Home | Administration Panel',
                          confirmation: '202',
                          data: extData[0]
                        });
                      } else if (extData[0].type == "2") {
                        // localStorage.setItem('data', JSON.stringify(extData[0]));
                        // console.log(localStorage.getItem('data'));
                        // res.render('supervisor/suphome', {
                        //   pageTitle: 'Supervisor Home | YPERZ',
                        //   path: '/admin/supervisorhome',
                        //   pageName: 'Home | Administration Panel',
                        //   confirmation: '202',
                        //   data: extData[0]
                        // });
                        res.redirect('/admin/supervisorhome');
                      } else {
                        res.status(202);
                        res.redirect('/admin/cleanerhome');
                      }
                    })
                    .catch(err => {
                      console.log(err);
                      res.status(205);
                      res.render('admin/login', {
                        pageTitle: 'Admin Login | YPERZ',
                        path: '/admin/login',
                        confirmation: '205'
                      });
                    })
                })
              }
            })
            .catch(err => {
              console.log(err);
              res.status(205);
              res.render('admin/login', {
                pageTitle: 'Admin Login | YPERZ',
                path: '/admin/login',
                confirmation: '205'
              });
            })

        } else {
          console.log(err);
          res.status(205);
          res.render('admin/login', {
            pageTitle: 'Admin Login | YPERZ',
            path: '/admin/login',
            confirmation: '205'
          });
        }
      })

    })
}

exports.handleAdminLogout = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  JwtSchema.destroy({ where: { phone: data.phone } })
    .then((response2) => {
      localStorage.removeItem('data');
      res.status(202);
      res.redirect('/admin/login');
    })
    .catch(err => {
      console.log(err);
    })
}

exports.handleAdminHome = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  res.render('admin/home', {
    pageTitle: 'Admin Home | YPERZ',
    pageName: 'Home | Administration Panel',
    path: '/admin/home',
    data: data
  });

};

exports.handleAdminUsers = (req, res) => {
  let data1 = JSON.parse(localStorage.getItem('data'));
  UserSchema.findAll()
    .then(function (usersData) {
      var data = JSON.parse(JSON.stringify(usersData));
      res.render('admin/users', {
        pageTitle: 'Admin Users | YPERZ',
        pageName: 'Users | Administration Panel',
        path: '/admin/users',
        users: data,
        data: data1
      });
    }).catch(function (err) {
      console.log('Oops! something went wrong, : ', err);
    });

}

exports.handleOnetimeWash = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  SingleTimeServiceSchema.findAll()
    .then(response => {
      let fetchedOtp = JSON.stringify(response, null, 4);
      let extData = JSON.parse(fetchedOtp);

      AdministrationSchema.findAll(
        { where: { type: "2" } }
      )
        .then(response1 => {
          let fetchedOtp1 = JSON.stringify(response1, null, 4);
          let extData1 = JSON.parse(fetchedOtp1);
          res.render('admin/onetimewash', {
            pageTitle: 'One Time Wash | YPERZ',
            pageName: 'One Time Wash | Administration Panel',
            path: '/admin/onetimewash',
            onetimeWash: extData,
            supervisors: extData1,
            data: data
          });
        })
        .catch(err => {
          console.log(err);
          res.render('admin/home', {
            pageTitle: 'Admin Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/home',
            data: data
          });
        });

    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data
      });
    });
};

exports.handleOneTimeSuperAssign = (req, res) => {
  let data = req.body;
  SingleTimeServiceSchema.update(
    {
      supervisor_num: data.supervisor_phone,
      supervisor_name: data.supervisor_name,
    },
    {
      where: {
        id: data.id,
        phone: data.phone
      }
    }
  )
    .then(response => {
      // UserSchema.findAll
      // (
      //   { 
      //     where: { phone: data.phone } 
      //   }
      // )
      //   .then(response1 => {
      //     let fetchedOtp = JSON.stringify(response1, null, 4);
      //     let extData = JSON.parse(fetchedOtp);
      //     res.redirect('/admin/onetimewash');

      //   })
      //   .catch(err => {
      //     console.log(err);
      //     res.redirect('admin/home');
      //   });
      var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
          to: 'b3d5d0ab-8f20-4313-b288-1320c41224d4', 
          notification: {
              title: 'Title of your push notification', 
              body: 'Body of your push notification' 
          },
          
          data: {  //you can send only notification or only data(or include both)
              my_key: 'my value',
              my_another_key: 'my another value'
          }
      };
      fcm.send(message, function(err, response){
          if (err) {
              console.log("Something has gone wrong!");
              res.redirect('admin/home');
          } else {
              console.log("Successfully sent with response: ", response);
              res.redirect('/admin/onetimewash');
          }
      });
    })
    .catch(err => {
      res.redirect('admin/home');
    })
}

exports.handleEverydayWash = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  EverydaySchema.findAll()
    .then(response => {
      let fetchedData = JSON.stringify(response, null, 4);
      let extData = JSON.parse(fetchedData);
      AdministrationSchema.findAll(
        { where: { type: "2" } }
      )
        .then(response1 => {
          let fetchedOtp1 = JSON.stringify(response1, null, 4);
          let extData1 = JSON.parse(fetchedOtp1);
          res.render('admin/everydaywash', {
            pageTitle: 'Every Day Wash | YPERZ',
            pageName: 'Every Day  Wash | Administration Panel',
            path: '/admin/everydaywash',
            data: data,
            everydayWash: extData,
            supervisors: extData1
          });
        })
        .catch(err => {
          console.log(err);
          res.render('admin/home', {
            pageTitle: 'Admin Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/home',
            data: data
          });
        })
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data
      });
    });
};

exports.handleEverydaySuperAssign = (req, res) => {
  let data = req.body;
  EverydaySchema.update(
    {
      supervisor_num: data.supervisor_phone,
      supervisor_name: data.supervisor_name,
    },
    {
      where: {
        id: data.id,
        phone: data.phone
      }
    }
  )
    .then(response => {
      res.redirect('/admin/everydaywash');
    })
    .catch(err => {
      console.log(err);
      res.redirect('admin/home');
    })
}

exports.handleAlternateWash = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  AlternateSchema.findAll()
    .then(response => {
      let fetchedData = JSON.stringify(response, null, 4);
      let extData = JSON.parse(fetchedData);
      AdministrationSchema.findAll(
        { where: { type: "2" } }
      )
        .then(response1 => {
          let fetchedOtp1 = JSON.stringify(response1, null, 4);
          let extData1 = JSON.parse(fetchedOtp1);
          res.render('admin/alternatewash', {
            pageTitle: 'Admin Alternate Wash | YPERZ',
            pageName: 'Alternate Wash | Administration Panel',
            path: '/admin/alternatewash',
            data: data,
            alternateWash: extData,
            supervisors: extData1
          });
        })
        .catch(err => {
          console.log(err);
          res.render('admin/home', {
            pageTitle: 'Admin Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/home',
            data: data
          });
        })
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data
      });
    });
};

exports.handleAlternateSuperAssign = (req, res) => {
  let data = req.body;
  console.log(data);
  AlternateSchema.update(
    {
      supervisor_num: data.supervisor_phone,
      supervisor_name: data.supervisor_name,
    },
    {
      where: {
        id: data.id,
        phone: data.phone
      }
    }
  )
    .then(response => {
      res.redirect('/admin/alternatewash');
    })
    .catch(err => {
      console.log(err);
      res.redirect('admin/home');
    })
}

exports.handleWeeklyWash = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  WeeklySchema.findAll()
    .then(response => {
      let fetchedData = JSON.stringify(response, null, 4);
      let extData = JSON.parse(fetchedData);
      AdministrationSchema.findAll(
        { where: { type: "2" } }
      )
        .then(response1 => {
          let fetchedOtp1 = JSON.stringify(response1, null, 4);
          let extData1 = JSON.parse(fetchedOtp1);
          res.render('admin/weeklywash', {
            pageTitle: 'Admin Weekly Wash | YPERZ',
            pageName: 'Weekly Wash | Administration Panel',
            path: '/admin/weeklywash',
            data: data,
            weeklyWash: extData,
            supervisors: extData1
          });
        })
        .catch(err => {
          console.log(err);
          res.render('admin/home', {
            pageTitle: 'Admin Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/home',
            data: data
          });
        })
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data
      });
    });
};

exports.handleWeeklySuperAssign = (req, res) => {
  let data = req.body;
  WeeklySchema.update(
    {
      supervisor_num: data.supervisor_phone,
      supervisor_name: data.supervisor_name,
    },
    {
      where: {
        id: data.id,
        phone: data.phone
      }
    }
  )
    .then(response => {
      res.redirect('/admin/weeklywash');
    })
    .catch(err => {
      console.log(err);
      res.redirect('admin/home');
    })
}

exports.handleDryClean = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  DryCleaningSchema.findAll()
    .then(response => {
      let fetchedOtp = JSON.stringify(response, null, 4);
      let extData = JSON.parse(fetchedOtp);

      AdministrationSchema.findAll(
        { where: { type: "2" } }
      )
        .then(response1 => {
          let fetchedOtp1 = JSON.stringify(response1, null, 4);
          let extData1 = JSON.parse(fetchedOtp1);
          res.render('admin/dryclean', {
            pageTitle: 'Admin Dry Cleaning | YPERZ',
            pageName: 'Dry Cleaning | Administration Panel',
            path: '/admin/dryclean',
            dryClean: extData,
            supervisors: extData1,
            data: data
          });
        })
        .catch(err => {
          console.log(err);
          res.render('admin/home', {
            pageTitle: 'Admin Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/home',
            data: data
          });
        });

    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data
      });
    });
};

exports.handleDryCleanSuperAssign = (req, res) => {
  let data = req.body;
  DryCleaningSchema.update(
    {
      supervisor_num: data.supervisor_phone,
      supervisor_name: data.supervisor_name,
    },
    {
      where: {
        id: data.id,
        phone: data.phone
      }
    }
  )
    .then(response => {
      res.redirect('/admin/dryclean');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/admin/home');
    })
}

exports.handleRubPolish = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  RubPolishSchema.findAll()
    .then(response => {
      let fetchedOtp = JSON.stringify(response, null, 4);
      let extData = JSON.parse(fetchedOtp);

      AdministrationSchema.findAll(
        { where: { type: "2" } }
      )
        .then(response1 => {
          let fetchedOtp1 = JSON.stringify(response1, null, 4);
          let extData1 = JSON.parse(fetchedOtp1);
          res.render('admin/rubpolish', {
            pageTitle: 'Admin Rubbing And Polishing | YPERZ',
            pageName: 'Rubbing And Polishing | Administration Panel',
            path: '/admin/rubpolish',
            rubPolish: extData,
            supervisors: extData1,
            data: data
          });
        })
        .catch(err => {
          console.log(err);
          res.render('admin/home', {
            pageTitle: 'Admin Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/home',
            data: data
          });
        });

    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data
      });
    });
};

exports.handleRubPolishSuperAssign = (req, res) => {
  let data = req.body;
  RubPolishSchema.update(
    {
      supervisor_num: data.supervisor_phone,
      supervisor_name: data.supervisor_name,
    },
    {
      where: {
        id: data.id,
        phone: data.phone
      }
    }
  )
    .then(response => {
      res.redirect('/admin/rubpolish');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/admin/home');
    })
}

exports.handleRaiseQuery = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  RaiseQuery.findAll()
    .then(response => {
      let fetchedData = JSON.stringify(response, null, 4);
      let extData = JSON.parse(fetchedData);
      res.render('admin/raisequery', {
        pageTitle: 'Admin Raise Query | YPERZ',
        pageName: 'Raise Query | Administration Panel',
        path: '/admin/raisequery',
        data: data,
        queries: extData
      });
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data
      });
    });
};

exports.handleLoans = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  LoanSchema.findAll()
    .then(response => {
      let fetchedData = JSON.stringify(response, null, 4);
      let extData = JSON.parse(fetchedData);
      res.render('admin/loans', {
        pageTitle: 'Admin Loans | YPERZ',
        pageName: 'Loans | Administration Panel',
        path: '/admin/loans',
        data: data,
        loans: extData
      });
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data
      });
    });
}

exports.handleFaqs = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  Faqs.findAll()
    .then(response => {
      let fetchedData = JSON.stringify(response, null, 4);
      let extData = JSON.parse(fetchedData);
      res.render('admin/faq', {
        pageTitle: "Admin FAQ's | YPERZ",
        pageName: "FAQ's | Administration Panel",
        path: '/admin/faqs',
        data: data,
        faqs: extData
      });
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data
      });
    });
};

exports.handleCreateFaq = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  res.render('admin/createfaq', {
    pageTitle: "Admin Create FAQ's | YPERZ",
    pageName: "Create FAQ's | Administration Panel",
    path: '/admin/createfaq',
    data: data,
  });
}

exports.handleCreateFaqPost = (req, res) => {
  let data1 = JSON.parse(localStorage.getItem('data'));
  let data = req.body;
  console.log(data.answer);
  if (data.answer === "") {
    Faqs.create({
      faq: data.faq,
      answer: data.answer,
      status: "0"
    })
      .then(response => {
        res.redirect('/admin/faqs');
      })
      .catch(err => {
        res.redirect('/admin/home');
      });
  } else {
    Faqs.create({
      faq: data.faq,
      answer: data.answer,
      status: "1"
    })
      .then(response => {
        res.redirect('/admin/faqs');
      })
      .catch(err => {
        res.redirect('/admin/home');
      });
  }

}

exports.handleAnswerFaq = (req, res) => {
  let data = req.body;
  let data1 = JSON.parse(localStorage.getItem('data'));
  Faqs.update(
    {
      answer: data.answer,
      status: "1"
    },
    {
      where: {
        id: data.id
      }
    })
    .then(response => {
      Faqs.findAll()
        .then(response => {
          let fetchedData = JSON.stringify(response, null, 4);
          let extData = JSON.parse(fetchedData);
          res.render('admin/faq', {
            pageTitle: "Admin FAQ's | YPERZ",
            pageName: "FAQ's | Administration Panel",
            path: '/admin/faqs',
            data: data,
            faqs: extData
          });
        })
        .catch(err => {
          console.log(err);
          res.render('admin/home', {
            pageTitle: 'Admin Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/home',
            data: data
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data1
      });
    })
}

exports.handleUpdateStatus = (req, res) => {
  let data = req.body;
  let data1 = JSON.parse(localStorage.getItem('data'));
  Faqs.update(
    {
      status: data.status
    },
    {
      where: {
        id: data.id
      }
    })
    .then(response => {
      Faqs.findAll()
        .then(response => {
          let fetchedData = JSON.stringify(response, null, 4);
          let extData = JSON.parse(fetchedData);
          res.render('admin/faq', {
            pageTitle: "Admin FAQ's | YPERZ",
            pageName: "FAQ's | Administration Panel",
            path: '/admin/faqs',
            data: data,
            faqs: extData
          });
        })
        .catch(err => {
          console.log(err);
          res.render('admin/home', {
            pageTitle: 'Admin Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/home',
            data: data1
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data1
      });
    })
}

exports.handleCarBrands = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  CarBrand.findAll()
    .then(response => {
      let fetchedData = JSON.stringify(response, null, 4);
      let extData = JSON.parse(fetchedData);
      res.render('admin/carbrands', {
        pageTitle: "Admin Car Brands | YPERZ",
        pageName: "Car Brands | Administration Panel",
        path: '/admin/carbrands',
        data: data,
        carbrands: extData
      });
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data1
      });
    });
}

exports.handleAddCarBrands = (req, res) => {
  let data = req.body;
  console.log(data);

  let data1 = JSON.parse(localStorage.getItem('data'));
  CarBrand.create({
    name: data.brand_name,
    status: "1",
    photo: req.file.path
  })
    .then(response => {
      res.redirect('/admin/carbrands');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/admin/home');
    })
}

exports.handleUpdateCarBrandStatus = (req, res) => {
  let data = req.body;
  let data1 = JSON.parse(localStorage.getItem('data'));
  CarBrand.update(
    {
      status: data.status
    },
    {
      where: {
        id: data.id
      }
    })
    .then(response => {
      CarBrand.findAll()
        .then(response => {
          let fetchedData = JSON.stringify(response, null, 4);
          let extData = JSON.parse(fetchedData);
          res.render('admin/carbrands', {
            pageTitle: "Admin Car Brands | YPERZ",
            pageName: "Car Brands | Administration Panel",
            path: '/admin/carbrands',
            data: data1,
            carbrands: extData
          });
        })
        .catch(err => {
          console.log(err);
          res.render('admin/home', {
            pageTitle: 'Admin Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/home',
            data: data1
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data1
      });
    })
}

exports.handleCarLoanBrands = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  CarLoanBrand.findAll()
    .then(response => {
      let fetchedData = JSON.stringify(response, null, 4);
      let extData = JSON.parse(fetchedData);
      res.render('admin/carloanbrands', {
        pageTitle: "Admin Car Loan Brands | YPERZ",
        pageName: "Car Loan Brands | Administration Panel",
        path: '/admin/carloanbrands',
        data: data,
        carbrands: extData
      });
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data1
      });
    });
}

exports.handleAddCarLoanBrands = (req, res) => {
  let data = req.body;
  let data1 = JSON.parse(localStorage.getItem('data'));
  CarLoanBrand.create({
    name: data.brand_name,
    status: "1",
    photo: req.file.path
  })
    .then(response => {
      res.redirect('/admin/carloanbrands');
    })
    .catch(err => {
      res.redirect('/admin/home');
    })
}

exports.handleUpdateCarLoanBrandStatus = (req, res) => {
  let data = req.body;
  console.log(data);
  let data1 = JSON.parse(localStorage.getItem('data'));
  CarLoanBrand.update(
    {
      status: data.status
    },
    {
      where: {
        id: data.id
      }
    })
    .then(response => {
      CarLoanBrand.findAll()
        .then(response => {
          let fetchedData = JSON.stringify(response, null, 4);
          let extData = JSON.parse(fetchedData);
          res.render('admin/carloanbrands', {
            pageTitle: "Admin Car Loan Brands | YPERZ",
            pageName: "Car Loan Brands | Administration Panel",
            path: '/admin/carloanbrands',
            data: data,
            carbrands: extData
          });
        })
        .catch(err => {
          console.log(err);
          res.render('admin/home', {
            pageTitle: 'Admin Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/home',
            data: data1
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data1
      });
    })
}

exports.handleCarInsuranceBrands = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  CarInsuranceBrand.findAll()
    .then(response => {
      let fetchedData = JSON.stringify(response, null, 4);
      let extData = JSON.parse(fetchedData);
      res.render('admin/carinsurancebrands', {
        pageTitle: "Admin Car Insurance Brands | YPERZ",
        pageName: "Car Insurance Brands | Administration Panel",
        path: '/admin/carinsurancebrands',
        data: data,
        carbrands: extData
      });
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data1
      });
    });
}

exports.handleAddCarInsuranceBrands = (req, res) => {
  let data = req.body;
  let data1 = JSON.parse(localStorage.getItem('data'));
  CarInsuranceBrand.create({
    name: data.brand_name,
    status: "1",
    photo: req.file.path
  })
    .then(response => {
      res.redirect('/admin/carinsurancebrands');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/admin/home');
    })
}

exports.handleUpdateCarInsuranceBrandStatus = (req, res) => {
  let data = req.body;
  let data1 = JSON.parse(localStorage.getItem('data'));
  CarInsuranceBrand.update(
    {
      status: data.status
    },
    {
      where: {
        id: data.id
      }
    })
    .then(response => {
      CarInsuranceBrand.findAll()
        .then(response => {
          let fetchedData = JSON.stringify(response, null, 4);
          let extData = JSON.parse(fetchedData);
          res.render('admin/carinsurancebrands', {
            pageTitle: "Admin Car Insurance Brands | YPERZ",
            pageName: "Car Insurance Brands | Administration Panel",
            path: '/admin/carinsurancebrands',
            data: data,
            carbrands: extData
          });
        })
        .catch(err => {
          console.log(err);
          res.render('admin/home', {
            pageTitle: 'Admin Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/home',
            data: data1
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data1
      });
    })
}

exports.handleCarDriveLearningBrands = (req, res) => {
  let data = JSON.parse(localStorage.getItem('data'));
  CarDriveLearningBrand.findAll()
    .then(response => {
      let fetchedData = JSON.stringify(response, null, 4);
      let extData = JSON.parse(fetchedData);
      res.render('admin/cardrivelearningbrands', {
        pageTitle: "Admin Car Drive Learning Brands | YPERZ",
        pageName: "Car Drive Learning Brands | Administration Panel",
        path: '/admin/cardrivelearningbrands',
        data: data,
        carbrands: extData
      });
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data1
      });
    });
}

exports.handleAddCarDriveLearningBrands = (req, res) => {
  let data = req.body;
  let data1 = JSON.parse(localStorage.getItem('data'));
  CarDriveLearningBrand.create({
    name: data.brand_name,
    status: "1",
    photo: req.file.path
  })
    .then(response => {
      res.redirect('/admin/cardrivelearningbrands');
    })
    .catch(err => {
      res.redirect('/admin/home');
    })
}

exports.handleUpdateCarDriveLearningBrandStatus = (req, res) => {
  let data = req.body;
  let data1 = JSON.parse(localStorage.getItem('data'));
  CarDriveLearningBrand.update(
    {
      status: data.status
    },
    {
      where: {
        id: data.id
      }
    })
    .then(response => {
      CarDriveLearningBrand.findAll()
        .then(response => {
          let fetchedData = JSON.stringify(response, null, 4);
          let extData = JSON.parse(fetchedData);
          res.render('admin/cardrivelearningbrands', {
            pageTitle: "Admin Car Drive Learning Brands | YPERZ",
            pageName: "Car Drive Learning Brands | Administration Panel",
            path: '/admin/cardrivelearningbrands',
            data: data,
            carbrands: extData
          });
        })
        .catch(err => {
          console.log(err);
          res.render('admin/home', {
            pageTitle: 'Admin Home | YPERZ',
            pageName: 'Home | Administration Panel',
            path: '/admin/home',
            data: data1
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.render('admin/home', {
        pageTitle: 'Admin Home | YPERZ',
        pageName: 'Home | Administration Panel',
        path: '/admin/home',
        data: data1
      });
    })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Images/Brands');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

exports.uploadcarbrand = multer({
  storage: storage,
}).single('brand_image')

exports.checkAdministration = (req, res, next) => {
  let data = JSON.parse(localStorage.getItem('data'));
  if (data === null) {
    res.redirect('/admin/login');
  } else {
    return next();
  }
}