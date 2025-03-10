import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Usuari = sequelize.define('USER', {
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
    army: {
        type: DataTypes.JSON,
        allowNull: false
    },
    victories: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    defeats: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'USUARIS',
    freezeTableName: true, // Evita que sequelize canvie el nom de la taula a plural
    timestamps: false // Desactiva els camps createdAt i updatedAt
});

export default Usuari;