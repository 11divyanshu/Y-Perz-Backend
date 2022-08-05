const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const CarInsuranceBrand = sequelize.define('carinsurancebrand',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true 
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    photo:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    status:{
        type: Sequelize.STRING,
        allowNull: false
    }
})


module.exports = CarInsuranceBrand;
