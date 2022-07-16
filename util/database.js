const Sequelize = require('sequelize');

const sequelize = new Sequelize('tdpvista_yperz','tdpvista_yperzuser','D@Jm4WQTLL5&',{
    dialect: 'mysql',
    host: '208.91.199.49'
});

module.exports = sequelize;