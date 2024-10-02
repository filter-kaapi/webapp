// This files contains the user model schema
// Hooks reference: https://sequelize.org/docs/v6/other-topics/hooks/#default-hooks-on-sequelize-constructor-options


const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize.js');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        },
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            max: 50,
            isAlpha: true
        },
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            max: 50,
            isAlpha: true
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,


    },
}, {
    hooks: {
        beforeCreate: async (user) => {
            user.email = user.email.toLowerCase();
            user.password = await bcrypt.hash(user.password, 5);

        },
        beforeUpdate: async (user) => {
            if (user.changed('email')) {
                user.email = user.email.toLowerCase();
            }
            if (user.changed('password')) {
                console.log('Password changed for user:', user.email);
                user.password = await bcrypt.hash(user.password, 5);
                console.log('New hashed password:', user.password);
            } else {
                console.log('Password not changed');
            }
        },
    },
    tableName: process.env.NODE_ENV === 'test' ? process.env.DB_TABLE_NAME : process.env.DB_TABLE_NAME,
    createdAt: 'account_created',
    updatedAt: 'account_updated',
    timestamps: true,
});

module.exports = User;