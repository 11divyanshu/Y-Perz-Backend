const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const OtpStore = sequelize.define('otpstore',{
    phone : {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
    },
    otp : Sequelize.STRING,
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true 
    }
});

module.exports = OtpStore;