<template>
  <v-app-bar :elevation="0">
    <template v-slot:prepend>
      </template>

    <v-app-bar-title>Emblema de fuego destinos: conquista</v-app-bar-title>

    <v-tabs>
      <v-tab>Descarrega</v-tab>
      <v-tab>Estadístiques</v-tab>
      <v-tab>Canviar exercit</v-tab>
    </v-tabs>
  </v-app-bar>
  <v-main>
    <router-view />
  </v-main>

</template>

<script setup>
  //
</script>
