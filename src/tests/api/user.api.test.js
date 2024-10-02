// tests/integration/user.api.test.js

const request = require('supertest');
const app = require('../../../src/index'); // Adjust the path according to your project structure
const sequelize = require('../../database/sequelize'); // Import your sequelize instance
let server;
describe('User API Integration Tests', () => {
    beforeAll(async () => {
        try {
            await sequelize.sync({ force: true }); // Reset database for tests
        } catch (error) {
            console.error("Error syncing database before tests:", error);
        }
    });

    afterAll(async () => {
        try {

            await sequelize.close();

            await server.close();
        } catch (error) {
            console.error("Error closing database connection after tests:", error);
        }
    });

    describe('POST /v1/user', () => {
        it('should create a user and return 201', async () => {
            const response = await request(app)
                .post('/v1/user') // Ensure the correct path is used
                .send({
                    email: 'test@example.com',
                    first_name: 'John',
                    last_name: 'Doe',
                    password: 'password123'
                });

            console.log('POST /v1/user response:', response.body); // Log response for debugging
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe('test@example.com');
            expect(response.body.first_name).toBe('John');
            expect(response.body.last_name).toBe('Doe');
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/v1/user')
                .send({});
            expect(response.status).toBe(400);
        });

        // it('should return 400 if password is too short', async () => {
        //     const response = await request(app)
        //         .post('/v1/user')
        //         .send({
        //             email: 'test@example.com',
        //             first_name: 'John',
        //             last_name: 'Doe',
        //             password: '123' // Too short
        //         });
        //     expect(response.status).toBe(400);
        //     expect(response.body.error).toBe("Password too small");
        // });

        it('should return 400 if user already exists', async () => {
            await request(app)
                .post('/v1/user')
                .send({
                    email: 'duplicate@example.com',
                    first_name: 'John',
                    last_name: 'Doe',
                    password: 'password123'
                });

            const response = await request(app)
                .post('/v1/user')
                .send({
                    email: 'duplicate@example.com',
                    first_name: 'Jane',
                    last_name: 'Doe',
                    password: 'password456'
                });

            expect(response.status).toBe(400);
        });
    });
});
