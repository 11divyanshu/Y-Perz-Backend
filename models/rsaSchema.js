const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const RSABrand = sequelize.define('rsabrand',{
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
    rsa:{
        type: Sequelize.STRING,
        allowNull: true,
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


module.exports = RSABrand;
