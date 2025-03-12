async function createUser(username, password, email) {
    const res = await fetch(`http://localhost:4000/newUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
    });
    console.log(res);
    return res;
}

async function loginUser(email, password) {
    const res = await fetch(`http://localhost:4000/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    console.log(res);
    return res;
}

async function createCharacter(characterData) {
    const response = await fetch(`http://localhost:4000/characters`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(characterData)
    });
    return response.json();
}

async function updateCharacter(id, characterData) {
    const response = await fetch(`http://localhost:4000/characters/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(characterData)
    });
    return response.json();
}

async function deleteCharacter(id) {
    const res = await fetch(`http://localhost:4000/characters/${id}`, {
        method: 'DELETE'
    });
    return res;
}

async function getCharacters() {
    const res = await fetch(`http://localhost:4000/characters`);
    return res.json();
}

async function getCharacterById(id) {
    const response = await fetch(`http://localhost:4000/characters/${id}`);
    return response.json();
}

async function updateArmy(id, armyData) {
    const response = await fetch(`http://localhost:4000/armies/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(armyData)
    });
    return response.json();
}

async function getArmyById(id) {
    const response = await fetch(`http://localhost:4000/armies/${id}`);
    return response.json();
}

export {
    createUser,
    loginUser,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacters,
    getCharacterById,
    updateArmy,
    getArmyById
};