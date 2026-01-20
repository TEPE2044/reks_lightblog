<script setup lang="ts">
import BlogCard from "../Widgets/BlogCard.vue";
</script>

<template>

  <div class="ns">
    <BlogCard v-for="iu in 9" :key="iu" />
  </div>

</template>

<style lang="scss" scoped>
.ns {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 10px;
}
</style>
