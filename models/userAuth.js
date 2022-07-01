const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const OtpStore = sequelize.define('otpstore',{
    email : Sequelize.STRING,
    phone : Sequelize.STRING,
    otp : Sequelize.STRING,
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true 
    }
});

module.exports = OtpStore;