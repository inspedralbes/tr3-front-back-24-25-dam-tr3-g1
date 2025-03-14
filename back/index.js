import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './models/index.js';
import { Op } from 'sequelize';
import defineCharacter from './models/character.js';
import defineArmy from './models/armies.js';
import cors from 'cors';
import defineUser from './models/users.js';
import path from 'path';
import extract from 'extract-zip';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Jimp } from 'jimp';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'Sprites');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Save with original name
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.startsWith('lpc')) {
            return cb(new Error('El sprite no comienza por lpc'), false);
        }
        cb(null, true);
    }
});

const app = express();
const port = 4000;

const Character = defineCharacter(sequelize);
const Army = defineArmy(sequelize);
const User = defineUser(sequelize);
let activePlayers = [1, 2, 3];

app.use(bodyParser.json());
app.use(cors());

app.use('/Sprites', express.static(path.join(__dirname, 'Sprites')));

app.post('/newUser', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const nouUser = await User.create({ username, password, email });
        await Army.create({ userid: nouUser.id, unit1: 1, unit2: 2, unit3: 3, unit4: 4 });
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
            console.log(foundUser)
            res.status(200).json(foundUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

app.post('/characters', upload.single('Sprite'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No sprite uploaded" });
    }

    const { name, weapon, vs_sword, vs_spear, vs_axe, vs_bow, vs_magic, winged, atk, movement, health, distance } = req.body;
    const spritePath = req.file.path;
    console.log(spritePath);

    try {
        // Extract ZIP
        const extractPath = path.join(__dirname, 'Sprites', name);
        await extract(spritePath, { dir: extractPath });

        // Eliminar el archivo ZIP después de la extracción
        await fs.promises.unlink(spritePath);

        console.log("#0");
        const customImagePath = `./Sprites/${name}/custom/walk_128.png`;
        const standardImagePath = `./Sprites/${name}/standard/walk.png`;

        let imagen;
        if (fs.existsSync(customImagePath)) {
            console.log('Custom image exists:', customImagePath);
            imagen = await Jimp.read(customImagePath);
        } else {
            console.log('Custom image does not exist:', customImagePath);
            imagen = await Jimp.read(standardImagePath);
        }

        // Dimensiones de cada sprite
        const spriteWidth = imagen.bitmap.width / 8;  // 8 columnas
        const spriteHeight = imagen.bitmap.height / 4; // 4 filas

        // Coordenadas para la tercera fila, primera columna
        const x = 0;
        const y = 2 * spriteHeight;

        // Recortar el sprite correcto
        const obj = { h: spriteHeight, w: spriteWidth, x, y };
        const sprite = imagen.crop(obj);

        console.log("#3");

        // Si es la imagen personalizada, escalar al doble de tamaño
        if (fs.existsSync(customImagePath)) {
            console.log('Escalando imagen personalizada');
            sprite.scale(2);
        }

        // Guardar el sprite final como icon.png
        await sprite.write(`./Sprites/${name}/icon.png`);
        console.log('Sprite recortado y guardado como icon.png');

        console.log("#5");

        // Guardar el personaje en la base de datos
        const newCharacter = await Character.create({ 
            name, weapon, vs_sword, vs_spear, vs_axe, vs_bow, vs_magic, distance, 
            winged, icon: `/Sprites/${name}/icon.png`, atk, movement, health, sprite: `/Sprites/${name}`         
        });

        res.status(201).json(newCharacter);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
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

            const characterSpritePath = path.join(__dirname, 'Sprites', character.name);
            fs.rmSync(characterSpritePath, { recursive: true, force: true });
            
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
        console.log(`Server listening at http://localhost:${port}`);
    } catch (error) {
        console.error('Could not connect to the database:', error);
    }
});