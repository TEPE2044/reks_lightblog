<template>
  <div class="hub">
    <HubHeader/>


    <div class="hang border-2 mt-4">
      <ShowCase />
    </div>
  </div>
</template>

<script setup lang="ts">

import HubHeader from "../Components/HubHeader.vue";
import ShowCase from "../Widgets/ShowCase.vue";
</script>

<style lang="scss" scoped>
.hub {
  margin-top: 7.3rem;
}
</style>
