<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const blogId = computed(() => Number(route.params.id));
const source = computed(() => (route.query.source === "draft" ? "draft" : "blog"));

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.push("/");
};
</script>

<template>
  <div class="blog-edit-page">
    <div class="blog-edit-head d-flex align-items-center justify-content-between mb-3">
      <div>
        <div class="h4 mb-1">编辑博客</div>
        <div class="text-secondary">修改后直接保存，不会影响其它投稿页状态</div>
      </div>
      <BButton variant="outline-secondary" @click="goBack">返回</BButton>
    </div>

    <BlogUpload :mode="'edit'" :blog-id="blogId" :source="source" />
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.blog-edit-page {
  margin-top: 7.3rem;
  @extend %reks-card-box;
  padding: 1.5rem;
}

.blog-edit-head {
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
