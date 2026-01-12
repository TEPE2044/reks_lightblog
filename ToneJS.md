# 由DeepWiKi支持https://deepwiki.com/search/_1d6036b9-d096-4b56-aa9a-2ec8289ef3b4?mode=fast

# 第一章 Pinia 与 Tone.js 的结合使用

好的，我来将 Pinia store 改写成组合式 API 的写法。

---

## 组合式 API 的 Pinia Store

```javascript
// stores/player.js
import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import * as Tone from "tone";

export const usePlayerStore = defineStore("player", () => {
  // State
  const player = ref(null);
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const volume = ref(0);
  const playbackRate = ref(1);
  const loop = ref(false);
  const loaded = ref(false);
  const currentTrack = ref(null);

  // Getters
  const state = computed(() => player.value?.state || "stopped");
  const progress = computed(() =>
    duration.value > 0 ? currentTime.value / duration.value : 0
  );

  // Actions
  const initPlayer = async (url) => {
    player.value = new Tone.Player({
      url: url,
      onload: () => {
        loaded.value = true;
        duration.value = player.value.buffer.duration;
      },
    }).toDestination();

    // 监听播放状态变化
    isPlaying.value = player.value.state === "started";
  };

  const play = async () => {
    await Tone.start();
    player.value.start();
    isPlaying.value = true;
    updateProgress();
  };

  const stop = () => {
    player.value.stop();
    isPlaying.value = false;
  };

  const setVolume = (value) => {
    volume.value = value;
    if (player.value) {
      player.value.volume.value = value;
    }
  };

  const setPlaybackRate = (rate) => {
    playbackRate.value = rate;
    if (player.value) {
      player.value.playbackRate = rate;
    }
  };

  const toggleLoop = () => {
    loop.value = !loop.value;
    if (player.value) {
      player.value.loop = loop.value;
    }
  };

  const seek = (time) => {
    if (player.value) {
      player.value.seek(time);
      currentTime.value = time;
    }
  };

  const updateProgress = () => {
    if (isPlaying.value && player.value) {
      currentTime.value = player.value.now() % duration.value;
      requestAnimationFrame(() => updateProgress());
    }
  };

  // Watchers
  watch(volume, (newVolume) => {
    if (player.value) {
      player.value.volume.linearRampToValueAtTime(newVolume, Tone.now() + 0.1);
    }
  });

  // 返回所有需要暴露的状态和方法
  return {
    // State
    player,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    loop,
    loaded,
    currentTrack,
    // Getters
    state,
    progress,
    // Actions
    initPlayer,
    play,
    stop,
    setVolume,
    setPlaybackRate,
    toggleLoop,
    seek,
    updateProgress,
  };
});
```

## 在 Vue 组件中使用

```vue
<template>
  <div>
    <button @click="playerStore.play" :disabled="!playerStore.loaded">
      播放
    </button>
    <button @click="playerStore.stop">停止</button>

    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      :value="playerStore.progress"
      @input="seekToPosition"
    />

    <label>
      音量: {{ playerStore.volume }}dB
      <input
        type="range"
        min="-60"
        max="0"
        :value="playerStore.volume"
        @input="playerStore.setVolume($event.target.value)"
      />
    </label>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { usePlayerStore } from "@/stores/player";

const playerStore = usePlayerStore();

onMounted(() => {
  playerStore.initPlayer("https://tonejs.github.io/audio/berklee/gong_1.mp3");
});

const seekToPosition = (event) => {
  const time = event.target.value * playerStore.duration;
  playerStore.seek(time);
};

onUnmounted(() => {
  if (playerStore.player) {
    playerStore.player.dispose();
  }
});
</script>
```

## 组合式 API 的优势

### 1. 更好的类型推导

```javascript
// TypeScript 支持更好
const playerStore = usePlayerStore();
// playerStore.volume 自动推导为 Ref<number>
```

### 2. 更灵活的组合

