const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const AlternateSchema = sequelize.define('alternateservice',{
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
    phone:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    startdate:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    enddate:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    c_num:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    c_name:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    slot:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    trans_id:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    order_id:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    supervisor_num:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    cleaner_num:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    pay_status:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    status:{
        type: Sequelize.STRING,
        allowNull: true,
    }
})



module.exports = AlternateSchema;
