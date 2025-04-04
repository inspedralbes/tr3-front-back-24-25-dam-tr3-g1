import { fr } from "vuetify/locale";

async function createUser(id, username, password, email) {
    const res = await fetch(`${import.meta.env.VITE_BACK_URL}/newUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, username, password, email }) // Incluye el ID de Odoo
    });
    return res;
}

async function loginUser(email, password) {
    const res = await fetch(`${import.meta.env.VITE_BACK_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    console.log(res);
    return res;
}

async function getUsersStatistics() {
    const res = await fetch(`${import.meta.env.VITE_BACK_URL}/usersStatistics`);
    return res.json();
}

async function createCharacter(characterData) {
    const formData = new FormData();
    formData.append('id', characterData.id);
    formData.append('name', characterData.name);
    formData.append('weapon', characterData.weapon);
    formData.append('vs_sword', characterData.vs_sword);
    formData.append('vs_spear', characterData.vs_spear);
    formData.append('vs_axe', characterData.vs_axe);
    formData.append('vs_bow', characterData.vs_bow);
    formData.append('vs_magic', characterData.vs_magic);
    if(characterData.winged === 'true' || characterData.winged === true || characterData.winged === 1) {
        formData.append('winged', 1);
    } else {
        formData.append('winged', 0);
    }
    formData.append('atk', characterData.atk);
    formData.append('movement', characterData.movement);
    formData.append('health', characterData.health);
    formData.append('distance', characterData.distance);
    formData.append('price', characterData.price);
    if (characterData.sprite instanceof File) {
        formData.append('Sprite', characterData.sprite);
    }

    console.log(formData);

    const response = await fetch(`${import.meta.env.VITE_BACK_URL}/characters`, {
        method: 'POST',
        body: formData
    });
    
    return response.json();
}

async function updateCharacter(id, characterData) {
    const response = await fetch(`${import.meta.env.VITE_BACK_URL}/characters/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(characterData)
    });
    return response.json();
}

async function deleteCharacter(id) {
    const res = await fetch(`${import.meta.env.VITE_BACK_URL}/characters/${id}`, {
        method: 'DELETE'
    });
    return res;
}

async function getCharacters() {
    const res = await fetch(`${import.meta.env.VITE_BACK_URL}/characters`);
    return res.json();
}

async function getCharacterById(id) {
    const response = await fetch(`${import.meta.env.VITE_BACK_URL}/characters/${id}`);
    return response.json();
}

async function updateArmy(id, armyData) {
    const response = await fetch(`${import.meta.env.VITE_BACK_URL}/armies/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(armyData)
    });
    return response.json();
}

async function getArmyById(id) {
    const response = await fetch(`${import.meta.env.VITE_BACK_URL}/armies/${id}`);
    return response.json();
}

// ODOO

async function createUserInOdoo(name, email) {
    const res = await fetch(`${import.meta.env.VITE_BACK_ODOO_URL}/create-client`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email }) // Usa 'name' en lugar de 'username'
    });

    if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
            return { ok: true, id: data[0].id }; // Asegúrate de que el ID se devuelve aquí
        } else {
            return { ok: false };
        }
    } else {
        return { ok: false };
    }
}

async function createCharacterInOdoo(characterData) {
    const res = await fetch(`${import.meta.env.VITE_BACK_ODOO_URL}/create-product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(characterData)
    });

    if (res.ok) {
        const data = await res.json();
        return { ok: true, id: data[0].id };
    } else {
        return { ok: false };
    }
}

export {
    createUser,
    loginUser,
    getUsersStatistics,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacters,
    getCharacterById,
    updateArmy,
    getArmyById,
    createUserInOdoo,
    createCharacterInOdoo
};