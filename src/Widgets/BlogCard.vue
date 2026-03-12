<script setup lang="ts">
import { computed, ref } from "vue";
import { useToast } from "bootstrap-vue-next";
import { storeToRefs } from "pinia";
import type { BlogData } from "../Utils/reks-interface";
import router from "../Router";
import { playerStore } from "../Store/player";
import { detailStore } from "../Store/detail";
import { createToast } from "../Utils/reks-toast";


type FavoriteTogglePayload = {
  id: number;
  next: boolean;
};

// type 0是音乐博客，1普通博客
const blogProps = withDefaults(defineProps<{
  blog: BlogData;
  liked?: boolean;
  likeReady?: boolean;
  likeDisabled?: boolean;
  favorited?: boolean;
  favoriteReady?: boolean;
  favoriteDisabled?: boolean;
  showLike?: boolean;
  showFavorite?: boolean;
  showActions?: boolean;
}>(), {
  liked: false,
  likeReady: true,
  likeDisabled: false,
  favorited: false,
  favoriteReady: true,
  favoriteDisabled: false,
  showLike: true,
  showFavorite: true,
  showActions: true,
});
const emit = defineEmits<{
  (e: "like-toggle", payload: FavoriteTogglePayload): void;
  (e: "favorite-toggle", payload: FavoriteTogglePayload): void;
}>();
const b = blogProps.blog;
// Record<number, boolean> 用于跟踪每张图片的加载状态，键是图片索引，值是布尔值表示是否加载完成
const imgLoaded = ref<Record<number, boolean>>({});
const toast = useToast();
const { addIntoPlayQueue, selectOutSide } = playerStore();
const { playQueueLength, currentIndex } = storeToRefs(playerStore());
const { get_detail } = detailStore();
const isLiked = computed(() => Boolean(blogProps.liked));
const likeReady = computed(() => Boolean(blogProps.likeReady));
const likePending = computed(() => Boolean(blogProps.likeDisabled));
const isFavorited = computed(() => Boolean(blogProps.favorited));
const favoriteReady = computed(() => Boolean(blogProps.favoriteReady));
const favoritePending = computed(() => Boolean(blogProps.favoriteDisabled));

const handleLike = async () => {
  if (likePending.value || !likeReady.value) return;
  emit("like-toggle", { id: b.id, next: !isLiked.value });
};

const handleFavorite = async () => {
  if (favoritePending.value || !favoriteReady.value) return;
  emit("favorite-toggle", { id: b.id, next: !isFavorited.value });
};

const readBlog = async (id: number) => {
  try {
    const target = `/blog/${id}`;
    if (router.currentRoute.value.fullPath === target) return;
    await router.push({ name: "blog", params: { id: String(id) } });
  } catch (e) {
    // 忽略导航失败（例如重复导航）
    console.warn("导航到博客页失败:", e);
  }
};

const caseAdd = () => {
  if (!b.music?.audio) {
    createToast(toast, "添加失败", "当前音乐缺少音频链接", "danger");
    return;
  }

  if (playQueueLength.value === 0) {
    get_detail({
      title: b.music.name,
      author: b.music.username,
      cover: b.music.cover,
    });
  }

  const res = addIntoPlayQueue(
    {
      cover: b.music.cover,
      songURL: b.music.audio,
      title: b.music.name,
      author: b.music.username,
    },
    currentIndex.value,
  );

  if (res) {
    createToast(toast, "添加成功", "歌曲添加成功", "success");
  } else {
    createToast(toast, "重复添加", "歌曲重复添加", "success");
  }
};

const casePlay = () => {
  if (!b.music?.audio) {
    createToast(toast, "播放失败", "当前音乐缺少音频链接", "danger");
    return;
  }

  try {
    selectOutSide({
      cover: b.music.cover,
      songURL: b.music.audio,
      title: b.music.name,
      author: b.music.username,
    });

    get_detail({
      title: b.music.name,
      author: b.music.username,
      cover: b.music.cover,
    });

    createToast(toast, "播放成功", `正在播放 ${b.music.username} - ${b.music.name}`, "success");
  } catch (e) {
    createToast(toast, "播放失败", "未知原因", "danger");
    console.error(e);
  }
};

</script>

