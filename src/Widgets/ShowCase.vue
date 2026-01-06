<script setup lang="ts">
import MusicCard from './MusicCard.vue';

</script>
<template>
  <div class="showcase">
    <div class="scroll-bar w-100 mb-4 p-4">
      <div class="case-title h5">熔岩电台</div>
      <div class="case mt-4">
        <MusicCard v-for="is in 10" :key="is"/>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss" as g;

.scroll-bar {
    @extend %reks-card-box;
    opacity: 0.95;
   
    .case-title {
        @extend %reks-title;
    }

    .case { 
        display: flex;
        flex-wrap: nowrap;
        gap: 1rem;
        height: g.$caro-height;
        overflow-x: auto;
    }
    //防止子项被压扁
    .case > *{
        flex:0 0 auto
    }
}
</style>