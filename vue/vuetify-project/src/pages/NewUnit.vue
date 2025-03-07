<template>
    <v-container>
        <v-form @submit.prevent="submitForm">
            <v-text-field v-model="unit.NAME" label="Name" required></v-text-field>
            <v-text-field v-model="unit.WEAPON" label="Weapon" required></v-text-field>
            <v-switch v-model="unit.WINGED" label="Winged"></v-switch>
            <v-text-field v-model="unit.HEALTH" label="Health" type="number" required></v-text-field>
            <v-text-field v-model="unit.ATK" label="Attack" type="number" required></v-text-field>
            <v-text-field v-model="unit.MOVEMENT" label="Movement" type="number" required></v-text-field>
            <v-text-field v-model="unit.SWORD" label="Sword" type="number" required></v-text-field>
            <v-text-field v-model="unit.AXE" label="Axe" type="number" required></v-text-field>
            <v-text-field v-model="unit.SPEAR" label="Spear" type="number" required></v-text-field>
            <v-text-field v-model="unit.BOW" label="Bow" type="number" required></v-text-field>
            <v-text-field v-model="unit.MAGIC" label="Magic" type="number" required></v-text-field>
            <v-file-input v-model="unit.SPRITE" label="Upload ZIP" accept=".zip" required></v-file-input>
            <v-btn type="submit" color="primary">Create Unit</v-btn>
        </v-form>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            unit: {
                NAME: '',
                WEAPON: '',
                WINGED: false,
                HEALTH: 0,
                ATK: 0,
                MOVEMENT: 0,
                SWORD: 0,
                AXE: 0,
                SPEAR: 0,
                BOW: 0,
                MAGIC: 0,
                zipFile: null
                
            }
        };
    },
    methods: {
        submitForm() {
            const formData = new FormData();
            formData.append('NAME', this.unit.NAME);
            formData.append('WEAPON', this.unit.WEAPON);
            formData.append('WINGED', this.unit.WINGED);
            formData.append('HEALTH', this.unit.HEALTH);
            formData.append('ATK', this.unit.ATK);
            formData.append('MOVEMENT', this.unit.MOVEMENT);
            formData.append('SWORD', this.unit.SWORD);
            formData.append('AXE', this.unit.AXE);
            formData.append('SPEAR', this.unit.SPEAR);
            formData.append('BOW', this.unit.BOW);
            formData.append('MAGIC', this.unit.MAGIC);
            formData.append('SPRITE', this.unit.SPRITE);
            fetch('http://localhost:4000/units', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.$router.push({ name: 'ArmyManager' });ww
            })
            .catch(error => {
                console.error('Error:', error);
            });
                }
    }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>