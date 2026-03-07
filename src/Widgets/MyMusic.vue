<script lang="ts" setup>
import { useInfiniteScroll } from '@vueuse/core';
import { onMounted, ref } from 'vue';

import { query_my_music_cursor } from '../Hooks/Music';
import type { MusicResponse } from '../Utils/reks-interface';

const musicList = ref<MusicResponse[]>([]);
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const cursor = ref<number | null>(null)

const loadMore = async () => {
    if (loadingMore.value || !hasMore.value) return
    loadingMore.value = true
    try {
        const page = await query_my_music_cursor(cursor.value, 9)
        musicList.value = [...musicList.value, ...(page.items || [])]
        cursor.value = page.next_cursor
        hasMore.value = !!page.has_more
    } finally {
        loading.value = false
        loadingMore.value = false
    }
}

onMounted(async () => {
    loading.value = true
    await loadMore()
})

useInfiniteScroll(
    window,
    () => {
        void loadMore()
    },
    {
        distance: 10,
        canLoadMore: () => !loadingMore.value && hasMore.value,
    },
)
</script>
<template>
    <div class="my-music p-5" v-if="musicList.length > 0">
        <MusicCase v-for="music in musicList" :key="music.id" :music="music" />
        <div v-if="loadingMore" class="load-more-tip">加载中...</div>
    </div>
    <div class="mymusic-empty" v-else-if="!loading">
        <Empty title="您还没有发布过音频哦~" />
    </div>
</template>
<style lang="scss" scoped>
.my-music {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

.load-more-tip {
    grid-column: 1 / -1;
    text-align: center;
    color: #6b6b6b;
    padding: 0.75rem 0;
}
</style>