<template>
    <v-container>
        <v-form @submit.prevent="updateCharacterInVue">
            <v-text-field v-model="character.name" label="Name" required></v-text-field>
            <v-select v-model="character.weapon" :items="weapons" label="Weapon" required></v-select>
            <v-text-field v-model="character.atk" label="Attack" type="number" required></v-text-field>
            <v-text-field v-model="character.movement" label="Movement" type="number" required></v-text-field>
            <v-text-field v-model="character.health" label="Health" type="number" required></v-text-field>
            <v-text-field v-model="character.vs_sword" label="Vs Sword" type="number" required></v-text-field>
            <v-text-field v-model="character.vs_spear" label="Vs Spear" type="number" required></v-text-field>
            <v-text-field v-model="character.vs_axe" label="Vs Axe" type="number" required></v-text-field>
            <v-text-field v-model="character.vs_bow" label="Vs Bow" type="number" required></v-text-field>
            <v-text-field v-model="character.vs_magic" label="Vs Magic" type="number" required></v-text-field>
            <v-text-field v-model="character.distance" label="Distance" type="number" required></v-text-field>
            <v-checkbox v-model="character.winged" label="Winged"></v-checkbox>
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