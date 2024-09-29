const { Sequelize } = require('sequelize');
const config = require('./config/database.js').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: config.port
});

module.exports = sequelize;
