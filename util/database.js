const Sequelize = require('sequelize');

const sequelize = new Sequelize('y-perez','root','',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;