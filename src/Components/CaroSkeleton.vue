<template>
  <div class="w-100 p-0 mt-5">
    <BPlaceholderCard class="caroSkeleton"
      no-button
      no-footer
      no-header
      no-img
    >
      <template #default>
        <div class="d-flex flex-column gap-5 justify-content-center align-items-center w-100 h-100">
          <BSpinner />
           <p>Carousel Skeleton Example</p>
        </div>
      </template>
    </BPlaceholderCard>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.caroSkeleton {
  width: 500px;
  height: 250px;
}
</style>
