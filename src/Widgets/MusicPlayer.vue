    <script setup lang="ts">
    import { Icon } from "@iconify/vue";
    import {
      ref,
      shallowRef,
      onMounted,
      watch,
      onUnmounted
    } from "vue";
    import { useDebounceFn, useIntervalFn } from "@vueuse/core";
    import { useToggle } from "bootstrap-vue-next";
    import type { Placement } from "bootstrap-vue-next";
    import { playerStore } from "../Store/player";
    import { storeToRefs } from "pinia";
    const { playList, isPlay, muted, volume, mode, currentIndex, duration, currentTime, progress } = storeToRefs(
      playerStore()
    );
    const {
      initPlayList,
      handleMuted,
      addIntoPlayList,
      removeAll,
      removeFromPlayList,
      updateTime,
      createPlayer,
      togglePlay,
      nextSong,
      frontSong,
      selectFromList,
      handleClickPlay
    } = playerStore();
    const fakeDatas = [
      {
        cover: "/ai.webp",
        songURL:
          "https://projeck.obs.cn-south-1.myhuaweicloud.com/Radios/1/20250706210102_audio.mp3",
      },
      {
        cover: "/ysg2.jpg",
        songURL:
          "https://projeck.obs.cn-south-1.myhuaweicloud.com/Radios/1/20250720132105_audio.mp3",
      },
      {
        cover: "/ysg1.jpg",
        songURL:
          "https://projeck.obs.cn-south-1.myhuaweicloud.com/Radios/1/20250706210102_audio.mp3",
      },
      {
        cover: "/mod.webp",
        songURL:
          "https://projeck.obs.cn-south-1.myhuaweicloud.com/Radios/1/20250706210102_audio.mp3",
      },
      {
        cover: "/mod.webp",
        songURL:
          "https://projeck.obs.cn-south-1.myhuaweicloud.com/Radios/1/20250706210102_audio.mp3",
      },
      {
        cover: "/mod.webp",
        songURL:
          "https://projeck.obs.cn-south-1.myhuaweicloud.com/Radios/1/20250706210102_audio.mp3",
      },
      {
        cover: "/mod.webp",
        songURL:
          "https://projeck.obs.cn-south-1.myhuaweicloud.com/Radios/1/20250706210102_audio.mp3",
      },
      {
        cover: "/mod.webp",
        songURL:
          "https://projeck.obs.cn-south-1.myhuaweicloud.com/Radios/1/20250706210102_audio.mp3",
      },
      {
        cover: "/mod.webp",
        songURL:
          "https://projeck.obs.cn-south-1.myhuaweicloud.com/Radios/1/20250706210102_audio.mp3",
      },
      {
        cover: "/mod.webp",
        songURL:
          "https://projeck.obs.cn-south-1.myhuaweicloud.com/Radios/1/20250706210102_audio.mp3",
      },
      {
        cover: "/mod.webp",
        songURL:
          "https://projeck.obs.cn-south-1.myhuaweicloud.com/Radios/1/20250706210102_audio.mp3",
      },
      {
        cover: "/mod.webp",
        songURL:
          "https://projeck.obs.cn-south-1.myhuaweicloud.com/Radios/1/20250706210102_audio.mp3",
      },
    ];
    console.log(playList.value);
      const updateTimer = useIntervalFn(() => {
      updateTime();
    }, 500, { immediate: false });
    watch(isPlay, () => {
      if (isPlay.value === true) {
        updateTimer.resume();
      } else {
        updateTimer.pause();
      }
    })
    onMounted(() => {
      initPlayList(fakeDatas);
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

    // 播放列表
    const isOffc = ref(false);
    const placement = ref<Placement>("end");
    const toggleMusicList = () => {
      isOffc.value = !isOffc.value;
      onTop.value = false;
      expand.hide();
    };
    // 模式选择
    const modeList = ref(["loop", "shuffle", "repeat"]);
    const switchMode = useDebounceFn(() => {
      const currentIndex = modeList.value.indexOf(mode.value);
      const nextIndex = (currentIndex + 1) % modeList.value.length;
      mode.value = modeList.value[nextIndex] as string;
    }, 300);
    // 详细界面
    const expand = useToggle("music-player-inner");
    const onTop = ref(false);
    const toggleExpand = () => {
      onTop.value = !onTop.value;
      expand.toggle();
      isOffc.value = false;
    };

    const testX = () => {
      console.log("你好");
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
      <button @click="addIntoPlayList({ cover: '/lh.jpg', songURL: 'sdasdas' }, currentIndex)">
        加入一首歌
      </button>
      <div :class="{ ontop: onTop }" class="music-player border d-flex align-items-center justify-content-center gap-5">
        <div class="controls-1 d-flex gap-3 align-items-center">
          <div class="front r-icon" @click.stop="frontSong()">
            <Icon icon="bi:skip-start" width="25" height="25" />
          </div>
          <div class="togglePlay r-icon" @click.stop="togglePlay()">
            <Icon v-if="!isPlay" icon="bi:play-circle" width="35" height="35" title="播放" />
            <Icon v-else icon="bi:pause-circle" width="35" height="35" title="暂停" />
          </div>
          <div class="next r-icon" @click.stop="nextSong()">
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
            <template #default v-if="!muted">
              <div class="volume-range">
                <div class="range text-center">{{ volume }}%</div>
                <BFormInput v-model="volume" type="range" min="0" max="100" />
              </div>
            </template>
          </BPopover>
        </div>

        <div class="r-progressBar d-flex align-items-center gap-3 user-select-none" @click.stop="">
          <div class="thumbail-album rounded border r-icon" @click.stop="toggleExpand()">
            <img class="thumbail-img" :src="playList[currentIndex]?.cover" />
          </div>
          <span>{{ currentTime }}</span>
          <BFormInput @input="handleClickPlay(progress)" class="progress" v-model="progress" type="range" max="100" min="0" />
          <span>{{ duration }}</span>
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

        <BOffcanvas width="30rem" body-scrolling lazy no-backdrop shadow="lg" :placement="placement" v-model="isOffc"
          id="offc" class="px-1">
          <template #header>
            <div class="oc-header d-flex flex-column justify-content-center">
              <div class="oc-header-top w-100 d-flex flex-row align-items-center justify-content-between">
                <div class="title fw-bold h5 flex-grow-1">播放列表</div>
                <BButton @click.stop="toggleMusicList"
                  class="header-close d-inline-flex align-items-center justify-content-center" variant="outline-dark">
                  <Icon icon="bi:x-lg" width="16" height="16" />
                </BButton>
              </div>

              <div class="oc-btns mt-3">
                <BButton @click.stop="removeAll()" size="sm" variant="outline-secondary"
                  class="clear d-inline-flex align-items-center gap-1 me-1">
                  <Icon icon="bi:trash" width="16" height="16" /> 清空列表
                </BButton>
                <BButton size="sm" variant="outline-secondary" class="collect d-inline-flex align-items-center gap-1">
                  <Icon icon="bi:plus-square" width="16" height="16" />
                  收藏全部
                </BButton>
              </div>
            </div>
          </template>
          <template #default>
            <div class="scroll-list">
              <div v-for="song in playList" :key="`reks${song}`"
                class="list-item position-relative p-3 border rounded-1 mt-3 d-flex justify-content-between align-items-center shadow-sm">
                <div class="meta d-flex flex-row align-items-center justify-content-center position-absolute">
                  <div class="btns d-flex flex-row align-items-center justify-content-center gap-4">
                    <BButton variant="light" size="sm" @click.stop="selectFromList(playList.indexOf(song))">
                      <Icon icon="bi:play-circle" width="16" height="16" />
                    </BButton>
                    <BButton variant="light" size="sm" @click.stop="testX()">
                      <Icon icon="bi:heart" width="16" height="16" />
                    </BButton>
                    <BButton variant="light" size="sm" @click.stop="removeFromPlayList(playList.indexOf(song))">
                      <Icon icon="bi:trash" width="16" height="16" />
                    </BButton>
                    <BDropdown :auto-close="true" no-caret no-flip offset="25" placement="left" variant="light" size="sm">
                      <template #button-content>
                        <Icon icon="bi:three-dots" width="16" height="16" />
                      </template>
                      <template #default>
                        <BDropdownItem>
                          <Icon icon="bi:chat-left-dots" width="16" height="16" />
                          评论
                        </BDropdownItem>
                        <BDropdownDivider></BDropdownDivider>
                        <BDropdownItem @click.stop="removeFromPlayList(playList.indexOf(song))">
                          <Icon icon="bi:trash" width="16" height="16" />
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
                    <span class="title h5">CeruleanBlue</span>
                    <span class="author text-secondary">Klute</span>
                  </div>
                </div>
                <div class="right text-secondary">06:01</div>
              </div>
            </div>
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
        border-image: linear-gradient(#df5634, #ffb7b7) 0 fill / 8 22 9 0 / 0px 0px 0 2000px;
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
