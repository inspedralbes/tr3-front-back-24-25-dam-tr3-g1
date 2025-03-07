<template>
    <h1>Gestor d'Exèrcit</h1>

    <div class="scroll-picker" style="display: flex; justify-content: center;">
        <v-card>
            <v-card-title>
                <h2>Unitats</h2>
            </v-card-title>
            <v-card-text>
                <v-btn @click="createUnit()">Nova unitat</v-btn>
            <v-simple-table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Imatge</th>
                        <th>Arma</th>
                        <th>Alat</th>
                        <th>Salut</th>
                        <th>Atac</th>
                        <th>Moviment</th>
                        <th>Resistència a Espases</th>
                        <th>Resistència a Destral</th>
                        <th>Resistència a Llances</th>
                        <th>Resistència a Arcs</th>
                        <th>Resistència a Màgia</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="unit in units" :key="unit.ID">
                        <td>{{ unit.NAME }}</td>
                        <td><img :src="unit.imatge" alt="imatge unitat" style="width: 50px; height: 50px;"></td>
                        <td>{{ unit.WEAPON }}</td>
                        <td>{{ unit.WINGED ? 'Sí' : 'No' }}</td>
                        <td>{{ unit.HEALTH }}</td>
                        <td>{{ unit.ATK }}</td>
                        <td>{{ unit.MOVEMENT }}</td>
                        <td>{{ unit.SWORD }}</td>
                        <td>{{ unit.AXE }}</td>
                        <td>{{ unit.SPEAR }}</td>
                        <td>{{ unit.BOW }}</td>
                        <td>{{ unit.MAGIC }}</td>
                        <td><v-btn @click="editUnit(unit.ID)">Editar</v-btn></td>
                        <td><v-btn @click="deleteUnit(unit.ID)">Eliminar</v-btn></td>
                    </tr>
                </tbody>
            </v-simple-table>
            </v-card-text>
        </v-card>

    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const units = ref([])
onMounted(() => {
    if (!appStore.state.user) {
        router.push('/login')
    }
    fetch('http://localhost:4000/units')
        .then(response => response.json())
        .then(data => {
            units.value = data
        })
        .catch((error) => {
            console.error('Error:', error);
        });

})
</script>
<style scoped></style>
