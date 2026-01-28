<template>
  <div class="hub-header p-4">
    <div class="hub-caro shadow-lg">
      <BImg 
        width="682"
        height="320"
        src="/ys.jpg"
        class="object-fit-cover"
        alt="image slot"
      />
    </div>

    <div class="clover">
      <div
        class="clover-box shadow-sm border border-2 rounded"
        v-for="tab in 6"
        :key="`4clover_${tab}`"
      >
      <!-- TODO:image here -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";
.hub-header {
  display: grid;
  grid-template-columns: 682px 1fr;
  @extend %reks-card-box;
  gap: 2rem;
  .hub-caro {
    width: 682px;
  }
  .clover {
    display: grid;
    gap: 0.8rem;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 280px repeat(2, 120px);
    > div {
      cursor: pointer;
      will-change: transform;
      transition: transform 0.3s ease-in-out;
      &:hover {
        transform: scale(1.08);
      }
    }
  }
}
</style>
