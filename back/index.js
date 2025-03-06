import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './models/index.js';
import Usuari from './models/usuaris.js';
import cors from 'cors';

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());
app.post('/newUser', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const nouUsuari = await Usuari.create({ username, password, email, army: {"unit1":'h', "unit2":'sw', "unit3":'a', "unit4":'sp'} });
        res.status(201).json(nouUsuari);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuari = await Usuari.findOne({ where: { email, password } });
        if (usuari) {
            res.status(200).json(usuari);
        } else {
            res.status(404).json({ error: 'Usuari no trobat' });
        }
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