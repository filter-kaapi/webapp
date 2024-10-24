const { Sequelize } = require('sequelize');
const config = require('./config/dbConfig.js');

const env = process.env.NODE_ENV || 'development';

const dbConfig = config[env];
if (!dbConfig) {
    throw new Error(`No configuration found for environment: ${env}`);
}


const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect || 'postgres',
    port: dbConfig.port,
    timezone: '+00:00',
    schema: dbConfig.schema,
    logging: console.log

})
const connectToDatabase = async () => {
    try {
        console.log('Attempting to connect with config:', {
            database: dbConfig.database,
            username: dbConfig.username,
            host: dbConfig.host,
            port: dbConfig.port,
            schema: dbConfig.schema,
            environment: env
        });
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
        console.log('Current environment:', env);
        console.log('Database config:', {
            host: dbConfig.host,
            port: dbConfig.port,
            database: dbConfig.database,
            schema: dbConfig.schema
        });
        console.log("***************************");
    }
};
connectToDatabase();
module.exports = sequelize;