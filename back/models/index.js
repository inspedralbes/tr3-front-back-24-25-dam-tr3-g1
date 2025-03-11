import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';

const sequelize = new Sequelize('game', 'root', 'root', {
    host: 'host.docker.internal',
    dialect: 'mysql'
});

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const sqlFilePath = path.join(__dirname, '..', 'db', 'sql', 'gameDB.sql');
const sqlQuery = fs.readFileSync(sqlFilePath, { encoding: 'utf-8' });

sequelize.query(sqlQuery)
  .then(() => {
    console.log('Inserciones realizadas con éxito');
  })
  .catch((error) => {
    console.error('Error al ejecutar el SQL:', error);
  });

export default sequelize;