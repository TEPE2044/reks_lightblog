<script setup lang="ts">

const props = defineProps({
  title: { type: String, default: '暂无更多内容' },
  
})
</script>

<template>
  <div class="empty d-flex align-items-center justify-content-center">
    <div class="empty-card mt-5 w-100">
      <i-bi-box/>
      <h5 class="empty-title mt-2">{{ title }}</h5>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty-card {
  padding: 2rem 1.6rem;
  text-align: center;
}


@media (max-width: 480px) {
  .empty-card { padding: 1rem; }
  .empty-icon { font-size: 40px; }
}
</style>
