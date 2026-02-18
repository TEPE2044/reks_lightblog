import { defineStore } from "pinia";
import { ref } from "vue";
export const musicStore = defineStore('music',() => {
    // 歌曲标题、歌曲简介
    const name = ref<string>('')
    const desc = ref<string>('')
    // 是否原创
    const isOriginal = ref<boolean>(false)
    // 是否上传新文件
    const wantUpload = ref<'unew'|'uex'|'unewc'>('uex')
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