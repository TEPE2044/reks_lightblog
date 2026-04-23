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
  const isHidden = ref<boolean>(false);

  watch(mode, () => {
    if (player) {
      if (mode.value === "repeat") {
        player.loop(true);
      }
    }
  });

  /* 播放列表 
  增删
  1. playQueue 列表
  2. playQueueLength 列表长度
  3. nowIndex 当前播放位置
  4. 删除后进行下一首
  */

  const playQueue = ref<Array<QueueItem>>([]);
  const playQueueLength = computed(() => playQueue.value.length);
  const currentIndex = ref<number>(0);
  // 不重复增加
  // 下一首播放？ 需要考虑不同情况
  // 如果现在是最后一首咋办:那就用push
  // 非最后一首的情况都用splice(currentIndex,0,data)，splice第二个是删除的个数
  //isExisted = true  → 队列中已存在这首歌
  //isExisted = false  → 队列中不存在这首歌
  const addIntoPlayQueue = (data: QueueItem, currentIndex: number) => {
    // 没法用included，includes比较的是对象引用，而data每次都是新创建的对象（即使内容一样），引用地址不同
    let isExisted = playQueue.value.some(
      (song) => song.songURL === data.songURL,
    );

    console.log(`列表是否存在这首歌？ ${isExisted}`);
    // 这里isExisted仅判断原来的状态，无需更新
    try {
      if (isExisted === false) {
        if (playQueueLength.value === 0) {
          playQueue.value.push(data);
          player?.unload();
          createPlayer();
          return true;
        }
        if (currentIndex === playQueueLength.value - 1) {
          playQueue.value.push(data);
        } else {
          playQueue.value.splice(currentIndex + 1, 0, data);
        }
        // console.log(playQueue.value);
        console.warn("经过操作已插入列表");
        // 完毕返回true
        return true;
      }
      return false;
    } catch (e) {
      player?.unload()
      console.error(e);
      return false;
    }
  };
  // 删除
  const removeFromPlayQueue = (idx: number) => {
    // 如果删除的是当前播放的歌曲，播放下一首
    // 如果删除的是最后一首，并且是当前播放的歌曲，播放前一首
    console.warn(idx);
    console.error(currentIndex.value);

    if (idx === currentIndex.value) {
      console.log(`1长度为${playQueueLength.value}`);
      console.log(playQueue.value);

      currentIndex.value = currentIndex.value + 1;
      if (currentIndex.value === playQueueLength.value - 1) {
        currentIndex.value = currentIndex.value - 1;
      }
    }
    playQueue.value = playQueue.value.filter(
      (song) => song !== playQueue.value[idx],
    );
    if (playQueueLength.value === 0) {
      player?.pause();
      duration.value = "00:00";
      currentTime.value = "00:00";
      progress.value = 0;
      currentIndex.value = 0;
      player?.unload();
    }
    console.log(`2长度为${playQueueLength.value}`);
  };
  // 删除全部
  const removeAll = () => {
    playQueue.value = [];
    player?.pause();
    player?.unload();
    currentIndex.value = 0;
    console.log(playQueue.value);
  };

  // 播放状态
  const isPlay = ref<boolean>(false);
  // 播放器就绪
  const isReady = ref<boolean>(false);

  /*声音控制组*/
  // 是否静音
  const muted = ref<boolean>(false);
  // 音量 默认是40
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
      src: [playQueue.value[currentIndex.value]?.songURL as string],
      autoplay: false,
      html5:true,
      preload:true,
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
      onplayerror:(_id,error) => console.error(error),
      onloaderror:(_id,error) => console.error("play error",error)
    });
    return player;
  };
  // 初始化播放列表
  const initPlayQueue = (data: Array<QueueItem>) => {
    playQueue.value = data;
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
    if (!player) return;
    const currentRaw = Number(player.seek());
    const totalRaw = Number(player.duration());

    const current = Number.isFinite(currentRaw) && currentRaw > 0 ? currentRaw : 0;
    const total = Number.isFinite(totalRaw) && totalRaw > 0 ? totalRaw : 0;

    currentTime.value = formatPlayerTime(Math.round(current));
    duration.value = formatPlayerTime(Math.round(total));

    if (total <= 0) {
      // 切歌/弱网/metadata 未就绪时，避免 NaN 导致 range thumb 跳到中间
      progress.value = 0;
      return;
    }

    const p = (current / total) * 100;
    progress.value = Math.min(100, Math.max(0, Number.isFinite(p) ? p : 0));
    // console.log(total, current);
  };

  // 下一首
  const nextSong = () => {
    currentIndex.value = (currentIndex.value + 1) % playQueueLength.value;
    switchSong();
  };

  // 上一首
  const frontSong = () => {
    if (currentIndex.value === 0) {
      currentIndex.value = playQueueLength.value - 1;
    } else {
      currentIndex.value = (currentIndex.value - 1) % playQueueLength.value;
    }
    switchSong();
  };

  // bug 切换歌曲的时候进度条和时间没有重置
  const switchSong = () => {
    player?.unload();
    createPlayer();
    player?.play();
    isPlay.value = true;
    duration.value = "00:00";
    currentTime.value = "00:00";
    progress.value = 0;
    console.warn("已切换歌曲");
    console.log(currentIndex.value);
  };

  // 点击播放分成两种
  // 一种是列表里的点击播放，一种是别的地方点击播放，第一种点击播放非常好办，只需要获取idx就行；

  const selectFromList = (idx: number) => {
    currentIndex.value = idx;
    switchSong();
  };

  // 逻辑整理：
  // 1.点击按钮后，判断当前歌曲是否在播放列表中
  // 2.存在True 不存在False
  // 3.
  const selectOutSide = (data: QueueItem) => {
    console.log(`当前歌曲位置${currentIndex.value}`);
    // 该行为无论如何都会将这首曲子加入到播放队列中
    //const isExisted = addIntoPlayQueue(data, currentIndex.value);
    addIntoPlayQueue(data, currentIndex.value);
    // console.warn(`该歌曲存在播放列表中? ${isExisted}`);
    try {
      // 无需判断播放器为0的情况,addIntoPlayQueue已经处理，但是currentIndex要变化
      if (playQueueLength.value === 0) {
        currentIndex.value = 0;
        return;
      }
      let songIdx = playQueue.value.findIndex(
        (item) => item.songURL === data.songURL,
      );
      console.error(songIdx);
      if (currentIndex.value !== songIdx || playQueueLength.value <= 1) {
        currentIndex.value = songIdx;
        switchSong();
      }
    } catch (e) {
      console.log("播放失败");
    }
  };

  const handleClickPlay = (value: number) => {
    if (!player) return;
    const totalRaw = Number(player.duration());
    const total = Number.isFinite(totalRaw) && totalRaw > 0 ? totalRaw : 0;
    if (total <= 0) return;

    const v = Number(value);
    const next = (Number.isFinite(v) ? v : 0) / 100;
    player.seek(next * total);
    updateTime();
  };

  return {
    playQueue,
    playQueueLength,
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
    initPlayQueue,
    updateTime,
    handleMuted,
    addIntoPlayQueue,
    removeFromPlayQueue,
    removeAll,
    createPlayer,
    togglePlay,
    nextSong,
    frontSong,
    selectFromList,
    selectOutSide,
    handleClickPlay,
  };
});
