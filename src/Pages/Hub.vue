<template>
  <div class="hub">
    <div class="hub-header p-4">
      <div class="hubcaro-title h5">当前活动</div>
      <div class="capr d-flex justify-content-center align-items-center">
        <HubCaro></HubCaro>
      </div>
    </div>
    <div class="hang border-2 mt-4">
      <ShowCase />
    </div>
  </div>
</template>

<script setup lang="ts">
import HubCaro from "../Widgets/HubCaro.vue";
import ShowCase from "../Widgets/ShowCase.vue";
</script>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss" as g;
.hub {
  margin-top: 7.3rem;

  .hubcaro-title {
    @extend %reks-title;
  }

  .hub-header {
    gap: 3rem;
    @extend %reks-card-box;
  }
}
</style>
