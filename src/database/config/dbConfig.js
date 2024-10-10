//This file contains the database configuration
// that will be used my sequelize during initalisaiton.
// Secrets are stored in the .env file 
require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'runner',
        password: process.env.DB_PASSWORD || 'runner',
        database: process.env.DB_NAME || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        port: process.env.DB_PORT //5432
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT
    },
};

