<script setup lang="ts">
import { ref, shallowRef, onMounted, watch, onUnmounted } from "vue";
import {
  useDebounceFn,
  useIntervalFn,
  useToggle as vuseToggle,
} from "@vueuse/core";
import { useToggle } from "bootstrap-vue-next";
import type { Placement } from "bootstrap-vue-next";
import { playerStore } from "../Store/player";
import { storeToRefs } from "pinia";
const {
  playQueue,
  isHidden,
  isPlay,
  muted,
  volume,
  mode,
  currentIndex,
  duration,
  currentTime,
  progress,
} = storeToRefs(playerStore());
const {
  handleMuted,
  removeAll,
  removeFromPlayQueue,
  updateTime,
  createPlayer,
  togglePlay,
  nextSong,
  frontSong,
  selectFromList,
  handleClickPlay,
} = playerStore();
console.log(playQueue.value);
const updateTimer = useIntervalFn(
  () => {
    updateTime();
  },
  500,
  { immediate: false },
);
watch(isPlay, () => {
  if (isPlay.value === true) {
    updateTimer.resume();
  } else {
    updateTimer.pause();
  }
});
onMounted(() => {
  // initPlayQueue();
  //复用变量但创建新实例
  createPlayer();
});

/*
  1.创建Howl实例 y
  2.初始化播放队列 y
  3.控制播放暂停，以及歌曲开始与结束 y
  4.音量控制 y
  5.循环控制 y
  6.上一首和下一首 y
  7.点击播放:先暂停，加载 y
  */

//datas
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

// 评论数据与操作
const commentList = ref([
  { id: 1, author: "游客", avatar: "/ysg.jpg", time: "刚刚", content: "好音乐！" },
]);
const newComment = ref("");
const postComment = () => {
  if (!newComment.value.trim()) return;
  commentList.value.unshift({
    id: Date.now(),
    author: "我",
    avatar: "/ysg1.jpg",
    time: Date.now().toString(),
    content: newComment.value.trim(),
  });
  newComment.value = "";
};
// TODO:只能删除自己的评论
const deleteComment = (id: number) => {
  commentList.value = commentList.value.filter((c) => c.id !== id);
};

// 模式选择
const modeList = ref(["loop", "shuffle", "repeat"]);
const switchMode = useDebounceFn(() => {
  const currentIndex = modeList.value.indexOf(mode.value);
  const nextIndex = (currentIndex + 1) % modeList.value.length;
  mode.value = modeList.value[nextIndex] as string;
}, 300);
// 播放列表
const isOffc = ref(false);
const placement = ref<Placement>("end");
const toggleMusicList = () => {
  isOffc.value = !isOffc.value;
  onTop.value = false;
  expand.hide();
};
// 评论界面
const comments = useToggle("comment-area")
const toggleComment = () =>{
  comments.toggle()
}
// 详细界面
const expand = useToggle("music-player-inner");
const [onTop, toggleTop] = vuseToggle();

const toggleHidden = () => {
  isHidden.value = !isHidden.value;
  if (isHidden.value === true) {
    isOffc.value = false;
    onTop.value = false;
  }
};
const toggleExpand = () => {
  toggleTop();
  expand.toggle();
  isOffc.value = false;
};

const handleCloseOffCanvas = (e: MouseEvent) => {
  const offc = document.getElementById("offc") as HTMLElement;
  // 如果offc包括自己
  if (offc?.contains(e.target as Node)) return;
  isOffc.value = false;
};

watch(isOffc, (offcanvas_show) => {
  if (offcanvas_show) {
    // 后面改用vueuse的EventListener
    document.addEventListener("click", handleCloseOffCanvas);
  } else {
    document.removeEventListener("click", handleCloseOffCanvas);
  }
});
onUnmounted(() => {
  document.removeEventListener("click", handleCloseOffCanvas);
});
</script>

