import express from "express";
import bodyParser from "body-parser";
import sequelize from "./models/index.js";
import { Op } from "sequelize";
import defineCharacter from "./models/character.js";
import defineArmy from "./models/armies.js";
import cors from "cors";
import defineUser from "./models/users.js";
import defineInventory from "./models/Inventory.js";
import path from "path";
import extract from "extract-zip";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Jimp } from "jimp";
import fs from "fs";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "Sprites");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save with original name
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.startsWith("lpc")) {
      return cb(new Error("El sprite no comienza por lpc"), false);
    }
    cb(null, true);
  },
});

const uploadAA = multer({ dest: 'AssetBundles/' });

const app = express();
const port = process.env.PORT;

const Character = defineCharacter(sequelize);
const Army = defineArmy(sequelize);
const User = defineUser(sequelize);
const Inventory = defineInventory(sequelize);
let activePlayers = [1, 2, 3];

app.use(bodyParser.json());
app.use(cors());

app.use(
  cors({
    origin: "*", // Permitir acceso desde cualquier origen
  })
);

app.use("/Sprites", express.static(path.join(__dirname, "Sprites")));

app.post("/newUser", async (req, res) => {
  const { id, username, password, email } = req.body;
  try {
    const nouUser = await User.create({ id, username, password, email }); // Usa el ID de Odoo
    const Armys = await Army.findAll();
    if (Armys.length > 0) {
      await Army.create({
        userid: nouUser.id,
        unit1: 1,
        unit2: 2,
        unit3: 3,
        unit4: 4,
      });
    }
    res.status(201).json(nouUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ where: { email, password } });
    if (foundUser) {
      console.log(foundUser);
      res.status(200).json(foundUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/characters", upload.single("Sprite"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No sprite uploaded" });
  }

  const {
    id,
    name,
    weapon,
    vs_sword,
    vs_spear,
    vs_axe,
    vs_bow,
    vs_magic,
    winged,
    atk,
    movement,
    health,
    distance,
    price,
  } = req.body;
  console.log("DD", req.body);
  const spritePath = req.file.path;
  console.log(spritePath);

  try {
    // Extract ZIP
    const extractPath = path.join(__dirname, "Sprites", name);
    await extract(spritePath, { dir: extractPath });

    // Eliminar el archivo ZIP después de la extracción
    await fs.promises.unlink(spritePath);

    console.log("#0");
    const customImagePath = `./Sprites/${name}/custom/walk_128.png`;
    const standardImagePath = `./Sprites/${name}/standard/walk.png`;

    let imagen;
    if (fs.existsSync(customImagePath)) {
      console.log("Custom image exists:", customImagePath);
      imagen = await Jimp.read(customImagePath);
    } else {
      console.log("Custom image does not exist:", customImagePath);
      imagen = await Jimp.read(standardImagePath);
    }

    // Dimensiones de cada sprite
    const spriteWidth = imagen.bitmap.width / 8; // 8 columnas
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
      id,
      name,
      weapon,
      vs_sword,
      vs_spear,
      vs_axe,
      vs_bow,
      vs_magic,
      distance,
      winged,
      icon: `/Sprites/${name}/icon.png`,
      atk,
      movement,
      health,
      sprite: `/Sprites/${name}`,
      price,
    });

    res.status(201).json(newCharacter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/characters/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    weapon,
    vs_sword,
    vs_spear,
    vs_axe,
    vs_bow,
    vs_magic,
    winged,
    sprite,
    icon,
    atk,
    movement,
    health,
  } = req.body;
  try {
    const character = await Character.findByPk(id);
    if (character) {
      const oldSpritePath = path.join(__dirname, "Sprites", character.name);
      const newSpritePath = path.join(__dirname, "Sprites", name);
      const newIconPath = path.join(__dirname, "Sprites", name, "icon.png");

      console.log("oldSpritePath:", oldSpritePath);
      console.log("newSpritePath:", newSpritePath);

      if (fs.existsSync(oldSpritePath)) {
        fs.renameSync(oldSpritePath, newSpritePath);
      }
      await character.update({
        name,
        weapon,
        vs_sword,
        vs_spear,
        vs_axe,
        vs_bow,
        vs_magic,
        winged,
        sprite: `/Sprites/${name}`,
        icon: `/Sprites/${name}/icon.png`,
        atk,
        movement,
        health,
      });
      res.status(200).json(character);
    } else {
      res.status(404).json({ error: "Character not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/characters/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const character = await Character.findByPk(id);
    if (character) {
      await character.destroy();

      const characterSpritePath = path.join(
        __dirname,
        "Sprites",
        character.name
      );
      fs.rmSync(characterSpritePath, { recursive: true, force: true });

      res.status(204).send({ message: "Character deleted" });
    } else {
      res.status(404).json({ error: "Character not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/characters", async (req, res) => {
  try {
    const characters = await Character.findAll();
    res.status(200).json(characters);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/characters/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const character = await Character.findByPk(id);
    if (character) {
      res.status(200).json(character);
    } else {
      res.status(404).json({ error: "Character not found" });
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

app.put("/armies/:id", async (req, res) => {
  const { id } = req.params;
  const { unit1, unit2, unit3, unit4 } = req.body;
  try {
    const army = await Army.findByPk(id);
    if (army) {
      await army.update({ unit1, unit2, unit3, unit4 });
      res.status(200).json(army);
    } else {
      res.status(404).json({ error: "Army not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/armies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const army = await Army.findByPk(id);
    if (army) {
      res.status(200).json(army);
    } else {
      res.status(404).json({ error: "Army not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/getOpponent/:id", async (req, res) => {
  try {
    const playerId = req.params.id;
    const player = await User.findOne({ where: { id: playerId } });
    console.log(player.username, "busca oponent");
    if (!player) {
      res.status(404).json({ error: "Player not found" });
      return;
    }
    const opponents = await User.findAll({
      where: { id: { [Op.ne]: playerId } },
      id: activePlayers,
    });
    console.log("Oponents disponibles: ", opponents);
    if (!opponents) {
      res.status(404).json({ error: "No opponents found" });
      return;
    }
    let closestOpponent = null;
    let minEloDiff = Infinity;
    opponents.forEach((op) => {
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

app.post("/buyCharacter", async (req, res) => {
  const { id_user, id_character } = req.body;
  try {
    const user = await User.findByPk(id_user);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const character = await Character.findByPk(id_character);
    if (!character) {
      res.status(404).json({ error: "Character not found" });
      return;
    }
    if (character.price > user.points) {
      res.status(400).json({ error: "Not enough points" });
      return;
    } else {
      const existingInventory = await Inventory.findOne({
        where: { id_user: user.id, id_character: character.id },
      });

      if (!existingInventory) {
        await Inventory.create({ id_user, id_character });
        user.points -= character.price;
        await user.save();
        

        const odooUrl = process.env.ODOO_URL;
        const orderData = JSON.stringify({
          partner_id: user.id,
          order_line: [
            [
              0,
              0,
              {
                product_id: character.id,
                product_uom_qty: 1,
                price_unit: character.price,
              },
            ],
          ],
          note: "This is a test order",
        });
        console.log("aqui deberia de salir el contenido---------------->");
        console.log(orderData);
        if (odooUrl) {
          console.log(
            "IF ODOO URL =>>>>>>> aqui deberia de salir el contenido---------------->"
          );

          try {
            const response = await axios.post("http://host.docker.internal:4001/create-order", orderData, {
              headers: {
              "Content-Type": "application/json",
              },
            });
            console.log("Order created:", response.data);
            res.status(201).json({ message: "Character bought successfully" });
          } catch (error) {
            console.error("There was a problem with the axios operation:", error);
            res.status(500).json({ error: "Error creating order" });
          }

          console.log("Afterfetch... ");
        }
      } else {
        res.status(400).json({ error: "Character already owned" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/getCharactersNotOwned/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const charactersOwned = Inventory.findAll({
      where: { id_user: user.id },
    });
    const characterIds = (await charactersOwned).map((inventory) => inventory.id_character);
    const charactersNotOwned = await Character.findAll({
      where: { id: { [Op.notIn]: characterIds } },
    });
    console.log("charactersNotOwned",charactersNotOwned);
  
    res.status(200).json(charactersNotOwned);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/getCharactersOwned/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const charactersOwned = Inventory.findAll({
      where: { id_user: user.id },
    });
    const characterIds = (await charactersOwned).map((inventory) => inventory.id_character);
    const ownedCharacters = await Character.findAll({
      where: { id: characterIds },
    });
    res.status(200).json(ownedCharacters);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/sprites", async (req, res) => {
  try {
    const spritesDir = path.join(__dirname, "Sprites");
    const spriteFolders = await fs.promises.readdir(spritesDir, { withFileTypes: true });
    const spriteLists = [];

    for (const folder of spriteFolders) {
      if (folder.isDirectory()) {
        const folderData = { name: folder.name, rutas: [] };
        const standardDir = path.join(spritesDir, folder.name, "standard");
        const customDir = path.join(spritesDir, folder.name, "custom");

        if (fs.existsSync(standardDir)) {
          const standardFiles = await fs.promises.readdir(standardDir);
          standardFiles
            .filter((file) => file.endsWith(".png"))
            .forEach((file) => folderData.rutas.push(`${process.env.LINK_SPRITES}/Sprites/${folder.name}/standard/${file}`));
        }

        if (fs.existsSync(customDir)) {
          const customFiles = await fs.promises.readdir(customDir);
          customFiles
            .filter((file) => file.endsWith(".png"))
            .forEach((file) => folderData.rutas.push(`${process.env.LINK_SPRITES}/Sprites/${folder.name}/custom/${file}`));
        }

        spriteLists.push(folderData);
      }
    }

    res.status(200).json({ spriteLists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/AssetBundles", (req, res) => {
  const filePath = path.join(__dirname, "AssetBundles", "allprefabs");
  if (fs.existsSync(filePath)) {
    res.download(filePath, "allprefabs", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Error downloading file" });
      }
    });
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

app.post("/AssetBundles", uploadAA.single("allprefabs"), async (req, res) => {
  if (!req.file || !req.file.path) {
    console.error("File upload failed. req.file is undefined.");
    return res.status(400).json({ error: "No AssetBundle uploaded or invalid file" });
  }

  const assetBundlePath = req.file.path;
  const destinationPath = path.join(__dirname, "AssetBundles", "allprefabs");

  try {
    if (!fs.existsSync(path.join(__dirname, "AssetBundles"))) {
      fs.mkdirSync(path.join(__dirname, "AssetBundles"), { recursive: true });
    }

    await fs.promises.rename(assetBundlePath, destinationPath);
    res.status(201).json({ message: "AssetBundle uploaded successfully" });
  } catch (error) {
    console.error("Error moving file:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, async () => {
  try {
    await sequelize.sync();
    console.log(`Server listening at http://localhost:${port}`);
  } catch (error) {
    console.error("Could not connect to the database:", error);
  }
});
