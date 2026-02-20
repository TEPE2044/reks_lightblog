<script setup lang="ts">
import { ref } from "vue";

const empty = ref(true);
</script>

<template>
  <div class="ns-empty" v-if="empty">
    <Empty/>
  </div>
  <div class="ns" v-if="!empty">
    <!-- <BlogCard v-for="blog in blogs" :key="blog.id" :blog="blog" /> -->
  </div>

</template>

<style lang="scss" scoped>
.ns {
  column-count: 4;
  column-gap: 10px;
  padding: 1rem;
}
</style>
