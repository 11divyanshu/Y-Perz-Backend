const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const LoanSchema = sequelize.define('loan',{
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
    },
    email:{
        type: Sequelize.STRING,
        allowNull: true
    },
    type:{
        type: Sequelize.STRING,
        allowNull: false
    }
})


module.exports = LoanSchema;
