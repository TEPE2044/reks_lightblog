<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface caroImage {
  src: string
  alt: string
  loaded: boolean
}

const img_list = ref<caroImage[]>([
  { src: 'https://picsum.photos/600/300/?image=25', alt: '/hub/500', loaded: false },
  { src: 'https://picsu.photos/600/300/?image=26', alt: '/hub/501', loaded: false },
  { src: 'https://picsum.photos/600/300/?image=27', alt: '/hub/502', loaded: false },
])
// 对失效图片进行处理，使用占位图替代
const img_holder = '/Imgholder.webp'
const handleSlideError = (idx: number) => {
  const item = img_list.value[idx]
  if (!item) return
  item.src = img_holder
}
onMounted(() => {
  img_list.value.forEach((_, idx) => {
    const item = img_list.value[idx]
    if (!item) return
    const img = new Image()
    img.onload = () => {
      item!.loaded = true
    }
    img.onerror = () => {
      handleSlideError(idx)
    }
    img.src = item.src
  })
})

</script>

<template>
  <BContainer>
    <!-- TODO:骨架屏，等数据转换为接口数据后再做调整 -->
    <div class="caro mx-auto mt-2">
      <BCarousel controls class="caroSize">
        <BCarouselSlide class="caroSlide" v-for="(img, idx) in img_list" :key="`act${img.alt}`" :img-src="img.src"
          :img-alt="img.alt + idx" />
      </BCarousel>
    </div>
  </BContainer>
</template>

<style lang="scss" scoped>
.caro {
  width: 80%;
  overflow: hidden;
  border-radius: 10px;
  margin: 0;

  .caroSlide {

    // fix: 轮播图切换时闪烁
    &:hover {
      transition: all 0.8s ease-in-out;
      filter: brightness(0.8);
      cursor: pointer;
    }
  }
}


:deep(.carousel-inner),
:deep(.carousel-item) {
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