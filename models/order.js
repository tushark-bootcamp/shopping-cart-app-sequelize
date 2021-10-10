const Sequelize = require('sequelize').Sequelize;
const sequelize = require('../util/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Order;