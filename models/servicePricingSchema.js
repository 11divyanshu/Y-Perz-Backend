const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ServicePricingSchema = sequelize.define('servicepricing',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true 
    },
    servicename:{
        type: Sequelize.STRING,
        allowNull: true
    },
    price:{
        type: Sequelize.STRING,
        allowNull: false
    }
})


module.exports = ServicePricingSchema;
