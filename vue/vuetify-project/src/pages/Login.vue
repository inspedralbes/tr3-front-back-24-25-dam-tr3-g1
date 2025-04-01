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

                <p v-if="errorMessage" class="text-red mt-2">{{ errorMessage }}</p>
            </form>
            <router-link to="/register">No tens un compte? Registra't aquí</router-link>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { useAppStore } from '@/stores/app.js'
import { loginUser } from '@/services/communicationManager'

const initialState = {
    email: '',
    password: '',
}

const appStore = useAppStore()
const router = useRouter()
const errorMessage = ref('')

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
    const res = await loginUser(state.email, state.password)
    const data = await res.json()
    if (data.error) {
        errorMessage.value = "Error en l'inici de sessió: " + (data.message || "Email/Contrasenya incorrecta.")
        console.error(data.error)
        return
    }
    console.log(data)
    appStore.setUser(data)
    router.push('/')
}
</script>
