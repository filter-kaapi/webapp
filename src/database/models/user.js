// This files contains the user model schema
// Hooks reference: https://sequelize.org/docs/v6/other-topics/hooks/#default-hooks-on-sequelize-constructor-options


const {DataTypes } = require('sequelize');
const sequelize = require('../sequelize.js');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    account_created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,

    },
    account_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,

    },
    
},{
    hooks: {
        beforeCreate: async(user) => {
            user.passwoord = await bcrypt.hash(User.password, 10);

        },
        beforeUpdate: async(user) => {
            if(user.changed('password', true)){
                user.password = await bcrypt.hash(User.password, 10);
            }
            user.account_updated = new Date();
        },
    },
    timestamps: false,
});
   
module.exports = User;