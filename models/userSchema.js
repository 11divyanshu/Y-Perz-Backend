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
        allowNull: true,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    phone:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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
    vehicles:{
        type: Sequelize.JSON,
        allowNull: true
    },
    offers:{
        type: Sequelize.JSON,
        allowNull: true
    }
})


module.exports = UserSchema;
