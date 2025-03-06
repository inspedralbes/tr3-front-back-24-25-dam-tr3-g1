<template>
    <h1>Army Manager</h1>
    
    <div class="scroll-picker" style="display: flex; justify-content: center;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
            <div v-for="unit in 4" :key="unit" style="display: flex; flex-direction: column; align-items: center;">
            <div v-for="(option, index) in options" :key="option.value" class="picker-item" style="display: flex; flex-direction: column; align-items: center; margin: 0 10px;">
                <label :for="'option-'+ unit +'-'+ index"><img :src="option.icon" :alt="option.label" class="unit-image" :class="{ 'selected': army[unit-1] === option.value }" style="width: 100px; height: 100px;" /></label>
                <input type="radio" :value="option.value" v-model="army[unit-1]" :id="'option-'+ unit +'-'+ index"/>
            </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'

const army = ref([])
import imgH from '@/assets/Halberd.png'
import imgSw from '@/assets/Sword.png'
import imgA from '@/assets/archer.png'
import imgSp from '@/assets/Spear.png'

let options = [
    { value: 'h', label: 'Halberd', icon: imgH },
    { value: 'sw', label: 'Sword', icon: imgSw },
    { value: 'a', label: 'Archer', icon: imgA },
    { value: 'sp', label: 'Spear', icon: imgSp }

]
onMounted(() => {
    console.log('mounted')
    army.value = ['h', 'sw', 'a', 'sp']
})
</script>
<style scoped>
.selected {
    border: 3px solid red;
    border-radius: 5px;
}
input[type="radio"] {
    display: none;
}
</style>
