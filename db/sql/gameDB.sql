INSERT INTO USERS (id, username, email, password) VALUES
(1, 'Alice', 'alice@example.com', 'hashedpassword1'),
(2, 'Bob', 'bob@example.com', 'hashedpassword2'),
(3, 'Charlie', 'charlie@example.com', 'hashedpassword3');

INSERT INTO CHARACTERS (id, name, weapon, vs_sword, vs_spear, vs_axe, vs_bow, vs_magic, distance, winged, sprite, icon, atk, movement, health) VALUES
(1, 'Julian', 'SWORD', 1.2, 0.8, 1.0, 0.5, 0.3, 1, FALSE, '/sprites/Julian', 'julian.png', 50, 3, 100),
(2, 'Juan', 'BOW', 0.5, 0.6, 0.7, 1.5, 0.4, 2,FALSE, '/sprites/Juan', 'juan.png', 40, 4, 80),
(3, 'Clemente', 'MAGIC', 0.3, 0.5, 0.6, 0.7, 1.8, 3,FALSE, '/sprites/Clemente', 'clemente.png', 60, 2, 70),
(4, 'Alfonso', 'SPEAR', 0.8, 1.2, 0.9, 0.4, 0.2, 4,FALSE, '/sprites/Alfonso', 'alfonso.png', 45, 3, 90);

INSERT INTO ARMIES (userid, unit1, unit2, unit3, unit4) VALUES
(1, 1, 2, 3, 4),
(2, 1, 2, 3, 4),
(3, 1, 2, 3, 4);
