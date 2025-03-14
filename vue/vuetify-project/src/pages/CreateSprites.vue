<template>
    <v-container>
        <v-form>
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

            <v-file-input
                label="Sprite"
                @change="onFileChange"
                accept=".zip"
                :rules="[fileNameRule]"
                required
            ></v-file-input>

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

            <v-btn @click="submitForm" :disabled="!isFormValid">Submit</v-btn>
        </v-form>
    </v-container>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createCharacter } from '@/services/communicationManager'

const router = useRouter()

const fileNameRule = (value) => {
    return value && value.name.startsWith('ipc_') || 'File name must start with "ipc_"';
};

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
    createCharacter(character.value)
    router.push('/SpritesManager')
}

function onFileChange(event) {
    character.value.sprite = event.target.files[0];
}
const isFormValid = computed(() => {
    return character.value.name &&
           character.value.weapon &&
           character.value.vs_sword >= 0 &&
           character.value.vs_spear >= 0 &&
           character.value.vs_axe >= 0 &&
           character.value.vs_bow >= 0 &&
           character.value.vs_magic >= 0 &&
           character.value.distance >= 0 &&
           character.value.atk >= 0 &&
           character.value.movement >= 0 &&
           character.value.health >= 0 &&
           character.value.sprite;
});
</script>