<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { useToast } from "bootstrap-vue-next";
import { storeToRefs } from "pinia";
import { query_my_blog_cursor } from "../Hooks/Blog";
import { favoriteBatchStore } from "../Store/favoriteBatch";
import { createToast } from "../Utils/reks-toast";
import type { BlogData } from "../Utils/reks-interface";
import router from "../Router";

const blogs = ref<BlogData[]>([]);
const loading = ref(false);
// 加载更多
const loadingMore = ref(false);
// 还有吗变量
const hasMore = ref(true);
const cursor = ref<number | null>(null);
const toast = useToast();
const fav = favoriteBatchStore();
const { favoriteStatusMap, favoriteReadyMap, favoritePendingMap } =
  storeToRefs(fav);

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
// 还有吗
const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return;
  loadingMore.value = true;
  try {
    // 首次发送，没有游标，让后台给
    const page = await query_my_blog_cursor(cursor.value, 9);
    const incoming = page.items || [];
    blogs.value = [...blogs.value, ...incoming];
    const syncRes = await fav.syncFavoriteStatusForBlogs(incoming);
    if (syncRes === "degraded-first") {
      createToast(
        toast,
        "状态降级",
        "收藏状态加载失败，已使用默认状态",
        "warning",
      );
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
  loading.value = true;
  await loadMore();
});

useInfiniteScroll(
  window,
  () => {
    void loadMore();
  },
  {
    distance: 10,
    canLoadMore: () => !loadingMore.value && hasMore.value,
  },
);

const toDraft = () => {
  router.push('/upload/draft')
}
</script>

<template>
  <div class="myblog-empty" v-if="!loading && blogs.length === 0">
    <Empty title="您还没有发布过博客哦~" />
  </div>
  <div class="myblog-container" >
    <!-- <div class="draft pe-3 pt-2 d-flex justify-content-end" v-if="blogs.length > 0">
      <BButton variant="outline-secondary" @click="toDraft">草稿箱</BButton>
    </div> -->
    <div class="myblog" v-if="blogs.length > 0">
      <BlogCard
        v-for="blog in blogs"
        :key="blog.id"
        :blog="blog"
        :favorited="favoriteStatusMap[blog.id]"
        :favorite-ready="favoriteReadyMap[blog.id]"
        :favorite-disabled="favoritePendingMap[blog.id]"
        @favorite-toggle="handleFavoriteToggle"
      />
      <div v-if="loadingMore" class="load-more-tip">加载中...</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.myblog {
  column-count: 3;
  column-gap: 20px;
  padding: 1.5rem;

  @media (max-width: 1400px) {
    column-count: 3;
    padding: 6rem;
    padding-top: 1rem;
  }

  @media (max-width: 1024px) {
    column-count: 2;
    padding: 5rem;
    padding-top: 0;

    column-gap: 40px;
  }

  @media (max-width: 768px) {
    column-count: 2;
    padding: 2rem;
  }
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
