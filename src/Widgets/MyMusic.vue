<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { query_my_music } from '../Hooks/Music';
import type { MusicResponse } from '../Utils/reks-interface';
import { useToggle } from '@vueuse/core';

const musicList = ref<MusicResponse[]>([]);
const loading = ref(true)
const [empty, setEmpty] = useToggle()

onMounted(async () => {
    try {
        const cached = localStorage.getItem('musicList')
        if (cached) {
            musicList.value = JSON.parse(cached)
            loading.value = false  // 立即显示，无需等待
            console.log(loading.value)
        }

    }catch(e){
        console.warn("清除缓存")
    }

    const res = await query_my_music()
    musicList.value = res
    if (res == null) {
        setEmpty(true)
    }
    if (musicList.value?.length === 0) {
        setEmpty(true)
    } else {
        setEmpty(false)
    }
    localStorage.setItem('musicList', JSON.stringify(res))
    loading.value = false
    console.log(res)
})
</script>
<template>
    <div class="my-music p-5" v-if="!empty">
        <MusicCase v-for="music in musicList" :key="music.id" :music="music" />
    </div>
    <div class="mymusic-empty" v-else>
        <Empty title="您还没有发布过音频哦~" />
    </div>
</template>
<style lang="scss" scoped>
.my-music {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}
</style>