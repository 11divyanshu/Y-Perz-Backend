const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const JwtSchema = sequelize.define('jwtuser',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true 
    },
    phone:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    jwt:{
        type: Sequelize.STRING,
        allowNull: true,
    },
})


module.exports = JwtSchema;
