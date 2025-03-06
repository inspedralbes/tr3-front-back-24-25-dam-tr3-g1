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
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const initialState = {
    email: '',
    password: '',
}

const state = reactive({
    ...initialState,
})

const rules = {
    email: { required, email },
    password: { required },
}

const v$ = useVuelidate(rules, state)

function clear() {
    v$.value.$reset()

    for (const [key, value] of Object.entries(initialState)) {
        state[key] = value
    }
}
</script>
