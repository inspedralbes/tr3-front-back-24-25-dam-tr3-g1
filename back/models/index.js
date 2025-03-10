import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('game', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize;