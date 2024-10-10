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

            // await server.close();
        } catch (error) {
            console.error("Error closing database connection after tests:", error);
        }
    });
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    //Health Check
    describe('GET /healthz', () => {
        it('should return 200 OK for health check', async () => {
            const response = await request(app).get('/healthz');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({});
        });

        it('should return 405 for POST check', async () => {
            const response = await request(app).post('/healthz');
            expect(response.status).toBe(405);
            expect(response.body).toEqual({});
        });

        it('should return 405 for PUT check', async () => {
            const response = await request(app).put('/healthz');
            expect(response.status).toBe(405);
            expect(response.body).toEqual({});
        });

        it('should return 405 for DELETE check', async () => {
            const response = await request(app).delete('/healthz');
            expect(response.status).toBe(405);
            expect(response.body).toEqual({});
        });

        it('should return 405 for OPTIONS check', async () => {
            const response = await request(app).options('/healthz');
            expect(response.status).toBe(405);
            expect(response.body).toEqual({});
        });
        it('should return 405 for HEAD check', async () => {
            const response = await request(app).head('/healthz');
            expect(response.status).toBe(405);
            expect(response.body).toEqual({});
        });

    });


    describe('POST /v1/user', () => {
        it('should create a user and return 201', async () => {
            const response = await request(app)
                .post('/v1/user')
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
            expect(response.body).not.toHaveProperty('password');
            expect(response.body).toHaveProperty('account_created');
            expect(response.body).toHaveProperty('account_updated');
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/v1/user')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body).toEqual({});
        });
        it('should return 400 for invalid request with parameters', async () => {
            const response = await request(app).post('/v1/user?param=value').send({});
            expect(response.status).toBe(400);
            expect(response.body).toEqual({});
        });
        it('should return 405 for other methods', async () => {
            const methods = ['get', 'put', 'delete', 'head', 'options'];
            for (const method of methods) {
                const response = await request(app)[method]('/v1/user');
                expect(response.status).toBe(405);
                expect(response.body).toEqual({});
            }
        });

        it('should return 400 if password is too short', async () => {
            const response = await request(app)
                .post('/v1/user')
                .send({
                    email: 'test@example.com',
                    first_name: 'John',
                    last_name: 'Doe',
                    password: '123' // Too short
                });
            expect(response.status).toBe(400);
            // expect(response.body.error).toBe("Password too small");
        });

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
    describe('POST /v1/user - Duplicate Email Check', () => {
        it('should return 400 for duplicate email', async () => {
            const userData = {
                email: 'duplicate@example.com',
                first_name: 'Jane',
                last_name: 'Doe',
                password: 'password123'
            };

            await request(app).post('/v1/user').send(userData); // Create user first

            const response = await request(app).post('/v1/user').send(userData);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({});
        });
    });
    describe('POST /v1/user - Missing Required Fields', () => {
        it('should return 400 for missing fields', async () => {
            const userData = {
                first_name: 'John',
                last_name: 'Doe',
                // missing email and password
            };

            const response = await request(app).post('/v1/user').send(userData);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({});
        });
    });
    describe('Non-Existent Endpoint', () => {
        it('should return 404 for a non-existent endpoint', async () => {
            const response = await request(app).get('/non-existent');
            expect(response.status).toBe(404);
        });
    });
});