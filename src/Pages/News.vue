<script setup lang="ts">
import BlogCard from '../Widgets/BlogCard.vue';
</script>

<template>

  <div class="ns">
    <BlogCard v-for="iu in 2" :key="iu" />
  </div>

</template>

<style lang="scss" scoped>
.ns{
  column-count: 4;
  column-gap: .2rem;
  padding: 1.5rem;
}
</style>
