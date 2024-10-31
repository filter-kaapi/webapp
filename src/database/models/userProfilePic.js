const { Model, DataTypes } = require('sequelize');

class UserProfilePic extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                unique: true,
                references: {
                    model: process.env.DB_TABLE_NAME,
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            file_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                }
            },
            s3_bucket_path: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            file_size: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 0
                }
            },
            content_type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['image/jpeg', 'image/jpg', 'image/png']]
                }
            },
            upload_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            }
        }, {
            sequelize,
            modelName: 'UserProfilePic',
            tableName: process.env.DB_TABLE_NAME_PIC,
            schema: process.env.DB_SCHEMA,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            indexes: [
                {
                    unique: true,
                    fields: ['user_id']
                }
            ],
        });
    }

    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    }
}

module.exports = UserProfilePic;