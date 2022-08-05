const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const RaiseQuery = sequelize.define('raisequery',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true 
    },
    name:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    phone:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    subject:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    description:{
        type: Sequelize.STRING,
        allowNull: false,
    },
})


module.exports = RaiseQuery;
