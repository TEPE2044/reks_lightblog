<script setup lang="ts">
import { onMounted, ref } from "vue";
import { query_my_blog } from "../Hooks/Blog";
import type { BlogData } from "../Utils/reks-interface";

const blogs = ref<BlogData[]>([]);
onMounted(async () => {
  const res = await query_my_blog()
  console.log("我的博客列表", res);
  blogs.value = res.blogs;
})
</script>

<template>

  <div class="ns">
    <BlogCard v-for="blog in blogs" :key="blog.id" :blog="blog" />
  </div>

</template>

<style lang="scss" scoped>
.ns {
  column-count: 4;
  column-gap: 10px;
  padding: 1rem;
}
</style>
