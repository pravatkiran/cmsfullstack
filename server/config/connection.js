const Sequelize = require('sequelize');
const configDev = require('./environment/development');
const configProd = require('./environment/production');

const sequelize = new Sequelize(configDev.sequelize.uri || configProd,configDev.sequelize.options || configProd.sequelize.options )




module.exports = sequelize;