import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './models/index.js';
import Usuari from './models/usuaris.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/newUser', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const nouUsuari = await Usuari.create({ username, password, email, army: {} });
        res.status(201).json(nouUsuari);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(port, async () => {
    try {
        await sequelize.sync();
        console.log(`Servidor escoltant a http://localhost:${port}`);
    } catch (error) {
        console.error('No s\'ha pogut connectar a la base de dades:', error);
    }
});