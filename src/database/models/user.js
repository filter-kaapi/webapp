// This files contains the user model schema
// Hooks reference: https://sequelize.org/docs/v6/other-topics/hooks/#default-hooks-on-sequelize-constructor-options


const {DataTypes } = require('sequelize');
const sequelize = require('../sequelize.js');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true,
      },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    // account_created: {
    //     type: DataTypes.DATE,
    //     defaultValue: DataTypes.NOW,

    // },
    // account_updated: {
    //     type: DataTypes.DATE,
    //     defaultValue: DataTypes.NOW,

    // },
    
},{
    hooks: {
        beforeCreate: async(user) => {
            user.password = await bcrypt.hash(user.password, 5);

        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                console.log('Password changed for user:', user.email);
                user.password = await bcrypt.hash(user.password, 5);
                console.log('New hashed password:', user.password);
            } else {
                console.log('Password not changed');
            }
        },
    },
    // tableName: 'csye6225_users'
    createdAt: 'account_created',
    updatedAt: 'account_updated',
    timestamps: true,
});
   
module.exports = User;