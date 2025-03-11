import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import defineCharacter from './character.js';
import defineUsuari from './users.js';
import defineArmy from './armies.js';

const sequelize = new Sequelize('game', 'root', 'root', {
    host: 'host.docker.internal',
    dialect: 'mysql',
    dialectOptions: {
      multipleStatements: true
    }
});

defineCharacter(sequelize);
defineUsuari(sequelize);
defineArmy(sequelize);

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const sqlFilePath = path.join(__dirname, '..', 'db', 'sql', 'gameDB.sql');
const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8').replace(/\r\n/g, ' ').replace(/\n/g, ' ');

sequelize.sync()
  .then(() => {
    return sequelize.query(sqlQuery);
  })
  .then(() => {
    console.log('Inserciones realizadas con éxito');
  })
  .catch((error) => {
    console.error('Error al ejecutar el SQL:', error);
  });

export default sequelize;