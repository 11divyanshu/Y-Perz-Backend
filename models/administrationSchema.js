const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const AdministrationSchema = sequelize.define('administrators',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true 
    },
    fName:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    location:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    desc:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    profilepic:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    type:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    verify:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
})


module.exports = AdministrationSchema;
