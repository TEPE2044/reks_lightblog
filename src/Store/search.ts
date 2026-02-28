import { defineStore } from "pinia";
import { ref } from "vue";
import type { BlogRes } from "../Utils/reks-interface";

export const searchStore = defineStore('search',() => {
    const blogRes = ref<BlogRes[]>([])
    const setBlogRes = (res:BlogRes[]) => {
        blogRes.value = res
    }
    return{
        blogRes,
        setBlogRes
    }
})