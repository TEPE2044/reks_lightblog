<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { query_my_draft } from "../Hooks/Blog";
import type { BlogData } from "../Utils/reks-interface";

const drafts = ref<BlogData[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const hasMore = ref(true);
const cursor = ref<number | null>(null);
const requestFailed = ref(false);

const loadMore = async () => {
    if (loadingMore.value || !hasMore.value || requestFailed.value) return;
    loadingMore.value = true;
    try {
        const page = await query_my_draft(cursor.value, 9);
        const incoming = page?.items || [];
        drafts.value = [...drafts.value, ...incoming];
        cursor.value = page?.next_cursor ?? null;
        hasMore.value = !!page?.has_more;
    } catch (error) {
        requestFailed.value = true;
        hasMore.value = false;
        console.error("获取草稿失败，已停止后续请求:", error);
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
        canLoadMore: () => !loadingMore.value && hasMore.value && !requestFailed.value,
    },
);
</script>

<template>
    <div class="draft-empty" v-if="!loading && drafts.length === 0">
        <Empty title="草稿箱空空如也~" />
    </div>

    <div class="draft" v-if="drafts.length > 0">
        <BlogCard
            v-for="blog in drafts"
            :key="blog.id"
            :blog="blog"
            :show-actions="false"
            :show-like="false"
            :show-favorite="false"
            :enable-visit="false"
        />
        <div v-if="loadingMore" class="load-more-tip">加载中...</div>
    </div>
</template>

<style lang="scss" scoped>
.draft {
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