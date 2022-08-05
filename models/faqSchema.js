const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Faqs = sequelize.define('faq',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true 
    },
    faq:{
        type: Sequelize.STRING,
        allowNull: false
    },
    answer:{
        type: Sequelize.STRING,
        allowNull: true
    },
    status:{
        type: Sequelize.STRING,
        allowNull: false
    }
})


module.exports = Faqs;
