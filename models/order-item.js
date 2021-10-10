const Sequelize = require('sequelize').Sequelize;
const sequelize = require('../util/database');

// Order is just an inbetween table - namely
// between a User to which the order belongs and then multiple products which are part of the Order.
// Products have quantity attached to it
const OrderItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});

module.exports = OrderItem;