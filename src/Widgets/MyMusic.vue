<script lang="ts" setup>
import { useInfiniteScroll } from '@vueuse/core';
import { onMounted, ref } from 'vue';
import { useToast } from 'bootstrap-vue-next';
import { storeToRefs } from 'pinia';

import { query_my_music_cursor } from '../Hooks/Music';
import { favoriteBatchStore } from '../Store/favoriteBatch';
import { createToast } from '../Utils/reks-toast';
import type { MusicResponse } from '../Utils/reks-interface';

const musicList = ref<MusicResponse[]>([]);
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const cursor = ref<number | null>(null)
const toast = useToast()
const fav = favoriteBatchStore()
const {
    musicFavoriteStatusMap,
    musicFavoriteReadyMap,
    musicFavoritePendingMap,
} = storeToRefs(fav)

const handleMusicFavoriteToggle = async (payload: { id: number; next: boolean }) => {
    const res = await fav.handleMusicFavoriteToggle(payload)
    if (res.status === "not_logged_in") {
        createToast(toast, "请先登录", "登录后才能收藏音乐", "warning")
        return
    }
    if (res.status === "failed") {
        createToast(toast, "操作失败", "音乐收藏状态更新失败，请稍后重试", "danger")
    }
}

const loadMore = async () => {
    if (loadingMore.value || !hasMore.value) return
    loadingMore.value = true
    try {
        const page = await query_my_music_cursor(cursor.value, 9)
        const incoming = page.items || []
        musicList.value = [...musicList.value, ...incoming]
        const syncRes = await fav.syncFavoriteStatusForMusic(incoming)
        if (syncRes === "degraded-first") {
            createToast(toast, "状态降级", "音乐收藏状态加载失败，已使用默认状态", "warning")
        }
        cursor.value = page.next_cursor
        hasMore.value = !!page.has_more
    } finally {
        loading.value = false
        loadingMore.value = false
    }
}

onMounted(async () => {
    fav.resetMusicFavoriteState()
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
        <MusicCase
            v-for="music in musicList"
            :key="music.id"
            :music="music"
            :show-favorite="true"
            :favorited="musicFavoriteStatusMap[music.id]"
            :enable-delete="true"
            :favorite-disabled="!musicFavoriteReadyMap[music.id] || musicFavoritePendingMap[music.id]"
            @favorite-toggle="handleMusicFavoriteToggle"
        />
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