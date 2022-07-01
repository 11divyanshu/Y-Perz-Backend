const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ServiceSchema = sequelize.define('servicedata',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true 
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    link:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    desc:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    icon:{
        type: Sequelize.STRING,
        allowNull: true,
    },
})


module.exports = ServiceSchema;
