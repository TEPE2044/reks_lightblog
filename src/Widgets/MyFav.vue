<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useToast } from "bootstrap-vue-next";
import {
    queryMyFavorites,
    setFavoriteState,
} from "../Hooks/Fav";
import { createToast } from "../Utils/reks-toast";
import type { FavoriteBlogItem, FavoriteMusicItem } from "../Utils/reks-interface";

type FavoriteTab = "blog" | "music";

const toast = useToast();
const activeTab = ref<FavoriteTab>("blog");
const loading = ref(false);
const blogFavorites = ref<FavoriteBlogItem[]>([]);
const musicFavorites = ref<FavoriteMusicItem[]>([]);
const blogPendingMap = ref<Record<number, boolean>>({});
const musicPendingMap = ref<Record<number, boolean>>({});

const activeCount = computed(() => {
    if (activeTab.value === "music") return musicFavorites.value.length;
    return blogFavorites.value.length;
});

const loadFavorites = async () => {
    loading.value = true;
    try {
        const [blogRes, musicRes] = await Promise.all([
            queryMyFavorites<FavoriteBlogItem>("blog"),
            queryMyFavorites<FavoriteMusicItem>("music"),
        ]);
        blogFavorites.value = blogRes.favorites || [];
        musicFavorites.value = musicRes.favorites || [];
    } catch (e) {
        console.error(e);
        createToast(toast, "加载失败", "无法获取收藏列表", "danger");
    } finally {
        loading.value = false;
    }
};

const handleBlogFavoriteToggle = async (payload: { id: number; next: boolean }) => {
    if (blogPendingMap.value[payload.id]) return;
    blogPendingMap.value[payload.id] = true;
    try {
        const res = await setFavoriteState(payload.id, "blog", payload.next);
        if (!res.is_favorited) {
            blogFavorites.value = blogFavorites.value.filter((item) => item.id !== payload.id);
            createToast(toast, "已取消收藏", res.msg, "success");
            return;
        }
    } catch (e) {
        console.error(e);
        createToast(toast, "操作失败", "更新博客收藏状态失败", "danger");
    } finally {
        blogPendingMap.value[payload.id] = false;
    }
};

const handleMusicFavoriteToggle = async (payload: { id: number; next: boolean }) => {
    if (musicPendingMap.value[payload.id]) return;
    musicPendingMap.value[payload.id] = true;
    try {
        const res = await setFavoriteState(payload.id, "music", payload.next);
        if (!res.is_favorited) {
            musicFavorites.value = musicFavorites.value.filter((item) => item.id !== payload.id);
            createToast(toast, "已取消收藏", res.msg, "success");
            return;
        }
    } catch (e) {
        console.error(e);
        createToast(toast, "操作失败", "更新音乐收藏状态失败", "danger");
    } finally {
        musicPendingMap.value[payload.id] = false;
    }
};

onMounted(async () => {
    await loadFavorites();
});
</script>

<template>
    <div class="my-fav-wrap p-4">
        <div class="fav-tab d-flex align-items-center gap-2 mb-4">
            <BButton
                :variant="activeTab === 'blog' ? 'danger' : 'outline-secondary'"
                size="sm"
                @click="activeTab = 'blog'"
            >
                博客收藏
            </BButton>
            <BButton
                :variant="activeTab === 'music' ? 'danger' : 'outline-secondary'"
                size="sm"
                @click="activeTab = 'music'"
            >
                音乐收藏
            </BButton>
            <span class="fav-count ms-auto">{{ activeCount }} 条</span>
        </div>

        <div v-if="loading" class="py-4">
            <Empty title="收藏加载中..." />
        </div>

        <div v-else-if="activeTab === 'blog' && blogFavorites.length > 0" class="fav-blog-list">
            <BlogCard
                v-for="item in blogFavorites"
                :key="`my-fav-blog-${item.id}`"
                :blog="item"
                :show-like="false"
                :favorited="true"
                :favorite-ready="true"
                :favorite-disabled="blogPendingMap[item.id]"
                @favorite-toggle="handleBlogFavoriteToggle"
            />
        </div>

        <div v-else-if="activeTab === 'music' && musicFavorites.length > 0" class="fav-music-list">
            <MusicCase
                v-for="item in musicFavorites"
                :key="`my-fav-music-${item.id}`"
                :music="item"
                :show-favorite="true"
                :favorited="true"
                :favorite-disabled="musicPendingMap[item.id]"
                @favorite-toggle="handleMusicFavoriteToggle"
            />
        </div>

        <div v-else class="py-4">
            <Empty :title="activeTab === 'blog' ? '还没有收藏博客' : '还没有收藏音乐'" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.fav-tab {
    .fav-count {
        padding: 0.2rem 0.68rem;
        border-radius: 999px;
        color: firebrick;
        font-size: 0.78rem;
        background-color: rgba(178, 34, 34, 0.14);
        font-weight: 700;
    }
}

.fav-blog-list {
    column-count: 3;
    column-gap: 20px;

    @media (max-width: 1024px) {
        column-count: 2;
    }

    @media (max-width: 768px) {
        column-count: 1;
    }
}

.fav-music-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}
</style>