```javascript
// 可以创建更细粒度的组合式函数
export const useVolumeControl = () => {
  const volume = ref(0);

  const setVolume = (value) => {
    volume.value = value;
    // 音量控制逻辑
  };

  return { volume, setVolume };
};
```

### 3. 更简洁的响应式监听

```javascript
// 直接使用 watch 而不是 options API 的 watch
watch([isPlaying, currentTime], ([playing, time]) => {
  console.log(`播放状态: ${playing}, 当前时间: ${time}`);
});
```

## 注意事项

- **资源清理**：仍然需要在组件卸载时调用 `dispose()` 方法 [1](#4-0)
- **异步加载**：使用 `Tone.loaded()` 等待音频文件加载完成 [2](#4-1)
- **用户交互**：必须在用户交互后调用 `Tone.start()` [3](#4-2)

## Notes

- 组合式 API 提供了更好的代码组织和复用性
- 可以将相关的状态和逻辑组合在一起
- 支持更灵活的 TypeScript 类型推导
- Tone.js 的参数控制与 Vue3 的响应式系统完美配合 [4](#4-3)

Wiki pages you might want to explore:

- [Tone.js Overview (Tonejs/Tone.js)](/wiki/Tonejs/Tone.js#1)
- [Core Architecture (Tonejs/Tone.js)](/wiki/Tonejs/Tone.js#2)

### Citations

# 第二章 Tone.js 播放状态

这行代码的意思是：**将 Tone.js 播放器的状态同步到 Vue 的响应式变量中**。

```javascript
isPlaying.value = player.value.state === "started";
```

## 详细解释

### 1. `player.value.state`

- `player.value` 获取 Tone.js Player 实例
- `.state` 返回播放器的当前状态，可能是 `"started"` 或 `"stopped"` [1](#5-0)

### 2. `=== 'started'`

- 严格相等比较，检查播放器是否正在播放
- 返回 `true`（正在播放）或 `false`（已停止）

### 3. `isPlaying.value =`

- 将比较结果赋值给 Vue 的响应式变量 `isPlaying`
- 这样 Vue 组件就能响应播放状态的变化

## 状态类型

Tone.js 中定义了三种基本播放状态 [2](#5-1) ：

- `"started"` - 正在播放
- `"stopped"` - 已停止
- `"paused"` - 已暂停（某些源支持）

## 实际用途

这种模式让你能够：

```javascript
// 在模板中响应播放状态
<button :disabled="!isPlaying">暂停</button>

// 在计算属性中使用
const playButtonText = computed(() =>
  isPlaying.value ? '暂停' : '播放'
)
```

## Notes

- 这是 Vue 3 Composition API 与 Tone.js 集成的常见模式
- 通过这种方式，UI 可以自动响应音频播放状态的变化
- Tone.js 的状态管理基于 StateTimeline 类，确保状态变化的准确性 [3](#5-2)

Wiki pages you might want to explore:

- [Core Architecture (Tonejs/Tone.js)](/wiki/Tonejs/Tone.js#2)
- [Audio Sources (Tonejs/Tone.js)](/wiki/Tonejs/Tone.js#3)

### Citations

**File:** Tone/source/Source.ts (L138-150)

```typescript
	get state(): BasicPlaybackState {
		if (this._synced) {
			if (this.context.transport.state === "started") {
				return this._state.getValueAtTime(
					this.context.transport.seconds
				) as BasicPlaybackState;
			} else {
				return "stopped";
			}
		} else {
			return this._state.getValueAtTime(this.now()) as BasicPlaybackState;
		}
	}
```

**File:** Tone/core/util/StateTimeline.ts (L5-6)

```typescript
export type BasicPlaybackState = "started" | "stopped";
export type PlaybackState = BasicPlaybackState | "paused";
```

**File:** Tone/core/util/StateTimeline.ts (L12-17)

```typescript
/**
 * A Timeline State. Provides the methods: `setStateAtTime("state", time)` and `getValueAtTime(time)`
 * @param initial The initial state of the StateTimeline.  Defaults to `undefined`
 * @internal
 */
export class StateTimeline<
```
