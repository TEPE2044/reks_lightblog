<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useToggle } from "bootstrap-vue-next";
import router from "../Router";
import { userStore } from "../Store/user";
import { storeToRefs } from "pinia";
import { query_hot_blog } from "../Hooks/Blog";
import { createToast } from "../Utils/reks-toast";
import { useToast } from "bootstrap-vue-next";
import type { HotBlogItem } from "../Utils/reks-interface";

const { isLoggedIn } = storeToRefs(userStore());
const emd = useToggle("easy-login-box");
const toast = useToast();
const hotList = ref<HotBlogItem[]>([]);
const hotLoading = ref(false);

const loadHot = async () => {
  hotLoading.value = true;
  try {
    const res = await query_hot_blog(12);
    hotList.value = res.blogs || [];
  } catch (e) {
    console.error(e);
    createToast(toast, "加载失败", "热门推荐获取失败", "danger");
  } finally {
    hotLoading.value = false;
  }
};

const toHub = () => {
  if (isLoggedIn.value === false) {
    emd.toggle();
    return;
  }

  router.push("/hub");
};

onMounted(async () => {
  await loadHot();
});
</script>

<template>
  <div class="hotlist p-4">
    <h5 class="hotlist-title">热门推荐</h5>
    <div v-if="hotLoading" class="py-4">
      <Empty title="热门推荐加载中..." />
    </div>
    <div v-else-if="hotList.length === 0" class="py-4">
      <Empty title="暂无热门推荐" />
    </div>
    <div v-else class="hotlist-content">
      <div
        class="hotlist-item"
        v-for="item in hotList"
        :key="`hot-blog-${item.id}`"
      >
        <div class="like-badge" v-if="item?.like_count >= 10">热门</div>
        <BlogCard :blog="item" :show-actions="false" />
      </div>
    </div>
    <div
      class="more d-flex justify-content-center align-items-center mt-4 fw-bold"
      @click="toHub"
    >
      更多内容>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.hotlist {
  @extend %reks-card-box;

  .hotlist-title {
    @extend %reks-title;
  }

  .hotlist-content {
    column-count: 4;
    column-gap: 10px;
    padding: 1rem;

    .hotlist-item {
      position: relative;
      width: 100%;
      break-inside: avoid;

      .like-badge {
        position: absolute;
        z-index: 2;
        top: 8px;
        right: 8px;
        padding: 0.1rem 0.5rem;
        border-radius: 999px;
        color: #fff;
        font-size: 0.72rem;
        background: rgba(178, 34, 34, 0.82);
        backdrop-filter: blur(2px);
        font-weight: 700;
      }
    }

    @media (max-width: 1200px) {
      column-count: 3;
    }

    @media (max-width: 992px) {
      column-count: 2;
    }

    @media (max-width: 576px) {
      column-count: 1;
    }
  }

  .more {
    cursor: pointer;
  }
}
</style>