<template>
  <div class="hidden-player" v-if="isHidden">
    <BButton size="sm" variant="outline-dark" @click="toggleHidden()"
      >展开播放器</BButton
    >
  </div>
  <div
    :class="{ ontop: onTop }"
    class="music-player border d-flex align-items-center justify-content-center gap-5"
    v-else
  >
    <div class="controls-1 d-flex gap-3 align-items-center">
      <div class="front r-icon" @click.stop="frontSong()">
        <i-bi-skip-start style="font-size: 1.5rem" />
      </div>
      <div class="togglePlay r-icon" @click.stop="togglePlay()">
        <i-bi-play-circle v-if="!isPlay" style="font-size: 2rem" title="播放" />
        <i-bi-pause-circle v-else style="font-size: 2rem" title="暂停" />
      </div>
      <div class="next r-icon" @click.stop="nextSong()">
        <i-bi-skip-end style="font-size: 1.5rem" />
      </div>
    </div>
    <div class="controls-2 d-flex gap-3 align-items-center">
      <div class="mode r-icon" @click.stop="switchMode()">
        <i-bi-repeat v-if="mode === 'loop'" style="font-size: 1.5rem" />
        <i-bi-shuffle v-if="mode === 'shuffle'" style="font-size: 1.5rem" />
        <i-bi-repeat-1 v-if="mode === 'repeat'" style="font-size: 1.5rem" />
      </div>

      <BPopover class="volume">
        <template #target>
          <div class="volume-icons r-icon" @click.stop="handleMuted">
            <div v-if="!muted">
              <i-bi-volume-down
                v-if="volume < 50 && volume > 0"
                style="font-size: 1.8rem"
              />
              <i-bi-volume-up v-if="volume >= 50" style="font-size: 1.8rem" />
              <i-bi-volume-off v-if="volume == 0" style="font-size: 1.8rem" />
            </div>
            <div v-else>
              <i-bi-volume-mute style="font-size: 1.8rem" />
            </div>
          </div>
        </template>
        <template #default v-if="!muted">
          <div class="volume-range">
            <div class="range text-center">{{ volume }}%</div>
            <BFormInput v-model="volume" type="range" min="0" max="100" />
          </div>
        </template>
      </BPopover>
    </div>

    <div
      class="r-progressBar d-flex align-items-center gap-3 user-select-none"
      @click.stop=""
    >
      <div
        class="thumbail-album rounded border r-icon"
        @click.stop="toggleExpand()"
      >
        <img class="thumbail-img" :src="playQueue[currentIndex]?.cover" />
      </div>
      <span>{{ currentTime }}</span>
      <BFormInput
        @input="handleClickPlay(progress)"
        class="progress"
        v-model="progress"
        type="range"
        max="100"
        min="0"
      />
      <span>{{ duration }}</span>
    </div>
    <div class="controls-3 d-flex gap-4 align-items-center">
      <div class="like r-icon" @click.stop="">
        <i-bi-heart style="font-size: 1.2rem" />
      </div>
      <div class="comment r-icon" @click.stop="toggleComment()">
        <i-bi-chat-text style="font-size: 1.2rem" />
      </div>
      <div class="music-queue r-icon" @click.stop="toggleMusicList()">
        <i-bi-music-note-list style="font-size: 1.2rem" />
      </div>
      <BButton size="sm" @click="toggleHidden()">最小化播放器</BButton>
    </div>

    <BOffcanvas
      width="30rem"
      body-scrolling
      lazy
      no-backdrop
      shadow="lg"
      :placement="placement"
      v-model="isOffc"
      id="offc"
      class="px-1"
    >
      <template #header>
        <div class="oc-header d-flex flex-column justify-content-center">
          <div
            class="oc-header-top w-100 d-flex flex-row align-items-center justify-content-between"
          >
            <div class="title fw-bold h5 flex-grow-1">播放列表</div>
            <BButton
              @click.stop="toggleMusicList"
              class="header-close d-inline-flex align-items-center justify-content-center"
              variant="outline-dark"
            >
              <i-bi-x-lg style="font-size: 1rem" />
            </BButton>
          </div>

          <div class="oc-btns mt-3">
            <BButton
              @click.stop="removeAll()"
              size="sm"
              variant="outline-secondary"
              class="clear d-inline-flex align-items-center gap-1 me-1"
            >
              <i-bi-trash style="font-size: 1rem" /> 清空列表
            </BButton>
            <BButton
              size="sm"
              variant="outline-secondary"
              class="collect d-inline-flex align-items-center gap-1"
            >
              <i-bi-plus-square style="font-size:1rem;" />
              收藏全部
            </BButton>
          </div>
        </div>
      </template>
      <template #default>
        <div class="scroll-list">
          <div
            v-for="song in playQueue"
            :key="`reks${song}`"
            class="list-item position-relative p-3 border rounded-1 mt-3 d-flex justify-content-between align-items-center shadow-sm"
          >
            <div
              class="meta d-flex flex-row align-items-center justify-content-center position-absolute"
            >
              <div
                class="btns d-flex flex-row align-items-center justify-content-center gap-4"
              >
                <BButton
                  variant="light"
                  size="sm"
                  @click.stop="selectFromList(playQueue.indexOf(song))"
                >
                  <i-bi-play-circle style="font-size:1rem;" />
                </BButton>
                <BButton
                  variant="light"
                  size="sm"
                  @click.stop="removeFromPlayQueue(playQueue.indexOf(song))"
                >
                  <i-bi-trash style="font-size:1rem;" />
                </BButton>
                <BDropdown
                  :auto-close="true"
                  no-caret
                  no-flip
                  offset="25"
                  placement="left"
                  variant="light"
                  size="sm"
                >
                  <template #button-content>
                   <i-bi-three-dots  style="font-size:1rem;" />
                  </template>
                  <template #default>
                    <BDropdownItem @click.stop="toggleComment()">
                      <i-bi-chat-left-dots style="font-size:1rem;" />
                      评论
                    </BDropdownItem>
                    <BDropdownDivider></BDropdownDivider>
                    <BDropdownItem
                      @click.stop="removeFromPlayQueue(playQueue.indexOf(song))"
                    >
                      <i-bi-trash       style="font-size:1rem;" />
                      删除
                    </BDropdownItem>
                  </template>
                </BDropdown>
              </div>
            </div>

            <div class="left d-flex align-items-center gap-3">
              <div class="cover">
                <BAvatar square :src="song.cover" />
              </div>
              <div class="info d-inline-flex flex-column align-items-start">
                <span class="title h5">{{ song.title  }}</span>
                <span class="author text-secondary">{{ song.author }}</span>
              </div>
            </div>
            <div class="right text-secondary">06:01</div>
          </div>
        </div>
      </template>
      <template #footer> </template>
    </BOffcanvas>
    <BModal size="xl" backdrop scrollable lazy no-footer :title="`评论区(${commentList.length})`" centered id="comment-area">
      <div class="comment-area p-3">
        <div class="comment-list mb-3">
            <div v-if="commentList.length === 0" class="comment-empty d-flex flex-column align-items-center justify-content-center p-4 text-secondary">
              <i-bi-chat-dots style="font-size:2rem" />
              <div class="mt-2">还没有评论，快来抢沙发 ~</div>
            </div>
            <div v-else>
              <div
                v-for="c in commentList"
                :key="c.id"
                class="comment-item d-flex gap-3 p-2 align-items-start"
              >
                <BAvatar :src="c.avatar" square class="comment-avatar" />
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <div class="fw-bold">{{ c.author }}</div>
                    <div class="d-flex align-items-center gap-2">
                      <div class="text-secondary small">{{ c.time }}</div>
                      <BButton size="sm" variant="outline-danger" class="delete-comment" @click.stop="deleteComment(c.id)">删除</BButton>
                    </div>
                  </div>
                  <div class="comment-content text-wrap">{{ c.content }}</div>
                </div>
              </div>
            </div>
        </div>

        <div class="comment-input d-flex gap-2 align-items-start">
          <BAvatar src="/ysg1.jpg" square class="comment-avatar-sm" />
          <div class="flex-grow-1">
            <BFormTextarea v-model="newComment" rows="3" placeholder="写下你的评论..." />
            <div class="d-flex justify-content-end mt-2">
              <BButton size="sm" class="ms-2" variant="primary" @click="postComment()">发送</BButton>
            </div>
          </div>
        </div>
      </div>
    </BModal>
    <BModal
      @backdrop="toggleExpand()"
      size="xl"
      id="music-player-inner"
      no-header-close
      backdrop
      scrollable
      centered
      no-footer
      lazy
    >
      <template #header>
        <BButton size="sm" variant="outline-dark" @click="toggleExpand()">
          <i-bi-chevron-bar-down style="font-size: 1.2rem" />
        </BButton>
      </template>
      <div class="rs-controls-1 d-flex align-items-center flex-row gap-2">
        <div class="img-list user-select-none">
          <BImg
            v-for="img in img_list"
            @click="console.log('nihaoshijie')"
            :src="img.url"
            :alt="img.alt"
            rounded
            width="250"
          />
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

