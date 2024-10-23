const { Sequelize } = require('sequelize');
const config = require('./config/dbConfig.js');

const env = process.env.NODE_ENV || 'development';
const theschema = process.env.DB_SCHEMA;

const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect || 'postgres',
    port: dbConfig.port,
    timezone: '+00:00'
})
const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log(`Connection to ${process.env.DB_NAME} DB is succesful.`);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

        const schemaName = theschema;
        await sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`);
        console.log(`Schema '${schemaName}' checked/created successfully.`);

        await sequelize.sync({ force: false }); // force: false ensures existing tables are not dropped
        console.log('All models were synchronized successfully.');


    } catch (error) {
        console.log("***************************");
        console.error('Unable to connect to the database:', error);
        console.log("***************************");
    }
};
connectToDatabase();
module.exports = sequelize;