// 这个他妈的是上传用的

import { defineStore } from "pinia";
import { ref } from "vue";
export const musicStore = defineStore('music',() => {
    // 歌曲标题、歌曲简介
    const name = ref<string>('')
    const desc = ref<string>('')
    // 是否原创
    const isOriginal = ref<boolean>(false)
    // 音频文件
    const audioFile = ref<File|null>(null)
    const coverFile = ref<File|null>(null)

    const audioURL = ref<string>()
    const coverURL = ref<string>()



    return{
        name,
        desc,
        isOriginal,
        wantUpload,
        audioFile,
        coverFile,
        audioURL,
        coverURL
    }
})