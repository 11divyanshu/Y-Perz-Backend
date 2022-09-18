const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const DriveLearnSchema = sequelize.define('drivelearn',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true 
    },
    name:{
        type: Sequelize.STRING,
        allowNull: true
    },
    phone:{
        type: Sequelize.STRING,
        allowNull: false
    }
})


module.exports = DriveLearnSchema;
