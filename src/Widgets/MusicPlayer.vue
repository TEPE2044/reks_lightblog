<script setup lang="ts">
import { useToggle } from "bootstrap-vue-next";
import { computed, onMounted, onUnmounted, ref } from "vue";

const player = useToggle("music-player");
const toggleMusicPlayer = () => {
  player.toggle();
  expand.value = !expand.value;
};
const expand = ref(false);

// 音频长度
const duration = ref(120);
const viewWidth = ref(window.visualViewport?.width ?? 0);
const amouse = ref(0);
const bprogress = computed(
  () => (amouse.value / viewWidth.value) * duration.value
);
const isDragged = ref(false);

// 🐀动
const amouseMove = (e: MouseEvent) => {
  if (!isDragged.value) return;
  amouse.value = e.clientX;
};
// 🐀放
const amouseUp = () => {
  isDragged.value = false;
  document.removeEventListener("mousemove", amouseMove);
  document.removeEventListener("mouseup", amouseUp);
};
// 🐀按
const amouseDown = (e: MouseEvent) => {
  isDragged.value = true;
  amouse.value = e.clientX;
  document.addEventListener("mousemove", amouseMove);
  document.addEventListener("mouseup", amouseUp);
};
onMounted(() => {
  window.addEventListener("resize", () => {
    viewWidth.value = window.visualViewport?.width ?? 0;
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", () => {});
  document.removeEventListener("mousemove", amouseMove);
  document.removeEventListener("mouseup", amouseUp);
});
</script>

<template>
  <!-- <div class="mouse">鼠标：{{ amouse }}</div>
  <div class="mouse">屏幕：{{ viewWidth }}</div> -->

  <div class="music-player">
    <BModal
      size="xl"
      id="music-player"
      no-footer
      no-header-close
      scrollable
      centered
      no-trap
      class="w-100 h-100"
    >
      <template #header>
        <BButton
          class="float-start"
          variant="outline-dark"
          @click="toggleMusicPlayer"
          ><i class="bi bi-chevron-bar-down"></i
        ></BButton>
      </template>
      <div class="rs-controls-1 mx-auto d-flex justify-content-center align-items-center flex-column gap-4 p-4">
        <BImg src="/san.png" alt="Beyond" rounded width="200" />
        <div class="rs-song-info">
          <h3>海阔天空</h3>
          <p>歌手：Beyond</p>
          <p>专辑：海阔天空</p>
          <p>发行年份：1993</p>
        </div>

      </div>
    </BModal>




    <div class="rs-progress-bar" @mousedown="amouseDown">
      <div id="pg" class="rs-progress-bg"></div>
      <BProgress
        translate="no"
        class="rs-progress"
        height="6px"
        variant="success"
        :value="bprogress"
        :max="duration"
        animated
      />
      <div
        class="rs-progress-pointer"
        :style="{ left: `${amouse - 2}px` }"
      ></div>
    </div>

    <div
      class="rs-player d-flex justify-content-between align-items-center px-2"
    >
      <div
        class="rs-player-left d-flex justify-content-start align-items-center gap-3"
      >
        <div class="rs-controls-1">
          <div class="rs-btn"><i class="bi bi-skip-start-fill"></i></div>
          <div class="rs-btn rs-play"><i class="bi bi-play-fill"></i></div>
          <div class="rs-btn"><i class="bi bi-skip-end-fill"></i></div>
        </div>
      </div>

      <div
        class="rs-player-main d-flex justify-content-center align-items-center gap-1 position-relative p-2"
      >
        <div class="rs-label position-absolute">Playing</div>
        <div class="rs-song-playing text-center">海阔天空 - Beyond</div>
        <div class="rs-btn ps-3" @click="toggleMusicPlayer">
          <i class="bi bi-chevron-bar-up"></i>
          <!-- 功能：播放列表 -->
        </div>
      </div>

      <div
        class="rs-player-right d-flex justify-content-end align-items-center"
      >
        <div class="rs-controls-2">
          <div class="rs-btn rs-volume">
            <i class="bi bi-volume-up-fill"></i>
          </div>
          <div class="rs-btn rs-volume">
            <i class="bi bi-list"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.progress-bar) {
  transition: none !important;
}

//TODO:展开后的播放器样式
.music-player {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: rgb(255, 237, 230);
  user-select: none;

  .rs-btn {
    border: none;
    will-change: transform;
    transition: transform 0.2s ease-in-out;
    font-size: x-large;
    padding: 3px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.733);
    &:hover {
      transform: scale(1.2);
    }
  }
  .rs-progress-bar {
    width: 100%;
    position: fixed;
    bottom: 65px;
    user-select: none;
    transition: all 0.4s ease;
    .rs-progress-bg {
      width: 100%;
      height: 9px;
      position: absolute;
      top: -3px;
      left: 0;
    }
    .rs-progress-pointer {
      width: 15px;
      height: 15px;
      background-color: rgb(255, 255, 255);
      border: 1px solid black;
      border-radius: 50%;
      position: absolute;
      top: -4.6px;
      will-change: left;
    }
  }
  .rs-player {
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 0;

    .rs-player-main {
      flex: 1 0;
      .rs-song-playing {
        font-weight: 600;
      }
      .rs-label {
        font-size: small;
        transform: translateX(-230%) translateY(-65%);
        color: rgb(0, 0, 0);
        font-family: "Courier New", Courier, monospace;
      }
    }

    .rs-controls-1 {
      display: flex;
      justify-content: start;
      align-items: center;
      .rs-play {
        will-change: transform;
        transition: transform 0.2s ease-in-out;
        font-size: xx-large;
        margin: 0 2px;
        color: rgb(255, 195, 116);
        &:hover {
          transform: scale(1.3);
        }
      }
    }

    .rs-controls-2 {
      display: flex;
      justify-content: end;
      align-items: center;
      gap: 10px;
      .rs-volume {
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }
}
</style>
