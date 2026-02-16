<script setup lang="ts">
import { onMounted, ref } from "vue";
import { query_my_blog } from "../Hooks/Blog";
import type { BlogData } from "../Utils/reks-interface";

const blogs = ref<BlogData[]>([]);
onMounted(async () => {
  const res = await query_my_blog()
  console.log("我的博客列表", res);
  blogs.value = res.data.blogs;
})
</script>

<template>
  <div class="myblog">
    <BlogCard v-for="blog in blogs" :key="blog.id" :blog="blog" />
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
</style>
