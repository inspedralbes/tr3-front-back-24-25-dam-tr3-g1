<template>
    <v-container>
        <v-form @submit.prevent="submitForm">
            <v-text-field
            label="Character Name"
            v-model="character.name"
            required
            @input="character.name = character.name.replace(/\s/g, '')"
            ></v-text-field>
            
            <v-select
            label="Weapon"
            v-model="character.weapon"
            :items="['SWORD', 'SPEAR', 'AXE', 'BOW', 'MAGIC']"
            required
            ></v-select>

            <v-text-field
            label="VS Sword"
            v-model="character.vs_sword"
            type="number"
            required
            ></v-text-field>

            <v-text-field
            label="VS Spear"
            v-model="character.vs_spear"
            type="number"
            required
            ></v-text-field>

            <v-text-field
            label="VS Axe"
            v-model="character.vs_axe"
            type="number"
            required
            ></v-text-field>

            <v-text-field
            label="VS Bow"
            v-model="character.vs_bow"
            type="number"
            required
            ></v-text-field>

            <v-text-field
            label="VS Magic"
            v-model="character.vs_magic"
            type="number"
            required
            ></v-text-field>

            <v-text-field
            label="Distance"
            v-model="character.distance"
            type="number"
            required
            ></v-text-field>

            <v-checkbox
            label="Winged"
            v-model="character.winged"
            ></v-checkbox>

            <v-text-field
            label="Attack"
            v-model="character.atk"
            type="number"
            required
            ></v-text-field>

            <v-text-field
            label="Movement"
            v-model="character.movement"
            type="number"
            required
            ></v-text-field>

            <v-text-field
            label="Health"
            v-model="character.health"
            type="number"
            required
            ></v-text-field>
            <v-text-field
                label="Price"
                v-model="character.price"
                type="number"
                required
            ></v-text-field>
            <v-file-input
                label="Sprite"
                @change="onFileChange"
                accept=".zip"
                required
            ></v-file-input>
            <p v-if="errorMessage" class="text-red mt-2">{{ errorMessage }}</p>
            <v-btn v-btn type="submit">Submit</v-btn>
        </v-form>
    </v-container>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createCharacter, createCharacterInOdoo, getCharacters } from '@/services/communicationManager'

const router = useRouter()

const errorMessage = ref('')

const character = ref({
    name: '',
    weapon: '',
    vs_sword: 0,
    vs_spear: 0,
    vs_axe: 0,
    vs_bow: 0,
    vs_magic: 0,
    distance: 0,
    winged: false,
    atk: 0,
    movement: 0,
    health: 0,
    price: 0,
})

async function submitForm() {
    const characters = await getCharacters();
    
    const nameExists = characters.some(char => char.name.toLowerCase() === character.value.name.toLowerCase());

    if (nameExists) {
        errorMessage.value = "Nom de personatge ja existent";
        return;
    }

    // Datos para Odoo
    const odooData = {
        name: character.value.name,
        type: 'consu',
        list_price: character.value.price,
        standard_price: character.value.price,
        categ_id: 1,
        uom_id: 1,
        uom_po_id: 1,
        description: `Weapon: ${character.value.weapon}, Distance: ${character.value.distance}, Winged: ${character.value.winged}`,
        barcode: Math.floor(Math.random() * 10000000000000).toString(),
        default_code: 'SP001',
        weight: 1.0,
        volume: 0.5
    };

    const res = await createCharacterInOdoo(odooData);
    
    if (res.ok) {
        const odooCharacterId = res.id;
        character.value.id = odooCharacterId;

        character.value.winged = character.value.winged ? 1 : 0;

        await createCharacter(character.value);
        router.push('/CharacterManager');
    } else {
        console.error('Failed to create character in Odoo');
    }
}

function onFileChange(event) {
    character.value.sprite = event.target.files[0];
}
</script>