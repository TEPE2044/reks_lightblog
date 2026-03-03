<script setup lang="ts">
import { onMounted, ref } from "vue";
import { query_my_blog } from "../Hooks/Blog";
import type { BlogData } from "../Utils/reks-interface";
import { useToggle } from "@vueuse/core";


const blogs = ref<BlogData[]>([]);
const loading = ref(true)
const [empty, setEmpty] = useToggle()
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
  blogs.value = res?.blogs
  if (res == null) {
    setEmpty(true)
  }
  if (blogs.value?.length === 0) {
    setEmpty(true)
  } else {
    setEmpty(false)
  }
  localStorage.setItem('blogs', JSON.stringify(res?.blogs))
  loading.value = false
})

</script>

<template>
  <div class="ns-empty" v-if="empty">
    <Empty/>
  </div>
  <div class="ns" v-if="!empty">
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
