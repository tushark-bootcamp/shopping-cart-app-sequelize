const Sequelize = require('sequelize').Sequelize;
const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    lastName: Sequelize.STRING,
    address: Sequelize.STRING,
    emailAddress: Sequelize.STRING
});

module.exports = User;