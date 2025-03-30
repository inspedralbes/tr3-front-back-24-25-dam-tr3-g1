<template>
    <v-container>
        <v-form @submit.prevent="updateCharacterInVue">
            <v-text-field
              label="Character Name"
              v-model="character.name"
              readonly
            ></v-text-field>

            <v-select
              label="Weapon"
              v-model="character.weapon"
              :items="weapons"
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
            <v-btn type="submit" color="primary">Save</v-btn>
        </v-form>
    </v-container>
  </template>
  
<script>
  import router from '@/router';
import { updateCharacter, getCharacterById } from '@/services/communicationManager';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  export default {
    setup() {
      const route = useRoute();
      const character = ref({
        name: '',
        weapon: '',
        sprite: '',
        icon: '',
        atk: 0,
        movement: 0,
        health: 0,
        vs_sword: 0,
        vs_spear: 0,
        vs_axe: 0,
        vs_bow: 0,
        vs_magic: 0,
        distance: 0,
        winged: false
      });
  
      const weapons = ['Sword', 'Bow', 'Axe', 'Spear'];
  
      async function fetchCharacter(id) {
        const data = await getCharacterById(id);
        Object.assign(character.value, data);
      }
  
      async function updateCharacterInVue() {
        const id = route.params.id;
        await updateCharacter(id, character.value);
        console.log('Character updated:', character.value);
        router.push('/CharacterManager');
      }
  
      onMounted(() => {
        fetchCharacter(route.params.id);
      });
  
      return {
        character,
        weapons,
        updateCharacterInVue
      };
    }
  };
  </script>