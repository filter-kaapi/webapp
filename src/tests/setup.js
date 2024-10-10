
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


const sequelize = require('../database/sequelize');
beforeAll(async () => {
    await sequelize.sync({ force: true });

});

afterAll(async () => {
    await sequelize.close();
});