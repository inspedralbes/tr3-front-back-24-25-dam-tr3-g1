<template>
    <v-card class="mx-auto my-12" max-width="400">
        <v-card-title>
            Iniciar Sessió
        </v-card-title>
        <v-card-text>
            <form>
                <v-text-field
                    v-model="state.email"
                    :error-messages="v$.email.$errors.map(e => e.$message)"
                    label="Correu electrònic"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="state.password"
                    :error-messages="v$.password.$errors.map(e => e.$message)"
                    label="Contrasenya"
                    type="password"
                    required
                ></v-text-field>

                <v-btn class="me-4" @click="login">
                    Iniciar Sessió
                </v-btn>
            </form>
            <router-link to="/register">No tens un compte? Registra't aquí</router-link>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import {useAppStore} from '@/stores/app.js'

const initialState = {
    email: '',
    password: '',
}

const appStore = useAppStore()
const router = useRouter()


const state = reactive({
    ...initialState,
})

const rules = {
    email: { required, email },
    password: { required },
}

const v$ = useVuelidate(rules, state)

async function login() {
    v$.value.$touch()
    if (v$.value.$error) return
    const res= await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(state)
    })
    const data = await res.json()
    if (data.error) {
        console.error(data.error)
        return
    }
    appStore.setArmy(JSON.parse(data.army));
    console.log('login', state)
    router.push('/')

    
}
</script>
