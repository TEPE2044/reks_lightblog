<script setup lang="ts">
import { computed, ref } from "vue";
import { useToast } from "bootstrap-vue-next";
import type { BlogData } from "../Utils/reks-interface";
import router from "../Router";
import { formatDateTime } from "../Utils/reks-format-time";
import { createToast } from "../Utils/reks-toast";

type FavoriteTogglePayload = {
  id: number;
  next: boolean;
};
// const props = withDefaults(defineProps<{key?:type}>(),{*key:default value*})
// type 0是音乐博客，1普通博客
const blogProps = withDefaults(
  defineProps<{
    blog: BlogData;
    liked?: boolean;
    likeReady?: boolean;
    likeDisabled?: boolean;
    favorited?: boolean;
    favoriteReady?: boolean;
    favoriteDisabled?: boolean;
    showLike?: boolean;
    showFavorite?: boolean;
    showEdit?: boolean;
    showActions?: boolean;
    visitRouteName?: string;
  }>(),
  {
    liked: false,
    likeReady: true,
    likeDisabled: false,
    favorited: false,
    favoriteReady: true,
    favoriteDisabled: false,
    showLike: true,
    showFavorite: true,
    showEdit: false,
    showActions: true,
    visitRouteName: "blog",
  },
);
// 子传父
// 当子组件触发 favorite-toggle 事件时，调用 handleFavoriteToggle 方法 @favorite-toggle="handleFavoriteToggle"
// const emit = defineEmit<{(e:*"event"*,payload:*data*):type;}>()
const emit = defineEmits<{
  (e: "favorite-toggle", payload: FavoriteTogglePayload): void;
}>();
const b = blogProps.blog;
// Record<number, boolean> 用于跟踪每张图片的加载状态，键是图片索引，值是布尔值表示是否加载完成
const imgLoaded = ref<Record<number, boolean>>({});
const toast = useToast();
//收藏状态
const isFavorited = computed(() => Boolean(blogProps.favorited));
const favoriteReady = computed(() => Boolean(blogProps.favoriteReady));
const favoritePending = computed(() => Boolean(blogProps.favoriteDisabled));

const handleFavorite = async () => {
  if (favoritePending.value || !favoriteReady.value) return;
  emit("favorite-toggle", { id: b.id, next: !isFavorited.value });
};

const readBlog = async (id: number) => {
  try {
    const route = router.resolve({
      name: blogProps.visitRouteName,
      params: { id: String(id) },
    });
    if (router.currentRoute.value.fullPath === route.fullPath) return;

    window.open(route.href, "_blank");
  } catch (e) {
    // 忽略导航失败（例如重复导航）
    console.warn("导航到博客页失败:", e);
  }
};

const visitAuthor = (id?: number) => {
  if (id == null) {
    createToast(toast, "无法跳转", "缺少作者 ID", "warning");
    return;
  }

  router.push({ name: "guest-centre", params: { id: String(id) } });
};
</script>

<template>
  <BCard
    class="blog-card border border-secondary-subtle bg-light-subtle shadow-sm mb-4"
  >
    <div class="rs-body">
      <div class="rs-card-img-list" v-if="b.cover.length" v-skeleton-item>
        <div
          v-for="(img, idx) in b.cover"
          :key="idx"
          class="rs-img-wrapper"
          v-skeleton="!imgLoaded[idx]"
        >
          <img
            class="rs-img"
            :src="img"
            :alt="`alt+${img}`"
            @load="imgLoaded[idx] = true"
            v-show="imgLoaded[idx]"
          />
        </div>
      </div>
      <div class="rs-card-content mt-2" v-skeleton-item @click="readBlog(b.id)">
        <div
          class="rs-title fw-bold h6"
          :class="{ 'mt-3': b.cover.length !== 0 }"
          :title="b.title"
        >
          {{ b.title }}
        </div>
      </div>
      <div class="rs-time">发布于{{ formatDateTime(b.created_at) }}</div>
      <div class="rs-meta mt-2" v-if="blogProps.showActions">
        <div class="rs-actions">
          <div
            v-if="blogProps.showFavorite"
            class="cion"
            :class="{
              active: isFavorited,
              disabled: !favoriteReady || favoritePending,
            }"
            @click.stop="handleFavorite"
          >
            <i-bi-heart />
          </div>
          <div v-if="blogProps.showEdit" class="cion">
            <i-bi-pen />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div
        class="rs-new-footer d-flex flex-row align-items-center justify-content-center gap-2"
      >
        <BPopover>
          <template #target>
            <BAvatar class="border" :src="b.avatar || ''"></BAvatar>
            <div
              class="rs-author p-2 d-flex align-items-center flex-row gap-3"
              @click.stop="visitAuthor(b.user_id)"
            >
              <div class="name rs-title">{{ b.author }}</div>
            </div>
          </template>
          <div class="d-flex flex-column align-items-center p-2">
            <BAvatar size="lg" :src="b.avatar || ''"></BAvatar>
            <div
              class="rs-author p-2 d-flex align-items-center flex-row gap-3"
              @click.stop="visitAuthor(b.user_id)"
            >
              <div class="name fw-bold rs-title">{{ b.author }}</div>
            </div>
            <BButton size="sm">+ 关注</BButton>
          </div>
        </BPopover>
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

.rs-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.rs-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
}

.cion {
  cursor: pointer;
  transition:
    color 0.2s ease,
    opacity 0.2s ease,
    transform 0.2s ease;

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
  max-width: 600px;
  width: fit-content;
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
.rs-title {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
.rs-card-content {
  // max-width: $card-max-width;

  cursor: pointer;
  width: 100%;
}
</style>
