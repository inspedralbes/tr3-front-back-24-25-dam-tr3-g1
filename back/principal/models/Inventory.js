import { DataTypes } from 'sequelize';

const defineInventory=(sequelize) => {
    return sequelize.define('INVENTORY', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'USERS',
                key: 'id'
            }
        },
        id_character: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'CHARACTERS',
                key: 'id'
            }
        }
    }, {
        tableName: 'INVENTORY',
        freezeTableName: true,
        timestamps: false
    });
}
export default defineInventory;