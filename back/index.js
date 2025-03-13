import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './models/index.js';
import { Op } from 'sequelize';
import defineCharacter from './models/character.js';
import defineArmy from './models/armies.js';
import cors from 'cors';
import defineUser from './models/users.js';

const app = express();
const port = 4000;

const Character = defineCharacter(sequelize);
const Army = defineArmy(sequelize);
const User = defineUser(sequelize);
let activePlayers = [1, 2, 3];

app.use(bodyParser.json());
app.use(cors());
app.post('/newUser', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const nouUser = await User.create({ username, password, email });
        const army = await Army.create({ userid: nouUser.id, unit1: 1, unit2: 2, unit3: 3, unit4: 4 });
        res.status(201).json(nouUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await User.findOne({ where: { email, password } });
        if (foundUser) {
            res.status(200).json(foundUser);
        } else {
            res.status(404).json({ error: 'User no trobat' });
        }
    } catch (error) {
        console.log(error);
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

app.get('/getOpponent/:id', async (req, res) => {
    try {
        const playerId = req.params.id;
        const player = await User.findOne({ where: { id: playerId } });
        console.log(player.username, 'busca oponent');
        if (!player) {
            res.status(404).json({ error: 'Player not found' });
            return;
        }
        const opponents = await User.findAll({ where: { id: { [Op.ne]: playerId } }, id: activePlayers }); 
        console.log('Oponents disponibles: ', opponents);
        if (!opponents) {
            res.status(404).json({ error: 'No opponents found' });
            return;
        }
        let closestOpponent = null;
        let minEloDiff = Infinity;
        opponents.forEach(op => {
            let eloDiff = Math.abs(player.elo - op.elo);
            if (eloDiff < minEloDiff) {
                minEloDiff = eloDiff;
                closestOpponent = op;
            }
        });
        res.status(200).json(closestOpponent);
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