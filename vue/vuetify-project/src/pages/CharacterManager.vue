<template>
    <div>
      <h1>Gestor d'Exèrcit</h1>
  
      <div class="scroll-picker">
        <v-card>
          <v-card-title>
            <h2>Unitats</h2>
          </v-card-title>
          <v-card-text>
            <v-btn class="new-unit-btn" to="/CreateCharacter">Nova unitat</v-btn>
            <v-simple-table class="styled-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Imatge</th>
                  <th>Arma</th>
                  <th>Alat</th>
                  <th>Salut</th>
                  <th>Atac</th>
                  <th>Moviment</th>
                  <th>Distance</th>
                  <th>Resistència a Espases</th>
                  <th>Resistència a Destral</th>
                  <th>Resistència a Llances</th>
                  <th>Resistència a Arcs</th>
                  <th>Resistència a Màgia</th>
                  <th>Preu</th>
                  <th>Accions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="unit in units" :key="unit.id">
                  <td>{{ unit.name }}</td>
                  <td><img :src="'http://localhost:4000' + unit.icon" alt="imatge unitat"></td>
                  <td>{{ unit.weapon }}</td>
                  <td>{{ unit.winged ? 'Sí' : 'No' }}</td>
                  <td>{{ unit.health }}</td>
                  <td>{{ unit.atk }}</td>
                  <td>{{ unit.movement }}</td>
                  <td>{{ unit.distance }}</td>
                  <td>{{ unit.vs_sword }}</td>
                  <td>{{ unit.vs_axe }}</td>
                  <td>{{ unit.vs_spear }}</td>
                  <td>{{ unit.vs_bow }}</td>
                  <td>{{ unit.vs_magic }}</td>
                  <td>{{ unit.price }}</td>
                  <td>
                    <v-btn @click="editUnit(unit.id)" class="action-btn">Editar</v-btn>
                    <v-btn @click="deleteUnitInDB(unit.id)" class="action-btn">Eliminar</v-btn>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { getCharacters, deleteCharacter } from '@/services/communicationManager'
  
  const router = useRouter()
  const units = ref([])
  
  onMounted(() => {
    infoCharacters()
  })
  
  function infoCharacters() {
    getCharacters()
      .then(data => {
        units.value = data
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  function editUnit(id) {
    router.push(`/EditCharacter/${id}`)
  }
  
  function deleteUnitInDB(id) {
    deleteCharacter(id)
    infoCharacters()
    console.log('Deleting unit with ID:', id)
  }
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }
  
  .scroll-picker {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  
  v-card {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: #fff;
  }
  
  v-card-title h2 {
    margin: 0;
    font-size: 1.8rem;
    text-align: center;
    color: #007BFF;
  }
  
  .new-unit-btn {
    margin-bottom: 20px;
    background-color: #28a745;
    color: white;
  }
  
  .styled-table {
    margin-top: 20px;
    border-collapse: collapse;
    width: 100%;
  }
  
  .styled-table th, .styled-table td {
    padding: 12px;
    text-align: center;
    border: 1px solid #ddd;
  }
  
  .styled-table th {
    background-color: #007BFF;
    color: white;
    font-weight: bold;
  }
  
  .styled-table tbody tr {
    transition: background-color 0.3s;
  }
  
  .styled-table tbody tr:hover {
    background-color: #f1f1f1;
  }
  
  .styled-table img {
    max-width: 50px;
    max-height: 50px;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .action-btn {
    margin: 5px;
    background-color: #007BFF;
    color: white;
  }
  
  .action-btn:hover {
    background-color: #0056b3;
  }
  </style>