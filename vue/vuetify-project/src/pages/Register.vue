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
import { createUser, createUserInOdoo } from '@/services/communicationManager'

const initialState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
}

const appStore = useAppStore()

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
    v$.value.$touch()
    if (state.confirmPassword == state.password) {
        if (!v$.value.$invalid) {
            const res = await createUser(state.username, state.password, state.email)
            if (res.ok) {
                console.log('User registered')
                let data = await res.json()
                console.log(data)
                appStore.setUser(data)
                router.push('/')
                await createUserInOdoo(state.username, state.email)
            }
        }
    }
    else {
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
