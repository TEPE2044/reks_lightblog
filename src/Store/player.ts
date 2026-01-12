import { defineStore } from "pinia";
import { ref } from "vue";
import * as Tone from "tone";

export const playerStore = defineStore("player", () => {
  /*
    1.播放器对象 player
    2.加载状态 loaded
    3.播放状态 isPlaying
    */
  const player = ref<any>(null);
  const loaded = ref<boolean>(false);
  const isPlaying = ref<boolean>(false)

  /*元数据
  1.总时长 duration
  2. */
  const duration = ref<number>(0);
  const initPlayer = async (songURL: string) => {
    player.value = new Tone.Player({
      url: songURL,
      onload: () => {
        loaded.value = true;
        duration.value = player.value.buffer.duration;
      },
    }).toDestination();

    isPlaying.value = (player.value.state === 'started')
  };

  return {
    player,loaded,
    initPlayer,
  };
});
