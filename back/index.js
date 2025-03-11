import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './models/index.js';
import Usuari from './models/usuaris.js';
import Character from './models/character.js';
import Army from './models/armies.js';
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

app.post('/characters', async (req, res) => {
    const { name, weapon, vs_sword, vs_spear, vs_axe, vs_bow, vs_magic, winged, sprite, icon, atk, movement, health } = req.body;
    try {
        const newCharacter = await Character.create({ name, weapon, vs_sword, vs_spear, vs_axe, vs_bow, vs_magic, winged, sprite, icon, atk, movement, health });
        res.status(201).json(newCharacter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/characters/:id', async (req, res) => {
    const { id } = req.params;
    const { name, weapon, vs_sword, vs_spear, vs_axe, vs_bow, vs_magic, winged, sprite, icon, atk, movement, health } = req.body;
    try {
        const character = await Character.findByPk(id);
        if (character) {
            await character.update({ name, weapon, vs_sword, vs_spear, vs_axe, vs_bow, vs_magic, winged, sprite, icon, atk, movement, health });
            res.status(200).json(character);
        } else {
            res.status(404).json({ error: 'Character not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/characters/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const character = await Character.findByPk(id);
        if (character) {
            await character.destroy();
            res.status(204).send({ message: 'Character deleted' });
        } else {
            res.status(404).json({ error: 'Character not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/characters', async (req, res) => {
    try {
        const characters = await Character.findAll();
        res.status(200).json(characters);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/characters/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const character = await Character.findByPk(id);
        if (character) {
            res.status(200).json(character);
        } else {
            res.status(404).json({ error: 'Character not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// app.post('/armies', async (req, res) => {
//     const { id, unit1, unit2, unit3, unit4 } = req.body;
//     try {
//         const newArmy = await Army.create({ id, unit1, unit2, unit3, unit4 });
//         res.status(201).json(newArmy);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

app.put('/armies/:id', async (req, res) => {
    const { id } = req.params;
    const { unit1, unit2, unit3, unit4 } = req.body;
    try {
        const army = await Army.findByPk(id);
        if (army) {
            await army.update({ unit1, unit2, unit3, unit4 });
            res.status(200).json(army);
        } else {
            res.status(404).json({ error: 'Army not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/armies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const army = await Army.findByPk(id);
        if (army) {
            res.status(200).json(army);
        } else {
            res.status(404).json({ error: 'Army not found' });
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