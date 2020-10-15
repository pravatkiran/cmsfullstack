const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

const User = sequelize.define('user', {
    userid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: { type: Sequelize.STRING, autoNull : false},
    password: { type: Sequelize.STRING, autoNull: false},
});

module.exports = User;