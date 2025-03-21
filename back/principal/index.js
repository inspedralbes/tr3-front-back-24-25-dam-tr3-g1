import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './models/index.js';
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
import dotenv from "dotenv";
import { WebSocketServer } from 'ws';

dotenv.config();

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
const port = process.env.PORT;

const Character = defineCharacter(sequelize);
const Army = defineArmy(sequelize);
const User = defineUser(sequelize);
let queue = [];
let games = {};

app.use(bodyParser.json());
app.use(cors());

app.use(cors({
    origin: 'http://localhost:5173' // Reemplaza con el origen de tu frontend
}));

app.use('/Sprites', express.static(path.join(__dirname, 'Sprites')));

// Create HTTP server and Socket.io server
const server = app.listen(port, async () => {
    try {
        await sequelize.sync();
        console.log(`Server listening at http://localhost:${port}`);
    } catch (error) {
        console.error('Could not connect to the database:', error);
    }
});


const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('A user connected');    
    ws.on('message', async (message) => {
        const data = JSON.parse(message);

        if (data.type === 'joinQueue') {
            const { userId } = data;
            console.log('User', userId, 'joined the queue');
            ws.send(JSON.stringify({ type: 'queueJoined' }));
            try {
                const user = await User.findByPk(userId);
                if (!user) {
                    ws.send(JSON.stringify({ type: 'error', message: 'Usuari no trobat' }));
                    return;
                }

                queue.push({ ws, elo: user.elo, userId: user.id });
                console.log('Queue: ', queue);

                let bestMatch = null;
                let bestDiff = Infinity;

                for (let i = 0; i < queue.length - 1; i++) {
                    const p1 = queue[i];
                    const p2 = queue[queue.length - 1];

                    const eloDiff = Math.abs(p1.elo - p2.elo);
                    if (eloDiff < bestDiff) {
                        bestDiff = eloDiff;
                        bestMatch = { player1: p1, player2: p2 };
                    }
                }

                if (bestMatch) {
                    queue = queue.filter(p => p !== bestMatch.player1 && p !== bestMatch.player2);
                    console.log('Match found:', bestMatch.player1.userId, 'vs', bestMatch.player2.userId);
                    const room = `match_${bestMatch.player1.ws._socket.remoteAddress}_${bestMatch.player2.ws._socket.remoteAddress}`;
                    bestMatch.player1.ws.room = room;
                    bestMatch.player2.ws.room = room;

                    games[room] = {
                        players: [bestMatch.player1.ws, bestMatch.player2.ws],
                        turn: bestMatch.player1.ws,
                    };
                    const player1User = await User.findByPk(bestMatch.player1.userId);
                    const player2User = await User.findByPk(bestMatch.player2.userId);

                    bestMatch.player1.ws.send(JSON.stringify({ type: 'matchFound', room, players: [player1User, player2User] }));
                    bestMatch.player2.ws.send(JSON.stringify({ type: 'matchFound', room, players: [player1User, player2User] }));
                    
                    console.log(`Partida creada: ${bestMatch.player1.userId} vs ${bestMatch.player2.userId} a la sala ${room}`);
                }
            } catch (error) {
                console.error("Error en matchmaking:", error);
            }
        } else if (data.type === 'makeMove') {
            const { room, move } = data;
            console.log('Move received:', move);
            if (games[room] && games[room].turn === ws) {
                games[room].players.forEach(player => {
                    if (player !== ws) {
                        player.send(JSON.stringify({ type: 'opponentMove', move }));
                    }
                });

                games[room].turn = games[room].players.find(p => p !== ws);

                games[room].players.forEach(player => {
                    player.send(JSON.stringify({ type: 'turnUpdate', currentTurn: games[room].turn._socket.remoteAddress }));
                });
            }
        }
    });

    ws.on('close', () => {
        queue = queue.filter((player) => player.ws !== ws);

        Object.keys(games).forEach((room) => {
            if (games[room].players.includes(ws)) {
                games[room].players.forEach(player => {
                    if (player !== ws) {
                        player.send(JSON.stringify({ type: 'gameOver', reason: 'opponentDisconnected' }));
                    }
                });
                delete games[room];
            }
        });

        console.log('User disconnected');
    });
});

app.post('/newUser', async (req, res) => {
    const { id, username, password, email } = req.body;
    try {
        const nouUser = await User.create({ id, username, password, email }); // Usa el ID de Odoo
        const Armys = await Army.findAll();
        if (Armys.length > 0) {
            await Army.create({ userid: nouUser.id, unit1: 1, unit2: 2, unit3: 3, unit4: 4 });
        }
        res.status(201).json(nouUser);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
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

    const { id, name, weapon, vs_sword, vs_spear, vs_axe, vs_bow, vs_magic, winged, atk, movement, health, distance } = req.body;
    console.log("DD", req.body);
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

        await sprite.autocrop();

        await sprite.write(`./Sprites/${name}/icon.png`);

        // // Si es la imagen personalizada, escalar al doble de tamaño
        // if (fs.existsSync(customImagePath)) {
        //     await sprite.scale(3).write(`./Sprites/${name}/icon.png`);
        //     console.log('Sprite escalado recortado y guardado como icon.png');
        // }
        // else{
        //     await sprite.write(`./Sprites/${name}/icon.png`);
        //     console.log('Sprite recortado y guardado como icon.png');
        // }

        console.log("#5");

        // Guardar el personaje en la base de datos
        const newCharacter = await Character.create({
            id, name, weapon, vs_sword, vs_spear, vs_axe, vs_bow, vs_magic, distance,
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
            const oldSpritePath = path.join(__dirname, 'Sprites', character.name);
            const newSpritePath = path.join(__dirname, 'Sprites', name);
            const newIconPath = path.join(__dirname, 'Sprites', name, 'icon.png');

            console.log('oldSpritePath:', oldSpritePath);
            console.log('newSpritePath:', newSpritePath);

            if (fs.existsSync(oldSpritePath)) {
                fs.renameSync(oldSpritePath, newSpritePath);
            }
            await character.update({ name, weapon, vs_sword, vs_spear, vs_axe, vs_bow, vs_magic, winged, sprite: `/Sprites/${name}`, icon: `/Sprites/${name}/icon.png`, atk, movement, health });
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