USE game;

-- Insertar usuarios
INSERT INTO USERS (NAME, EMAIL, PASSWORD, ELO, VICTORIES, DEFEATS, ARMYID) VALUES
('Alice', 'alice@example.com', 'hashedpassword1', 1200, 5, 2, NULL),
('Bob', 'bob@example.com', 'hashedpassword2', 1100, 3, 4, NULL),
('Charlie', 'charlie@example.com', 'hashedpassword3', 1300, 10, 1, NULL);

-- Insertar personajes
INSERT INTO CHARACTERS (NAME, WEAPON, VS_SWORD, VS_SPEAR, VS_AXE, VS_BOW, VS_MAGIC, WINGED, SPRITE, ATK, MOVEMENT, HEALTH) VALUES
('Knight', 'SWORD', 1.2, 0.8, 1.0, 0.5, 0.3, FALSE, 'knight.png', 50, 3, 100),
('Archer', 'BOW', 0.5, 0.6, 0.7, 1.5, 0.4, FALSE, 'archer.png', 40, 4, 80),
('Mage', 'MAGIC', 0.3, 0.5, 0.6, 0.7, 1.8, FALSE, 'mage.png', 60, 2, 70),
('Spearman', 'SPEAR', 0.8, 1.2, 0.9, 0.4, 0.2, FALSE, 'spearman.png', 45, 3, 90);

-- Insertar ejércitos
INSERT INTO ARMIES (USERID, CHARACTER1, CHARACTER2, CHARACTER3, CHARACTER4) VALUES
(1, 1, 2, 3, NULL),
(2, 2, 3, 4, NULL),
(3, 1, 3, 4, 2);

-- Ahora que ARMIES tiene datos, actualizar ARMYID en USERS
UPDATE USERS SET ARMYID = (SELECT ID FROM ARMIES WHERE USERID = 1) WHERE ID = 1;
UPDATE USERS SET ARMYID = (SELECT ID FROM ARMIES WHERE USERID = 2) WHERE ID = 2;
UPDATE USERS SET ARMYID = (SELECT ID FROM ARMIES WHERE USERID = 3) WHERE ID = 3;