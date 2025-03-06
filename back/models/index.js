import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('tr3-g1', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize;