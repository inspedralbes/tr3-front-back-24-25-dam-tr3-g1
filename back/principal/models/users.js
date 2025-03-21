import { DataTypes } from 'sequelize';

const defineUsuari = (sequelize) => {
    return sequelize.define('USER', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        elo: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        victories: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        defeats: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    }, {
        tableName: 'USERS',
        freezeTableName: true,
        timestamps: false 
    });
};

export default defineUsuari;