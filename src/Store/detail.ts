import { defineStore } from "pinia"
import { ref } from "vue"
import type { Detail } from "../Utils/reks-interface"



export const detailStore = defineStore("detail", () => {
    const dtitle = ref<string>()
    const dauthor = ref<string>()
    const dcover = ref<string>()
    // 歌词
    const lyrics = ref<string>()

    const get_detail = (data:Detail) =>{
        dtitle.value = data.title
        dauthor.value = data.author
        dcover.value = data.cover
    }

    return {
        dtitle,dauthor,dcover,lyrics,get_detail
    }
})