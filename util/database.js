const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('shopping-cart', 'root', 'app_pass$01', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;