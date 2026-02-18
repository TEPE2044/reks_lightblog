<script setup lang="ts">
import { ref } from 'vue';
import type { MusicResponse } from '../Utils/reks-interface';
import { playerStore } from '../Store/player';
import { storeToRefs } from 'pinia';
import { createToast } from "../Utils/reks-toast";
import { useToast } from "bootstrap-vue-next";

const { addIntoPlayQueue,selectOutSide } = playerStore()
const { currentIndex } = storeToRefs(playerStore())
const props = defineProps<{ music: MusicResponse }>();
const m = props.music;
const toast = useToast()


const imageLoad = ref(false);

const caseAdd = () => {
  const res = addIntoPlayQueue({ cover: m?.cover, songURL: m?.audio,title:m?.name,author:m?.username }, currentIndex.value)
  if (res) {
    createToast(toast, "添加成功", "歌曲添加成功", "success")
  } else {
    createToast(toast, "重复添加", "歌曲重复添加", "success")
  }
}

const casePlay = () =>{
  try{
    selectOutSide({ cover: m?.cover, songURL: m?.audio,title:m?.name,author:m?.username })
    createToast(toast, "播放成功", `正在播放 ${m?.username} - ${m?.name}`, "success")
  }catch(e){
    createToast(toast, "播放失败", "未知原因", "danger")
    console.error(e)
  }
}
</script>

<template>
  <BCard no-body no-header class="music-card position-relative" v-skeleton-item>
    <!-- 封面区域 -->
    <div class="cover-wrapper" v-skeleton="!imageLoad">
      <img :src="m?.cover" :alt="`cover of ${m?.name || 'unknown'}`" @load="imageLoad = true" v-show="imageLoad"
        class="cover-img" />
    </div>

    <!-- 悬停层 -->
    <div class="meta d-flex flex-column position-absolute p-3">
      <div class="header d-flex align-items-center gap-3 mb-auto">
        <BAvatar size="40" :src="m?.avatar" />
        <div class="info flex-grow-1">
          <div class="title fw-semibold text-white text-truncate">
            {{ m?.name || 'Unknown' }}
          </div>
          <p class="author text-white-50 mb-0 small">{{m?.username}}</p>
        </div>
        <BButton size="sm" variant="light">+ 关注</BButton>
      </div>

      <div class="controls d-flex align-items-center justify-content-center gap-4 mt-auto">
        <button class="control-btn">
          <i-bi-play-circle-fill class="fs-2" @click.stop="casePlay()"/>
        </button>
        <button class="control-btn">
          <i-bi-plus-circle class="fs-4" @click="caseAdd()" />
        </button>
        <button class="control-btn">
          <i-bi-heart class="fs-4" />
        </button>
      </div>
    </div>
  </BCard>
</template>

<style lang="scss" scoped>
.music-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 4 / 3;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);

    .meta {
      opacity: 1;
      visibility: visible;
    }

    .cover-img {
      transform: scale(1.05);
      filter: brightness(0.7);
    }
  }
}

// 封面容器：骨架屏目标，需要最小高度防止塌陷
.cover-wrapper {
  width: 100%;
  height: 100%;
  min-height: 200px; // 防止骨架屏塌陷，跟你的博客卡片一样
  background: #f0f0f0; // 骨架屏底色
  border-radius: 4px;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease, filter 0.3s ease;
  display: block;
}

// Meta 层
.meta {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.header {
  .title {
    font-size: 1.1rem;
    max-width: 200px;
  }

  .author {
    font-size: 0.875rem;
  }
}

.controls {
  .control-btn {
    background: transparent;
    border: none;
    color: white;
    padding: 0.5rem;
    border-radius: 50%;
    transition: transform 0.2s ease, background 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      transform: scale(1.15);
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

// 响应式
@media (max-width: 576px) {
  .music-card {
    aspect-ratio: 1 / 1;
  }

  .title {
    font-size: 0.95rem;
  }
}
</style>