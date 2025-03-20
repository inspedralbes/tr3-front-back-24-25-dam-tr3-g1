<template>
    <v-container>
        <v-form @submit.prevent="submitForm">
            <v-text-field
            label="Character Name"
            v-model="character.name"
            required
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

            <v-file-input
                label="Sprite"
                @change="onFileChange"
                accept=".zip"
                required
            ></v-file-input>

            <v-btn v-btn type="submit">Submit</v-btn>
        </v-form>
    </v-container>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createCharacter, createCharacterInOdoo } from '@/services/communicationManager'

const router = useRouter()

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
    health: 0
})

function submitForm() {
    const odooData = {
        name: character.value.name,
        type: 'consu',
        list_price: 1,
        standard_price: 1,
        categ_id: 1,
        uom_id: 1,
        uom_po_id: 1,
        description: `Weapon: ${character.value.weapon}, Distance: ${character.value.distance}, Winged: ${character.value.winged}`,
        barcode: Math.floor(Math.random() * 10000000000000).toString(),
        default_code: 'SP001',
        weight: 1.0,
        volume: 0.5
    };

    createCharacterInOdoo(odooData).then(res => {
        if (res.ok) {
            const odooCharacterId = res.id; // Obtén el ID del personaje creado en Odoo
            console.log('Character created in Odoo', res);
            character.value.id = odooCharacterId; // Asigna el ID de Odoo al personaje
            if(character.value.winged){
                character.value.winged = 1;
            }
            createCharacter(character.value).then(() => {
                router.push('/CharacterManager');
            });
        } else {
            console.error('Failed to create character in Odoo');
        }
    });
}

function onFileChange(event) {
    character.value.sprite = event.target.files[0];
}
</script>