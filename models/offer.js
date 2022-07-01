const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const OfferSchema = sequelize.define('offerdata',{
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
    price:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    desc:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    offerimage:{
        type: Sequelize.STRING,
        allowNull: true,
    },
})


module.exports = OfferSchema;
