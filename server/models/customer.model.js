const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

const Customer = sequelize.define('customer', {
    customerid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        autoNull: false
    },
    address: Sequelize.STRING,
    phone_number: Sequelize.INTEGER,
    dob: Sequelize.STRING
});

module.exports = Customer;