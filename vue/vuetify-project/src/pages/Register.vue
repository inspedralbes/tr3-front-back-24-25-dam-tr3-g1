<template>
    <v-card class="mx-auto my-12" max-width="400">
        <v-card-title>
            Registrar-se
        </v-card-title>
        <v-card-text>
            <form>
                <v-text-field v-model="state.username" :error-messages="v$.username.$errors.map(e => e.$message)"
                    label="Nom d'usuari" required></v-text-field>

                <v-text-field v-model="state.email" :error-messages="v$.email.$errors.map(e => e.$message)"
                    label="Correu electrònic" required></v-text-field>

                <v-text-field v-model="state.password" :error-messages="v$.password.$errors.map(e => e.$message)"
                    label="Contrasenya" type="password" required></v-text-field>

                <v-text-field v-model="state.confirmPassword"
                    :error-messages="v$.confirmPassword.$errors.map(e => e.$message)" label="Confirmar Contrasenya"
                    type="password" required></v-text-field>

                <v-btn class="me-4" @click="register">
                    Registrar-se
                </v-btn>
                <p v-if="errorMessage" class="text-red mt-2">{{ errorMessage }}</p>
            </form>
            <v-card-actions>
                <router-link to="/login">Ja tens un compte? Inicia sessió</router-link>
            </v-card-actions>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useRouter } from 'vue-router'
import { required, email, sameAs } from '@vuelidate/validators'
import { useAppStore } from '@/stores/app.js'
import { createUser, createUserInOdoo, getUsersStatistics } from '@/services/communicationManager'

const initialState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
}

const appStore = useAppStore()
const errorMessage = ref('')

const state = reactive({
    ...initialState,
})

const rules = {
    username: { required },
    email: { required, email },
    password: { required },
    confirmPassword: { required },
}

const v$ = useVuelidate(rules, state)
const router = useRouter()

async function register() {

    const users = await getUsersStatistics();
    const userExists = users.find(user => user.username === state.username);
    if (userExists) {
        console.log("Nom d'usuari ja existeix");
        errorMessage.value = "Nom d'usuari ja existeix";
        appStore.setSnackbar({
            show: true,
            message: errorMessage.value,
            color: 'error',
        })
        return;
    }
    const emailExists = users.find(user => user.email === state.email);
    if (emailExists) {
        console.log('Ya existe una compte amb aquest email');
        errorMessage.value = "Ya existe una compte amb aquest email";
        appStore.setSnackbar({
            show: true,
            message: errorMessage.value,
            color: 'error',
        })
        return;
    }

    v$.value.$touch()
    if (state.confirmPassword == state.password) {
        if (!v$.value.$invalid) {
            const res = await createUserInOdoo(state.username, state.email)
            if (res.ok) {
                const odooUserId = res.id; // Obtén el ID del usuario creado en Odoo
                console.log('User created in Odoo', res);
                const res2 = await createUser(odooUserId, state.username, state.password, state.email); // Usa el ID de Odoo
                if (res2.ok) {
                    console.log('User registered');
                    let data = await res2.json();
                    console.log(data);
                    appStore.setUser(data);
                    router.push('/');
                } else {
                    console.error('Failed to register user in MySQL:', res2.statusText);
                }
            } else {
                console.error('Failed to create user in Odoo:', res.statusText);
            }
        }
    } else {
        console.log('Passwords do not match')
        clearPasswords();
        v$.value.$invalid
    }
}

function clearPasswords() {
    state.password = '';
    state.confirmPassword = '';
}
</script>
