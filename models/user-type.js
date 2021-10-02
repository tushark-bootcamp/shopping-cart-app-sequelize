const Sequelize = require('sequelize').Sequelize;

const sequelize = require('../util/database');

const UserType = sequelize.define('userType', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userType: Sequelize.STRING
});

module.exports = UserType;