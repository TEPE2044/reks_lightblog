import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { Howl } from "howler";
import { formatPlayerTime } from "../Utils/reks-format-time";
import type { QueueItem } from "../Utils/reks-interface";

// 全局播放器实例
// bug-fix:修复了下一首播放时，组件拿不到最新的player实例的问题
let player: Howl | null = null;

export const playerStore = defineStore("player", () => {
  //播放模式
  const mode = ref<string>("loop");
  //  const mode        = ref<'loop' | 'shuffle' | 'repeat'>('loop')
  const duration = ref<string>("");
  const currentTime = ref<string>("");
  const progress = ref<number>(0);
  const isHidden = ref(false);
  const toggleHidden = () => {
    isHidden.value = !isHidden.value;
  };

  watch(mode, () => {
    if (player) {
      if (mode.value === "repeat") {
        player.loop(true);
      }
    }
  });

  /* 播放列表 
  增删
  1. playList 列表
  2. playListLength 列表长度
  3. nowIndex 当前播放位置
  4. 删除后进行下一首
  */

  const playList = ref<Array<QueueItem>>([]);
  const playListLength = computed(() => playList.value.length);
  const currentIndex = ref<number>(0);
  // 不重复增加
  // 下一首播放？ 需要考虑不同情况
  // 如果现在是最后一首咋办:那就用push
  // 非最后一首的情况都用splice(currentIndex,0,data)，splice第二个是删除的个数
  const addIntoPlayList = (data: QueueItem, currentIndex: number) => {
    // 没法用included，includes比较的是对象引用，而data每次都是新创建的对象（即使内容一样），引用地址不同
    let isExisted = playList.value.some(
      (song) => song.songURL === data.songURL,
    );
    console.log(isExisted);
    if (isExisted === false) {
      if (currentIndex === playListLength.value - 1) {
        playList.value.push(data);
      } else {
        playList.value.splice(currentIndex + 1, 0, data);
      }
      console.log(playList.value);
    }
  };
  // 删除
  const removeFromPlayList = (idx: number) => {
    // 如果删除的是当前播放的歌曲，播放下一首
    // 如果删除的是最后一首，并且是当前播放的歌曲，播放前一首
    if (idx === currentIndex.value) {
      currentIndex.value = currentIndex.value + 1;
      if (currentIndex.value === playListLength.value - 1) {
        currentIndex.value = currentIndex.value - 1;
      }
    }
    playList.value = playList.value.filter(
      (song) => song !== playList.value[idx],
    );
    console.log(playList.value);
  };
  // 删除全部
  const removeAll = () => {
    playList.value = [];
    console.log(playList.value);
  };

  // 播放状态
  const isPlay = ref<boolean>(false);
  // 播放器就绪
  const isReady = ref<boolean>(false);

  /*声音控制组*/
  // 是否静音
  const muted = ref<boolean>(false);
  // 音量 TODO:默认是40，后面存入localstorage，保存用户的设定
  const volume = ref<number>(40);
  // 保存按钮
  const tempVolume = ref<number>(0);

  watch(volume, (newVolume) => {
    if (player) {
      player.volume(newVolume / 100);
    }
  });

  const createPlayer = () => {
    player?.unload();
    player = new Howl({
      src: [playList.value[currentIndex.value]?.songURL as string],
      autoplay: false,
      volume: volume.value / 100,
      onload: () => {
        isReady.value = true;
        console.log("播放器就绪");
      },
      onend: () => {
        if (mode.value !== "repeat") {
          isPlay.value = false;
          console.log("歌曲结束");
          player?.unload();
          player?.pause();
          nextSong();
        }
      },
      onplay: () => {
        isPlay.value = true;
        console.log("开始播放");
      },
      onpause: () => {
        isPlay.value = false;
        console.log("暂停播放");
      },
    });
    return player;
  };
  // 初始化播放列表
  const initPlayList = (data: Array<QueueItem>) => {
    playList.value = data;
    currentIndex.value = 0;
    duration.value = "00:00";
    currentTime.value = "00:00";
    progress.value = 0;
  };
  // 静音控制
  const handleMuted = () => {
    muted.value = !muted.value;
    if (muted.value === true) {
      tempVolume.value = volume.value;
      volume.value = 0;
    } else {
      volume.value = tempVolume.value;
    }
  };
  // 播放暂停切换
  const togglePlay = () => {
    if (isReady.value === false) {
      return;
    }
    isPlay.value = !isPlay.value;
    if (isPlay.value === true) {
      player?.play();
    } else {
      player?.pause();
    }
  };

  const updateTime = () => {
    const current = Math.round(player?.seek() as number) as number;
    const total = Math.round(player?.duration() as number) as number;
    currentTime.value = formatPlayerTime(current);
    duration.value = formatPlayerTime(total);
    progress.value = (current / total) * 100;
    console.log(total, current);
  };

  // 如果有下一首，获取下一首的进行播放,先卸载unload，然后src重新设置
  const nextSong = () => {
    currentIndex.value = (currentIndex.value + 1) % playListLength.value;
    switchSong();
  };
  const frontSong = () => {
    currentIndex.value = (currentIndex.value - 1) % playListLength.value;
    switchSong();
  };

  // bug 切换歌曲的时候进度条和时间没有重置
  const switchSong = () => {
    duration.value = "00:00";
    currentTime.value = "00:00";
    progress.value = 0;
    player?.unload();
    createPlayer();
    player?.play();
    isPlay.value = true;
  };

  //TODO:点击播放分成两种
  // 一种是列表里的点击播放，一种是别的地方点击播放，第一种点击播放非常好办，只需要获取idx就行；
  // 第二种需要先判断当前播放列表里有没有这首歌，没有就添加，有就获取索引，然后播放
  const selectFromList = (idx: number) => {
    currentIndex.value = idx;
    switchSong();
  };

  const handleClickPlay = (value: number) => {
    const total = Math.round(player?.duration() as number) as number;
    player?.seek((value / 100) * total);
    updateTime();
  };

  return {
    playList,
    isPlay,
    isReady,
    volume,
    muted,
    mode,
    currentIndex,
    duration,
    currentTime,
    progress,
    isHidden,
    toggleHidden,
    initPlayList,
    updateTime,
    handleMuted,
    addIntoPlayList,
    removeFromPlayList,
    removeAll,
    createPlayer,
    togglePlay,
    nextSong,
    frontSong,
    selectFromList,
    handleClickPlay
  };
});
