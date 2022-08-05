const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const CarDriveLearningBrand = sequelize.define('cardrivelearningbrand',{
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
        allowNull: false,
    },
    status:{
        type: Sequelize.STRING,
        allowNull: false
    }
})


module.exports = CarDriveLearningBrand;
