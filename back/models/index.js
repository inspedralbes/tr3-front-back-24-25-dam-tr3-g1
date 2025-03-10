import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('game', 'root', 'root', {
    host: 'host.docker.internal',
    dialect: 'mysql'
});

export default sequelize;