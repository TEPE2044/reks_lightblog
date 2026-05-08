import { defineStore } from "pinia";
import { ref } from "vue";

export const controlsStore = defineStore("controls",() => {
    const canVisitMine = ref<Boolean>(true)
    

    return{

    } 
})