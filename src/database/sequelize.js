const { Sequelize } = require('sequelize');
const config = require('./config/dbConfig.js').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: config.port
})
const connectToDatabase = async () => {
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}};
connectToDatabase();
module.exports = sequelize;
