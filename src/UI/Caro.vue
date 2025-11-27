<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CaroSkeleton from '../Components/CaroSkeleton.vue'

interface caroImage {
  src: string
  alt: string
  loaded: boolean
}
//fix:如果activityList为空，无法显示图
const activityList = ref<caroImage[]>([
  { src: 'https://picsum.photos/600/300/?image=25', alt: '/hub/500', loaded: false },
  { src: 'https://picsu.photos/600/300/?image=26', alt: '/hub/501', loaded: false },
  { src: 'https://picsu.photos/600/300/?image=27', alt: '/hub/502', loaded: false },
])

const imagePlaceholder = '/imagePlaceholder.webp'
// 控制是否显示骨架屏（仅用于首次可见图）
const loading = ref<boolean>(true)

// 只为第一张图显示骨架屏：预加载第一张，加载完成/失败后关闭骨架
onMounted(() => {
  const firstPaint = activityList.value[0]
  if (activityList.value?.length === 0) {
    loading.value = false
    return
  }
  if (firstPaint) {
    const img = new Image()
    img.onload = () => {
      firstPaint.loaded = true
      loading.value = false
    }
    img.onerror = () => {
      firstPaint.src = imagePlaceholder
      firstPaint.loaded = true
      loading.value = false
    }
    img.src = firstPaint.src
  } else {
    loading.value = false
  }

  // 后台异步预加载其余图片，但不阻塞第一次渲染；失败用占位图
  for (let i = 1; i < activityList.value.length; i++) {
    const item = activityList.value[i]
    if (!item) continue
    const img = new Image()
    img.onload = () => {
      item.loaded = true
    }
    img.onerror = () => {
      item.src = imagePlaceholder
      item.loaded = true
    }
    img.src = item.src
  }
})

</script>

<template>
  <BContainer>
    <div class="caro mt-4">
      <BPlaceholderWrapper :loading="loading">
        <template #loading>
          <div class="caroSize d-flex align-items-center justify-content-center">
            <CaroSkeleton />
          </div>
        </template>

        <template #default>
          <BCarousel fade controls class="caroSize" v-if="activityList.length > 0">
            <BCarouselSlide class="caroSlide" v-for="(img, idx) in activityList" :key="`act${img.alt}${idx}`"
              :img-src="img.src" :img-alt="img.alt + idx" />
          </BCarousel>
          <div v-else class="caroSize d-flex align-items-center justify-content-center">
            <BImg :src="imagePlaceholder" alt="No activities available" class="w-100 h-100" />
          </div>
        </template>
      </BPlaceholderWrapper>
    </div>
  </BContainer>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.caro {
  overflow: hidden;
  border-radius: 10px;
}

.caroSize {
  width: 600px;
  height: 300px;
  margin:auto;
  border-radius: 10px;
  overflow: hidden;
  background: #f8f8f8;
}
</style>