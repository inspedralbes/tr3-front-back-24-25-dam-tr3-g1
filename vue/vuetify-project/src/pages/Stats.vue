<template>
    <div>
      <div class="scroll-picker">
        <v-card>
          <v-card-title>
            <h2>Ranking</h2>
          </v-card-title>
          <v-card-text>
            <v-simple-table class="styled-table">
              <thead>
                <tr>
                  <th>Posició</th>
                  <th>Nom d'usuari</th>
                  <th>Puntuació</th>
                  <th>Victòries</th>
                  <th>Derrotes</th>
                  <th>ELO</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.position">
                  <td>{{ user.position }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.points }}</td>
                  <td>{{ user.victories }}</td>
                  <td>{{ user.defeats }}</td>
                  <td>{{ user.elo }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <div>
      <h1>Graphics</h1>
      <div class="graphics-container">
      <v-card class="graphic-card">
        <v-img :src="`${url}/Statistics/top_20_victories.png`" aspect-ratio="1.5" style="margin: 20px;"></v-img>
      </v-card>
      <v-card class="graphic-card">
        <v-img :src="`${url}/Statistics/top_20_atk_characters.png`" aspect-ratio="1.5" style="margin: 20px;"></v-img>
      </v-card>
      <v-card class="graphic-card">
        <v-img :src="`${url}/Statistics/top_5_most_popular_character.png`" aspect-ratio="1.5" style="margin: 20px;"></v-img>
      </v-card>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { getUsersStatistics } from '@/services/communicationManager'
  
  const users = ref([])
  const url = import.meta.env.VITE_BACK_URL
  
  onMounted(() => {
    infoUsers()
  })
  
  function infoUsers() {
    getUsersStatistics()
      .then(data => {
        data.sort((a, b) => b.points - a.points);

        users.value = data.map((user, index) => ({
          position: index + 1,
          name: user.username,
          email: user.email,
          points: user.points,
          victories: user.victories,
          defeats: user.defeats,
          elo: user.elo
        }));
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #ffffff;
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

  .graphic-card {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: #fff;
    margin-bottom: 20px;
  }
  </style>