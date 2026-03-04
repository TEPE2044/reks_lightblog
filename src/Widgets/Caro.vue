<script lang="ts" setup>
import { ref } from "vue";

const imageList = ref<string[]>([
  "/imagePlaceholder.webp",
  "/lh.webp",
  "/pm.webp",
]);

const currentIndex = ref(0);
const displayImage = ref(imageList.value[currentIndex.value]);
const choose = (index: number) => {
  currentIndex.value = index;
  displayImage.value = imageList.value[currentIndex.value];
};
</script>

<template>
  <div class="caro mt-2">
    <div class="caro-full p-3">
      <div class="main-img-container w-100 h-100">
        <Transition name="fade" mode="out-in">
          <BImg
            :key="displayImage"
            :lazy="currentIndex !== 0"
            fetchpriority="high"
            :src="displayImage"
            class="main-img w-100 h-100"
            alt="main"
          />
        </Transition>
      </div>
    </div>
    <div class="caro-thumbnail d-flex align-items-center">
      <div class="thumbnail-img-container d-flex gap-2">
        <BImg
          thumbnail
          v-for="(i, index) in imageList"
          :lazy="currentIndex !== 0"
          :key="index"
          :src="i"
          alt="reks-caro"
          class="thumbnail-img"
          :class="{ active: index === currentIndex }"
          @click="choose(index)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../Asset/CustomStyle/global.scss" as global;
.caro {
  //size
  width: 100%;
  height: global.$caro-height;
  box-sizing: border-box;
  //layout
  display: grid;
  grid-template-areas: "main thumbnail";
  grid-template-columns: 4fr 1fr;
  //decoration
  border-radius: 12px;
  background-color: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  @media (max-width: 768px) {
    grid-template-areas: "main thumbnail";
    grid-template-columns: 3fr 1fr;
  }
  @media (max-width: 550px) {
    // TODO:
  }

  .caro-full {
    grid-area: main;
    max-height: global.$caro-height;
    border-radius: 12px 0 0 12px;

    .main-img-container {
      border-radius: 12px;
      background: #f8f8f8;
      @media (max-width: 768px) {
        //bug 图片抖动时高度过高
        max-height: 250px;
      }
      .main-img {
        object-fit: cover;
        object-position: center;
        border-radius: 12px;
      }
    }
  }

  .caro-thumbnail {
    grid-area: thumbnail;
    height: 100%;
    background: #faf6f2;
    border-radius: 0 12px 12px 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .thumbnail-img-container {
      width: 90%;
      flex-direction: column;

      .thumbnail-img {
        width: 100%;
        max-height: 80px;
        @media (max-width: 768px) {
          max-height: 50px;
        }
        @media (max-width: 425px) {
          max-height: 40px;
        }
        object-fit: cover;
        object-position: top center;
        border-radius: 6px;
        border: 2px solid transparent;
        transition: border-color 0.2s;
        cursor: pointer;

        &.active {
          border-color: firebrick;
        }

        &:hover {
          border-color: #e67e22;
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
