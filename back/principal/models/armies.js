import { DataTypes } from "sequelize";

const defineArmy = (sequelize) => {
    return sequelize.define("ARMY", {
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'USERS',
                key: 'id'
            }
        },
        unit1: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'CHARACTERS',
                key: 'id',
                onDelete: 'CASCADE'
            }
        },
        unit2: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'CHARACTERS',
                key: 'id',
                onDelete: 'CASCADE'
            }
        },
        unit3: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'CHARACTERS',
                key: 'id',
                onDelete: 'CASCADE'
            }
        },
        unit4: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'CHARACTERS',
                key: 'id',
                onDelete: 'CASCADE'
            }
        },
    }, {
        tableName: "ARMIES",
        freezeTableName: true,
        timestamps: false,
    });
};

export default defineArmy;