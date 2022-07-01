const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const VehicleSchema = sequelize.define('vehicledata',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true 
    },
    vtitle:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    vnumber:{
        type: Sequelize.STRING,
        allowNull: true,
    },
})


module.exports = VehicleSchema;
