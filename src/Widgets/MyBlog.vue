<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { query_my_blog_cursor } from "../Hooks/Blog";
import type { BlogData } from "../Utils/reks-interface";

const blogs = ref<BlogData[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const hasMore = ref(true);
const cursor = ref<number | null>(null);

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return;
  loadingMore.value = true;
  try {
    const page = await query_my_blog_cursor(cursor.value, 9);
    blogs.value = [...blogs.value, ...(page.items || [])];
    cursor.value = page.next_cursor;
    hasMore.value = !!page.has_more;
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

onMounted(async () => {
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


</script>

<template>
  <div class="myblog-empty" v-if="!loading && blogs.length === 0">
    <Empty title="您还没有发布过博客哦~" />
  </div>
  <div class="myblog" v-if="blogs.length > 0">
    <BlogCard v-for="blog in blogs" :key="blog.id" :blog="blog" />
    <div v-if="loadingMore" class="load-more-tip">加载中...</div>
  </div>

</template>

<style lang="scss" scoped>
.myblog {
  column-count: 3;
  column-gap: 20px;
  padding: 1.5rem;

  @media (max-width:1400px) {
    column-count: 3;
    padding: 6rem;
    padding-top: 1rem;
  }

  @media (max-width:1024px) {
    column-count: 2;
    padding: 5rem;
    padding-top: 0;

    column-gap: 40px;
  }

  @media (max-width:768px) {
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
