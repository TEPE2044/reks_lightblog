<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref, watchEffect, shallowRef } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useToggle } from "bootstrap-vue-next";
import type { Placement } from "bootstrap-vue-next";

const img_list = ref([
  {
    url: "/ysg2.jpg",
    alt: "ysg2",
  },
  {
    url: "/ysg.jpg",
    alt: "ysg",
  },
  {
    url: "/ysg1.jpg",
    alt: "ysg1",
  },
]);

// 唯一适合用shallowRef
const lyrics = shallowRef([
  "「…我想成为万千萤火中的一盏。」",
  "「天总会亮的。无论黑夜多么漫长，白昼终将到来。」",
  "「在遥远的过去，和遥远的未来，一定也有无数人做出了和我一样的选择。我们…从不孤单。」",
]);

const volume = ref(20);
// 单位：秒
const duration = ref(0);
const muted = ref(false);
const isPlay = ref(false);
// 切换播放状态
const togglePlay = () => {
  isPlay.value = !isPlay.value;
};
// 切换静音
const handleMuted = () => {
  muted.value = !muted.value;
};
// 播放列表
const show = ref(false);
const placement = ref<Placement>("end");

const toggleMusicList = () => {
  show.value = !show.value;
  onTop.value = false;
  expand.hide();
};
// 模式选择
const mode = ref<string | any>("loop");
const modeList = ref(["loop", "shuffle", "repeat"]);
const switchMode = useDebounceFn(() => {
  const currentIndex = modeList.value.indexOf(mode.value);
  const nextIndex = (currentIndex + 1) % modeList.value.length;
  mode.value = modeList.value[nextIndex];
}, 300);

const expand = useToggle("music-player-inner");
const onTop = ref(false);
const toggleExpand = () => {
  onTop.value = !onTop.value;
  expand.toggle();
  show.value = false;
};

watchEffect(() => {
  console.log(mode.value);
  console.log(onTop.value)
});
</script>
<template>

  <div :class="{ ontop: onTop }" class="music-player border d-flex align-items-center justify-content-center gap-5">
    <div class="controls-1 d-flex gap-3 align-items-center">
      <div class="front r-icon" @click.stop="">
        <Icon icon="bi:skip-start" width="25" height="25" />
      </div>
      <div class="togglePlay r-icon" @click.stop="togglePlay">
        <Icon v-if="!isPlay" icon="bi:play-circle" width="35" height="35" title="播放" />
        <Icon v-else icon="bi:pause-circle" width="35" height="35" title="暂停" />
      </div>
      <div class="next r-icon" @click.stop="">
        <Icon icon="bi:skip-end" width="25" height="25" />
      </div>
    </div>
    <div class="controls-2 d-flex gap-3 align-items-center">
      <div class="mode r-icon" @click.stop="switchMode()">
        <div class="loop r-icon" v-if="mode === 'loop'">
          <Icon icon="bi:repeat" width="25" height="25" />
        </div>
        <div class="shuffle r-icon" v-if="mode === 'shuffle'">
          <Icon icon="bi:shuffle" width="25" height="25" />
        </div>
        <div class="repeat r-icon" v-if="mode === 'repeat'">
          <Icon icon="bi:repeat-1" width="25" height="25" />
        </div>
      </div>

      <BPopover class="volume">
        <template #target>
          <div class="volume-icons r-icon" @click.stop="handleMuted">
            <div v-if="!muted">
              <Icon icon="bi:volume-down" v-if="volume < 50 && volume > 0" width="30" height="30" />
              <Icon icon="bi:volume-up" v-if="volume >= 50" width="30" height="30" />
              <Icon icon="bi:volume-off" v-if="volume == 0" width="30" height="30" />
            </div>
            <div v-else>
              <Icon icon="bi:volume-mute" width="30" height="30" />
            </div>
          </div>
        </template>
        <template #default>
          <div class="volume-range">
            <div class="range text-center">{{ volume }}%</div>
            <BFormInput v-model="volume" type="range" min="0" max="100" />
          </div>
        </template>
      </BPopover>
    </div>

    <div class="r-progressBar d-flex align-items-center gap-3 user-select-none" @click.stop="">
      <div class="thumbail-album rounded border r-icon" @click.stop="toggleExpand()">
        <img class="thumbail-img" src="/ysg.jpg" />
      </div>
      <span>00:00</span>
      <input class="progress" v-model="duration" type="range" min="0" />
      <span>02:00</span>
    </div>
    <div class="controls-3 d-flex gap-4 align-items-center">
      <div class="like r-icon" @click.stop="">
        <Icon icon="bi:heart" width="20" height="20" />
      </div>
      <div class="comment r-icon" @click.stop="">
        <Icon icon="bi:chat-text" width="20" height="20" />
      </div>
      <div class="music-queue r-icon" @click.stop="toggleMusicList()">
        <Icon icon="bi:music-note-list" width="20" height="20" />
      </div>
    </div>

    <BOffcanvas body-scrolling header-class="fw-bold" lazy no-backdrop shadow="lg" title="播放列表" :placement="placement"
      v-model="show">
      <template #default>
        <div class="buttons">
          <BButton size="sm" variant="outline-secondary" class="clear d-inline-flex align-items-center gap-1 me-1">
            <Icon icon="bi:trash" width="16" height="16" /> 清空列表
          </BButton>
          <BButton size="sm" variant="outline-secondary" class="collect d-inline-flex align-items-center gap-1">
            <Icon icon="bi:plus-square" width="16" height="16" />
            收藏全部
          </BButton>
        </div>
        <div class="scroll-list mt-5">1 2 3</div>
      </template>
      <template #footer> </template>
    </BOffcanvas>
    <BModal @backdrop="toggleExpand()" size="xl" id="music-player-inner" no-header-close backdrop scrollable centered
      no-footer lazy>
      <template #header>
        <BButton size="sm" variant="outline-dark" @click="toggleExpand()">
          <Icon icon="bi:chevron-bar-down"></Icon>
        </BButton>
      </template>
      <div class="rs-controls-1 d-flex align-items-center flex-row gap-2">
        <div class="img-list user-select-none">
          <BImg v-for="img in img_list" @click="console.log('nihaoshijie')" :src="img.url" :alt="img.alt" rounded
            width="250" />
        </div>

        <div class="rs-song-info d-flex flex-column user-select-none p-3">
          <div class="rs-title fw-bold h5">明灯愿</div>
          <div class="rs-info d-flex gap-4 text-secondary mb-5">
            <span>歌手：叶瞬光</span>
            <!-- <span>专辑：青冥剑</span> -->
          </div>
          <div class="lyrics d-flex flex-column align-items-start gap-4">
            <span v-for="ls in lyrics">{{ ls }}</span>
          </div>
        </div>
      </div>
    </BModal>
  </div>
