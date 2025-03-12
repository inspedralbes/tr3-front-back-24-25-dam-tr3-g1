<template>
  <v-app-bar :elevation="0">
    <template v-slot:prepend>
    </template>

    <v-app-bar-title>Lorem Ipsum</v-app-bar-title>

    <v-tabs>
      <v-tab to="/">Inici</v-tab>
      <v-tab>Descarrega</v-tab>
      <v-tab>Estadístiques</v-tab>
      <v-tab v-if="logueao" to="/SpritesManager">Afegir Sprites</v-tab>
      <v-tab v-if="!logueao" to="/login">Login</v-tab>
      <v-tab v-if="logueao" @click="logout()">Hola, {{ userName }} // Tancar Sesió</v-tab>
    </v-tabs>
  </v-app-bar>
  <v-main>
    <router-view />
  </v-main>

</template>

<script setup>
import router from '@/router';
import { useAppStore } from '@/stores/app.js'
import { storeToRefs } from 'pinia'

const logueao = ref(false);

const store = useAppStore();

const { user } = storeToRefs(store);

const userName = ref(user.value ? user.value.username : null);

function logout() {
  store.user = null;
  logueao.value = false;
  router.push('/');
}

watch(() => user.value, (newValue) => {
  userName.value = newValue ? newValue.username : null;
});

console.log(logueao.value);
watch(() => storeToRefs(store).user.value, (newValue) => {
  if (newValue != null) {
    console.log("User is logged in");
    logueao.value = true;
  } else {
    logueao.value = false;
  }
}, { immediate: true });
</script>
