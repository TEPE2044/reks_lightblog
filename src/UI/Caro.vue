<script setup lang="ts">
import { ref } from 'vue'

interface caroImage {
  src: string
  alt: string
  loaded: boolean
}


const img_list = ref<caroImage[]>([
  {src: 'https://picsum.photos/600/300/?image=25', alt: '/hub/500', loaded: false},
  {src: 'https://picsu.photos/600/300/?image=26', alt: '/hub/501', loaded: false},
  {src: 'https://picsum.photos/600/300/?image=27', alt: '/hub/502', loaded: false},
])



</script>

<template>
  <BContainer>
    <div class="caro">
      <BCarousel controls class="caroSize" >
        <BCarouselSlide
            class="caroSlide"
            v-for="(img, idx) in img_list"
            :key="`act${img.alt}`"
            :img-src="img.src"
            :img-alt="img.alt+idx"
        />
      </BCarousel>
    </div>
  </BContainer>
</template>

<style lang="scss" scoped>
.caro {
  overflow: hidden;
  border-radius: 10px;
  margin: 0;
}


:deep(.carousel-inner), :deep(.carousel-item) {
  width: 100%;
  height: 100%;
}

:deep(.carousel-item img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

:deep(.carousel-indicators) {
  bottom: 8px;
}
</style>