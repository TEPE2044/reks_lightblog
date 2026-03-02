import { defineStore } from "pinia";
import { ref } from "vue";
import type { BlogRes, MusicResponse, SearchUserRes } from "../Utils/reks-interface";

export const searchStore = defineStore('search',() => {

    const searchType = ref<'keyword'|'music'|'user'>('keyword')
    const switchSearchType = (id:string) => {
        searchType.value = id as 'keyword'|'music'|'user'
    }

    const blogRes = ref<BlogRes[]>([])
    const setBlogRes = (res:BlogRes[]) => {
        blogRes.value = res
    }

    const musicRes = ref<MusicResponse[]>([])
    const setMusicRes = (res:MusicResponse[]) => {
        musicRes.value = res
    }

    const userRes = ref<SearchUserRes[]>([])
    const setUserRes = (res:SearchUserRes[]) => {
        userRes.value = res
    }

    const clearSearchResult = () => {
        blogRes.value = []
        musicRes.value = []
        userRes.value = []
    }

    return{
        searchType,
        switchSearchType,
        blogRes,
        setBlogRes,
        musicRes,
        setMusicRes,
        userRes,
        setUserRes,
        clearSearchResult
    }
})