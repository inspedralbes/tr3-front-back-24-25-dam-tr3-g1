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
                key: 'id'
            }
        },
        unit2: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'CHARACTERS',
                key: 'id'
            }
        },
        unit3: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'CHARACTERS',
                key: 'id'
            }
        },
        unit4: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'CHARACTERS',
                key: 'id'
            }
        },
    }, {
        tableName: "ARMIES",
        freezeTableName: true,
        timestamps: false,
    });
};

export default defineArmy;