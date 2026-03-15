<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { useToast } from "bootstrap-vue-next";
import { storeToRefs } from "pinia";
import { query_hot_blog_cursor } from "../Hooks/Blog";
import { favoriteBatchStore } from "../Store/favoriteBatch";
import { createToast } from "../Utils/reks-toast";
import type { BlogData } from "../Utils/reks-interface";

const blogs = ref<BlogData[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const hasMore = ref(true);
const cursor = ref<number | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);
const toast = useToast();
const fav = favoriteBatchStore();
const {
  likeStatusMap,
  likeReadyMap,
  likePendingMap,
  favoriteStatusMap,
  favoriteReadyMap,
  favoritePendingMap,
} = storeToRefs(fav);

const handleLikeToggle = async (payload: { id: number; next: boolean }) => {
  const res = await fav.handleLikeToggle(payload);
  if (res.status === "not_logged_in") {
    createToast(toast, "请先登录", "登录后才能点赞博客", "warning");
    return;
  }
  if (res.status === "failed") {
    createToast(toast, "操作失败", "点赞状态更新失败，请稍后重试", "danger");
  }
};

const handleFavoriteToggle = async (payload: { id: number; next: boolean }) => {
  const res = await fav.handleFavoriteToggle(payload);
  if (res.status === "not_logged_in") {
    createToast(toast, "请先登录", "登录后才能收藏博客", "warning");
    return;
  }
  if (res.status === "failed") {
    createToast(toast, "操作失败", "收藏状态更新失败，请稍后重试", "danger");
  }
};

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return;
  loadingMore.value = true;
  try {
    const page = await query_hot_blog_cursor(cursor.value, 9);
    const incoming = page.items || [];
    blogs.value = [...blogs.value, ...incoming];
    const likeSyncRes = await fav.syncLikeStatusForBlogs(incoming);
    if (likeSyncRes === "degraded-first") {
      createToast(toast, "状态降级", "点赞状态加载失败，已使用默认状态", "warning");
    }
    const syncRes = await fav.syncFavoriteStatusForBlogs(incoming);
    if (syncRes === "degraded-first") {
      createToast(toast, "状态降级", "收藏状态加载失败，已使用默认状态", "warning");
    }
    cursor.value = page.next_cursor;
    hasMore.value = !!page.has_more;
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

onMounted(async () => {
  fav.resetFavoriteState();
  fav.resetLikeState();
  loading.value = true;
  scrollContainer.value = document.querySelector(".recommand .content") as HTMLElement | null;
  await loadMore();
});

useInfiniteScroll(
  () => scrollContainer.value,
  () => {
    void loadMore();
  },
  {
    distance: 10,
    canLoadMore: () => !loadingMore.value && hasMore.value,
  },
);

</script>

<template>
  <div class="ns-empty" v-if="!loading && blogs.length === 0">
    <Empty />
  </div>
  <div class="ns" v-if="blogs.length > 0">
    <BlogCard
      v-for="blog in blogs"
      :key="blog.id"
      :blog="blog"
      :liked="likeStatusMap[blog.id]"
      :like-ready="likeReadyMap[blog.id]"
      :like-disabled="likePendingMap[blog.id]"
      :favorited="favoriteStatusMap[blog.id]"
      :favorite-ready="favoriteReadyMap[blog.id]"
      :favorite-disabled="favoritePendingMap[blog.id]"
      @like-toggle="handleLikeToggle"
      @favorite-toggle="handleFavoriteToggle"
    />
    <div v-if="loadingMore" class="load-more-tip">加载中...</div>
  </div>

</template>

<style lang="scss" scoped>
.ns {
  column-count: 4;
  column-gap: 10px;
  padding: 1rem;
}

.load-more-tip {
  break-inside: avoid;
  display: inline-block;
  width: 100%;
  text-align: center;
  color: #6b6b6b;
  padding: 0.75rem 0;
}
</style>
