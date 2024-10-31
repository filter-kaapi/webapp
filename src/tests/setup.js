const { models, sequelize, connectToDatabase, closeDatabaseConnection } = require('../database/sequelize');

if (!process.env.GITHUB_ACTIONS) {
    if (process.env.NODE_ENV === 'test') {
        const result = require('dotenv').config({ path: '.env.test' });

        if (result.error) {
            throw new Error('Could not find .env.test file. Tests cannot run without it.');
        }
    } else {
        throw new Error(' NODE_ENV is not set to test!');
    }
}

beforeAll(async () => {
    try {
        await connectToDatabase();
        await sequelize.sync({ force: true });
    } catch (error) {
        console.error('Database setup failed:', error);
        throw error;
    }
});

// afterAll(async () => {
//     try {
//         // Close database connection or any other teardown logic
//         await sequelize.close();
//     } catch (error) {
//         console.error("Error closing database connection after tests:", error);
//     }
// });

afterAll(async () => {
    await closeDatabaseConnection();
});