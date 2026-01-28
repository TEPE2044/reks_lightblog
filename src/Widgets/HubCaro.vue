<template>
  <div class="hubcaro border rounded overflow-hidden shadow-lg">
    <BCarousel indicators controls>
      <BCarouselSlide v-for="t in 3">
        <template #img>
          <BImg
            :key="`img_${t}`"
            width="682"
            height="320"
            src="/ys.jpg"
            class="object-fit-cover"
            alt="image slot"
          />
        </template>
      </BCarouselSlide>
    </BCarousel>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.hubcaro{
  width: 682px;
}
</style>
