const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const UserSchema = sequelize.define('user',{
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
})


module.exports = UserSchema;
