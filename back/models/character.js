import { DataTypes } from 'sequelize';

const defineCharacter = (sequelize) => {
    return sequelize.define('CHARACTER', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        weapon: {
            type: DataTypes.ENUM('SWORD', 'SPEAR', 'AXE', 'BOW', 'MAGIC'),
            allowNull: false
        },
        vs_sword: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        vs_spear: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        vs_axe: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        vs_bow: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        vs_magic: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        winged: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        sprite: {
            type: DataTypes.STRING,
            allowNull: true
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true
        },
        atk: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        movement: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        health: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'CHARACTERS',
        freezeTableName: true,
        timestamps: false
    });
};

export default defineCharacter;