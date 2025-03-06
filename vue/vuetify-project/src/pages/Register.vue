<template>
    <v-card class="mx-auto my-12" max-width="400">
        <v-card-title>
            Registrar-se
        </v-card-title>
        <v-card-text>
            <form>
                <v-text-field
                    v-model="state.username"
                    :error-messages="v$.username.$errors.map(e => e.$message)"
                    label="Nom d'usuari"
                    required
                ></v-text-field>

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

                <v-text-field
                    v-model="state.confirmPassword"
                    :error-messages="v$.confirmPassword.$errors.map(e => e.$message)"
                    label="Confirmar Contrasenya"
                    type="password"
                    required
                ></v-text-field>

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

const initialState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
}

const state = reactive({
    ...initialState,
})

const rules = {
    username: { required },
    email: { required, email },
    password: { required },
    confirmPassword: { required, sameAsPassword: sameAs('password') },
}

const v$ = useVuelidate(rules, state)

function clear() {
    v$.value.$reset()

    for (const [key, value] of Object.entries(initialState)) {
        state[key] = value
    }
}

function register() {
    v$.value.$touch()
    if (!v$.value.$invalid) {
        // Handle registration logic here
    }
}
</script>