</template>
<style lang="scss" scoped>
.ontop {
  z-index: 1054;
  will-change: z-index;
}

.r-icon {
  cursor: pointer;
  will-change: transform;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.img-list {
  display: flex;
  flex-direction: row;

  img:nth-child(even) {
    z-index: 2;
    will-change: transform;
    filter: brightness(1.2);
    transform: scale(1.2);
  }

  img:nth-child(odd) {
    will-change: transform;
  }

  img:first-child {
    transform: translateX(50px) scale(0.9);
    filter: saturate(0.9);
    z-index: 1;
  }

  img:last-child {
    transform: translateX(-50px) scale(0.9);
    filter: saturate(0.9);
    z-index: 1;
  }
}

.music-player {
  width: 100%;
  height: 53px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  background-color: rgba(240, 240, 240, 0.7);
  backdrop-filter: blur(20px) saturate(1.05);
  border-top: 1px solid rgba(255, 255, 255, 0.35);
  will-change: z-index;

  .thumbail-album {
    width: 40px;
    height: 40px;
    overflow: hidden;
    box-shadow: 2px 2px 1px;

    .thumbail-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      image-rendering: auto;
    }
  }

  .r-progressBar {
    [type="range"] {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
      outline: 0;
      background-color: transparent;
      width: 400px;
      height: 20px;
    }

    // 线背景
    [type="range"]::-webkit-slider-runnable-track {
      height: 4px;
      background: #464444;
    }

    /* 小球 */
    [type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: rgb(204, 115, 115);
      border: 1px solid white;
      margin-top: -6px;
      border-image: linear-gradient(#df5634, #ffb7b7) 0 fill / 8 20 8 0 / 0px 0px 0 2000px;
      will-change: background;
      transition: all 0.3s ease;
    }

    /* 鼠标悬停效果 */
    input[type="range"]::-webkit-slider-thumb:hover {
      background: rgb(178, 34, 34);
    }
  }
}
</style>
