<script setup lang="ts">
import { onMounted, ref } from "vue";
import { query_my_blog } from "../Hooks/Blog";
import type { BlogData } from "../Utils/reks-interface";

const blogs = ref<BlogData[]>([]);
const loading = ref(true)
onMounted(async () => {
  // 先读缓存
  const cached = localStorage.getItem('blogs')
  if (cached) {
    blogs.value = JSON.parse(cached)
    loading.value = false  // 立即显示，无需等待
    console.log(loading.value)
  }
  
  // 再请求新数据
  const res = await query_my_blog()
  blogs.value = res.blogs
  localStorage.setItem('blogs', JSON.stringify(res.blogs))
  loading.value = false
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
