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
import { required, email, sameAs } from '@vuelidate/validators'
import { useAppStore } from '@/stores/app.js'

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

async function register() {
    v$.value.$touch()
    if (state.confirmPassword == state.password) {


        if (!v$.value.$invalid) {
            const res = await fetch('http://localhost:4000/newUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(state)
            }
            );
            if (res.ok) {
                let data = await res.json()
                appStore.setUsername(data.username);
                appStore.setArmy(data.army);
                this.$router.push({ name: 'index' })
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
