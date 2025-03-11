import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Army = sequelize.define("ARMY", {
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'USUARIS',
            key: 'id'
        }
    },
    unit1: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'CHARACTERS',
            key: 'id'
        }
    },
    unit2: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'CHARACTERS',
            key: 'id'
        }
    },
    unit3: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'CHARACTERS',
            key: 'id'
        }
    },
    unit4: {
        type: DataTypes.STRING,
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