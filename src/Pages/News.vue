<script setup lang="ts">
import { onMounted } from "vue";
import BlogCard from "../Widgets/BlogCard.vue";
import { query_my_blog } from "../Hooks/Blog";

onMounted(async() => {
  const res = await query_my_blog()
})
</script>

<template>

  <div class="ns">
    <BlogCard v-for="iu in 2" :key="iu" />
  </div>

</template>

<style lang="scss" scoped>
.ns{
  column-count: 3;
  column-gap: .5rem;
  padding: 1.5rem;
}
</style>