.oc-header {
  width: 500px;
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

.scroll-list {
  min-height: 10rem;
  overflow: hidden;
  overflow-block: hidden;

  .list-item {
    will-change: filter transform;
    transition: all 0.3s ease;

    .meta {
      inset: 0;
      visibility: hidden;
      background-color: #46444400;
      cursor: pointer;
    }

    &:hover {
      transform: scale(1.01);

      .meta {
        visibility: visible;
        background-color: #464444be;
        z-index: 1;
      }
    }
  }
}

.hidden-player {
  width: fit-content;
  position: fixed;
  bottom: 20px;
  left: auto;
  right: 30px;
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
      background-color: rgb(218, 85, 85);
      border: 1px solid white;
      margin-top: -6px;
      border-image: linear-gradient(#df5634, #ffb7b7) 0 fill / 8 22 9 0 / 0px
        0px 0 2000px;
      will-change: background;
      transition: all 0.3s ease;
    }

    /* 鼠标悬停效果 */
    input[type="range"]::-webkit-slider-thumb:hover {
      background: rgb(178, 34, 34);
    }
  }
}

.comment-area {
  /* 固定整体高度，评论列表可滚动，输入区固定在底部 */
  height: 500px;
  display: flex;
  flex-direction: column;

  .comment-list {
    flex: 1 1 auto;
    overflow: auto;
    padding-right: 0.25rem;

    .comment-item {
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.6);
    }
  }

  .comment-avatar {
    width: 44px;
    height: 44px;
  }

  .comment-avatar-sm {
    width: 36px;
    height: 36px;
  }

  .comment-content {
    white-space: pre-wrap;
    word-break: break-word;
  }

  .comment-input {
    flex: 0 0 auto;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    padding-top: 0.75rem;
    background: transparent;

    /* 禁止 textarea 拖动/缩放，并固定高度（焊死） */
    textarea,
    .form-control {
      resize: none;
      height: 72px !important;
      max-height: 72px !important;
      min-height: 72px !important;
    }
  }
}

.comment-empty {
  min-height: 140px;
}

.delete-comment {
  padding: 0.15rem 0.5rem;
  font-size: 0.8rem;
}
</style>
