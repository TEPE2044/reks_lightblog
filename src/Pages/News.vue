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
