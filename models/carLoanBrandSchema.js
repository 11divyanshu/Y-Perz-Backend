const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const CarLoanBrand = sequelize.define('carloanbrand',{
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


module.exports = CarLoanBrand;
