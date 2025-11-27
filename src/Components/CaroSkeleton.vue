<script setup lang="ts"></script>
<template>
  <div class="caroSkeleton caroSize">
    <BPlaceholderCard
      no-button
      no-footer
      no-header
      no-img
      class="w-100 h-100"
    >
      <template #default>
        <div class="d-flex flex-column gap-5 justify-content-center align-items-center w-100 h-100">
          <BSpinner />
          <p>精彩马上呈现...</p>
        </div>
      </template>
    </BPlaceholderCard>
  </div>
</template>

<style scoped>
</style>
