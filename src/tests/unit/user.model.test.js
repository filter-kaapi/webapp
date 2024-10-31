// tests/unit/user.model.test.js
const { models, sequelize, connectToDatabase, closeDatabaseConnection } = require('../../database/sequelize');
const User = models.User;
const bcrypt = require('bcrypt');

describe('User Model', () => {
    beforeAll(async () => {
        await connectToDatabase();
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await closeDatabaseConnection();
    });
    // beforeEach(async () => {
    //     await sequelize.sync({ force: true });
    // });

    afterEach(async () => {
        await User.destroy({
            where: {},
            truncate: true,
            cascade: true
        });
    });

    it('should create a user successfully', async () => {
        const userData = {
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
            password: 'password123'
        };

        const user = await User.create(userData);

        expect(user.email).toBe(userData.email.toLowerCase());
        expect(user.first_name).toBe(userData.first_name);
        expect(user.last_name).toBe(userData.last_name);
        expect(await bcrypt.compare(userData.password, user.password)).toBe(true);
        expect(user.account_created).toBeDefined();
        expect(user.account_updated).toBeDefined();
    });

    it('should not create a user with invalid email', async () => {
        const userData = {
            email: 'invalid-email',
            first_name: 'John',
            last_name: 'Doe',
            password: 'password123'
        };

        await expect(User.create(userData)).rejects.toThrow();
    });

    it('should update password using bcrypt when updating user', async () => {
        const user = await User.create({
            email: 'update@example.com',
            first_name: 'Jane',
            last_name: 'Doe',
            password: 'oldpassword'
        });

        const newPassword = 'newpassword';
        user.password = newPassword;
        await user.save();

        expect(await bcrypt.compare(newPassword, user.password)).toBe(true);
    });

    it('should throw an error if required fields are missing', async () => {
        const userData = {
            email: '',
            first_name: '',
            last_name: '',
            password: ''
        };

        await expect(User.create(userData)).rejects.toThrow();
    });
    it('should not allow duplicate email addresses', async () => {
        const userData = {
            email: 'duplicate@example.com',
            first_name: 'John',
            last_name: 'Doe',
            password: 'password123'
        };

        await User.create(userData);

        await expect(User.create(userData)).rejects.toThrow();
    });
    it('should accept valid email formats', async () => {
        const validEmails = [
            'simple@example.com',
            'very.common@example.com',
            'disposable.style.email.with+symbol@example.com',
            'user@subdomain.example.com'
        ];

        for (const email of validEmails) {
            const user = await User.create({
                email,
                first_name: 'Test',
                last_name: 'User',
                password: 'password123'
            });
            expect(user.email).toBe(email);
        }
    });

    it('should hash the password before saving the user', async () => {
        const userData = {
            email: 'hashcheck@example.com',
            first_name: 'John',
            last_name: 'Doe',
            password: 'plainpassword'
        };

        const user = await User.create(userData);

        // checking to see ifi ts plain text 
        expect(user.password).not.toBe(userData.password);

        // or if its correctly hashed
        expect(await bcrypt.compare(userData.password, user.password)).toBe(true);
    });
    it('should only hash the password if it was updated', async () => {
        const user = await User.create({
            email: 'nochange@example.com',
            first_name: 'Jane',
            last_name: 'Doe',
            password: 'oldpassword'
        });

        // keep the current hashed password
        const originalHashedPassword = user.password;

        // change a non-password field
        user.first_name = 'UpdatedName';
        await user.save();

        // check the password is not rehashed
        expect(user.password).toBe(originalHashedPassword);

        // update the password
        const newPassword = 'newpassword';
        user.password = newPassword;
        await user.save();

        // check if the password is rehashed correctly
        expect(await bcrypt.compare(newPassword, user.password)).toBe(true);
    });


    it('should set account_created and account_updated timestamps', async () => {
        const user = await User.create({
            email: 'timestamp@example.com',
            first_name: 'John',
            last_name: 'Doe',
            password: 'password123'
        });

        expect(user.account_created).toBeDefined();
        expect(user.account_updated).toBeDefined();

        //Update user and check if account_updated timestamp changes
        const oldUpdated = user.account_updated;
        user.first_name = 'UpdatedName';
        await user.save();

        expect(user.account_updated).not.toEqual(oldUpdated);
    });
    it('should treat emails as case-insensitive', async () => {
        const userData = {
            email: 'CaseSensitive@example.com',
            first_name: 'John',
            last_name: 'Doe',
            password: 'password123'
        };

        await User.create(userData);

        const duplicateUserData = {
            email: 'casesensitive@example.com', // Lowercase version of the same email
            first_name: 'Jane',
            last_name: 'Doe',
            password: 'password123'
        };

        await expect(User.create(duplicateUserData)).rejects.toThrow();
    });
    it('should enforce the maximum length of first and last name', async () => {
        const userData = {
            email: 'lengthcheck@example.com',
            first_name: 'a'.repeat(256), // Exceeding length
            last_name: 'Doe',
            password: 'password123'
        };

        await expect(User.create(userData)).rejects.toThrow();
    });

});