<script setup lang="ts">
import { useTemplateRef, ref, onMounted } from "vue";
import type { MusicResponse } from "../Utils/reks-interface";
import { useEventListener, useToggle } from "@vueuse/core";
import Empty from "../Components/Empty.vue";
import { query_my_music } from "../Hooks/Music";

const showcase = useTemplateRef("showcase");
useEventListener(
  showcase,
  "wheel",
  (e: WheelEvent) => {
    e.preventDefault();
    if (showcase.value) showcase.value.scrollLeft += e.deltaY;
  },
  { passive: false },
);

const musicList = ref<MusicResponse[]>([]);
const loading = ref(true);
const [empty, setEmpty] = useToggle();

onMounted(async () => {
  try {
    const res = await query_my_music();

    // 防御性检查：res 可能为 null/undefined
    if (!res) {
      setEmpty(true);
      return;
    }

    musicList.value = res;

    if (res.length === 0) {
      setEmpty(true);
      const cached = localStorage.getItem("musicList");
      if (cached) {
        musicList.value = JSON.parse(cached);
        loading.value = false;
      }
    } else {
      setEmpty(false);
      localStorage.setItem("musicList", JSON.stringify(res));
    }
  } catch (error) {
    console.error("获取音乐列表失败:", error);
    setEmpty(true); // 出错时显示空状态
    // 可选：保留缓存数据或清空
    // musicList.value = []
  } finally {
    loading.value = false; // 确保无论成功与否都关闭 loading
  }
});
</script>
<template>
  <div class="showcase">
    <div class="scroll-bar w-100 mb-4 p-4">
      <div class="case-title h5">电台上新</div>
      <div ref="showcase" class="case py-4 mt-4" v-if="!empty">
        <MusicCase v-for="music in musicList" :key="music.id" :music="music" />
      </div>
      <div class="case d-flex align-items-center justify-content-center" v-else>
        <Empty title="空空如也" />
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
