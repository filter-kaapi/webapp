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
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log('Connection to DB is succesful.');
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

    await sequelize.sync({ force: true }); // force: false ensures existing tables are not dropped
    console.log('All models were synchronized successfully.');


} catch (error) {
    console.log("***************************");
    console.error('Unable to connect to the database:', error);
    console.log("***************************");
}};
connectToDatabase();
module.exports = sequelize;
