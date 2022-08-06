const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const DryCleaningSchema = sequelize.define('drycleaning',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true 
    },
    name:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    phone:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    date:{
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
    },
    amount:{
        type: Sequelize.STRING,
        allowNull: true,
    }
})



module.exports = DryCleaningSchema;
