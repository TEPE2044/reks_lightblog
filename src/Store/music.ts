import { useToggle } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";
export const musicStore = defineStore('music',() => {
    // 歌曲标题、歌曲简介
    const trackTitle = ref<string>('')
    const trackDesc = ref<string>('')
    const playList = ref<string>('')
    // 是否原创
    const [isOriginal] = useToggle()
    // 是否上传新文件
    const wantUpload = ref<'unew'|'uex'|'unewc'>('uex')
    // 音频文件
    const audioFile = ref<File|null>(null)
    const coverFile = ref<File|null>(null)
    return{
        trackTitle,
        trackDesc,
        playList,
        isOriginal,
        wantUpload,
        audioFile,
        coverFile
    }
})