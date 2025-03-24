<template>
  <div>
    <h1>Gestor d'Exèrcit</h1>

    <div class="scroll-picker" style="display: flex; justify-content: center;">
        <v-card>
            <v-card-title>
                <h2>Unitats</h2>
            </v-card-title>
            <v-card-text>
                <v-btn to="/CreateCharacter">Nova unitat</v-btn>
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
                        <th>Distance</th>
                        <th>Resistència a Espases</th>
                        <th>Resistència a Destral</th>
                        <th>Resistència a Llances</th>
                        <th>Resistència a Arcs</th>
                        <th>Resistència a Màgia</th>
                        <th>Preu</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="unit in units" :key="unit.id">
                        <td>{{ unit.name }}</td>
                        <td><img :src="'http://localhost:4000' + unit.icon" alt="imatge unitat"></td>
                        <td>{{ unit.weapon }}</td>
                        <td>{{ unit.winged ? 'Sí' : 'No' }}</td>
                        <td>{{ unit.health }}</td>
                        <td>{{ unit.atk }}</td>
                        <td>{{ unit.movement }}</td>
                        <td>{{ unit.distance }}</td>
                        <td>{{ unit.vs_sword }}</td>
                        <td>{{ unit.vs_axe }}</td>
                        <td>{{ unit.vs_spear }}</td>
                        <td>{{ unit.vs_bow }}</td>
                        <td>{{ unit.vs_magic }}</td>
                        <td>{{ unit.price }}</td>
                        <td><v-btn @click="editUnit(unit.id)">Editar</v-btn></td>
                        <td><v-btn @click="deleteUnitInDB(unit.id)">Eliminar</v-btn></td>
                    </tr>
                </tbody>
            </v-simple-table>
            </v-card-text>
        </v-card>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCharacters, deleteCharacter} from '@/services/communicationManager'

const router = useRouter()
const units = ref([])
onMounted(() => {
    infoCharacters()
})

function infoCharacters() {
    getCharacters()
        .then(data => {
            units.value = data
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function editUnit(id) {
    router.push(`/EditCharacter/${id}`)
}

function deleteUnitInDB(id) {
    deleteCharacter(id)
    infoCharacters()
    console.log('Deleting unit with ID:', id)
}
</script>
<style scoped></style>
