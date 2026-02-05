<script setup lang="ts">
import { useTemplateRef } from "vue";
import { useEventListener } from "@vueuse/core";


const showcase = useTemplateRef('showcase')
useEventListener(showcase, 'wheel', (e: WheelEvent) => {
  e.preventDefault()
  if (showcase.value) showcase.value.scrollLeft += e.deltaY
}, { passive: false })
</script>
<template>
  <div class="showcase">
    <div class="scroll-bar w-100 mb-4 p-4">
      <div class="case-title h5">电台上新</div>
      <div ref="showcase" class="case py-4 mt-4">
        <MusicCase v-for="is in 10" :key="is" />
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
    height: 240px;
    overflow-x: auto;

    /* WebKit 核心 */
    &::-webkit-scrollbar {
      height: 8px;
    }
    &::-webkit-scrollbar-track {
      background: #f0f0f0;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(178, 34, 34, 0.76);
      border-radius: 4px;
      border: 2px solid #f0f0f0;
      &:hover {
        background: #764ba2;
      }
    }

    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: rgba(178, 34, 34, 0.76) #f0f0f0;

    /* 防止子项被压扁 */
    > * {
      flex: 0 0 auto;
    }
  }
}
</style>