<template>
  <BCard class="blog-card mb-2">
    <template #header v-if="b.type === 0">
      <!-- 长方形容器 -->
      <div style="
          display: flex;
          align-items: center;
          height: 80px;
          padding: 8px 12px;
          background: #fff;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        ">
        <!-- 左侧封面 -->
          <div style="
            position: relative;
            width: 64px;
            height: 64px;
            border-radius: 4px;
            overflow: hidden;
            cursor: pointer;
          ">
          <img :src="b.music?.cover || '/ai.webp'" style="width: 100%; height: 100%; object-fit: cover" alt="album" />
          <!-- 播放按钮 -->
          <div class="play-btn" style="
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.45);
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0;
              transition: opacity 0.2s;
            " @click.stop="casePlay">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <!-- 右侧歌曲信息 -->
        <div style="margin-left: 12px; flex: 1">
          <div style="font-size: 15px; font-weight: 600; color: #111">
            {{ b.music?.name || "未绑定音乐" }}
          </div>
          <div style="font-size: 13px; color: #666; margin-top: 4px; display: flex; align-items: center; justify-content: space-between; gap: 8px">
            <span>{{ b.music?.username || "未知作者" }}</span>
            <div style="display: inline-flex; gap: 6px">
              <BButton size="sm" variant="light" @click.stop="casePlay">
                <i-bi-play-circle-fill class="fs-5" />
              </BButton>
              <BButton size="sm" variant="light" @click.stop="caseAdd">
                <i-bi-plus-circle class="fs-6" />
              </BButton>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="rs-body">
      <div class="rs-card-img-list" v-skeleton-item>
        <div v-for="(img, idx) in b.cover" :key="idx" class="rs-img-wrapper" v-skeleton="!imgLoaded[idx]">
          <img class="rs-img" :src="img" :alt="`alt+${img}`" @load="imgLoaded[idx] = true" v-show="imgLoaded[idx]" />
        </div>
      </div>
    </div>

    <div class="rs-card-content mt-4" v-skeleton-item @click="readBlog(b.id)">
      <div class="rs-title h5" :title="b.title">
        <strong>{{ b.title }}</strong>
      </div>
      <div class="rs-time mt-2">发布于{{ b.created_at }}</div>
    </div>
    <template #footer v-if="blogProps.showActions">
      <div class="controls d-inline-flex align-items-center gap-3">
        <div
          v-if="blogProps.showLike"
          class="cion"
          :class="{ active: isLiked, disabled: !likeReady || likePending }"
          @click.stop="handleLike"
        >
          <i-bi-hand-thumbs-up />
        </div>
        <div
          v-if="blogProps.showFavorite"
          class="cion mt-1"
          :class="{ active: isFavorited, disabled: !favoriteReady || favoritePending }"
          @click.stop="handleFavorite"
        >
          <i-bi-heart />
        </div>
      </div>
    </template>
  </BCard>
</template>

<style lang="scss">
.rs-img-wrapper {
  min-height: 150px; // 防止骨架屏塌陷
  background: #f0f0f0; // 骨架屏底色
  border-radius: 4px;
}

.rs-time {
  font-size: 12px;
  color: #999;
}

.cion {
  cursor: pointer;
  transition: color 0.2s ease, opacity 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &.active {
    color: #dc3545;
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.blog-card {
  break-inside: avoid;
  max-width: 300px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.rs-body {
  .rs-card-img-list {
    display: grid;
    gap: 12px;
    overflow: hidden;
    grid-template-columns: 1.5fr 1fr; // 默认按“三图”列比

    // > 表示子元素
    &:not(:has(> :nth-child(2))) {
      > :nth-child(1) {
        // equals grid-row: 1/3;
        grid-column: span 3;
        grid-row: auto;
      }
    }

    &:not(:has(> :nth-child(3))) {
      grid-template-columns: 2fr 1fr; // 两图时，均分
    }

    &:has(> :nth-child(3)) {
      > :nth-child(1) {
        // equals grid-row: 1/3;
        grid-row: span 2;
      }
    }

    .rs-img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      transition: all 0.5s ease;
      will-change: transform;

      &:hover {
        cursor: pointer;
        transform: scale(1.2);
      }
    }
  }
}

.play-btn:hover {
  opacity: 1 !important;
}

.rs-card-content {
  // max-width: $card-max-width;

  .rs-title {
    width: 270px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
}
</style>
