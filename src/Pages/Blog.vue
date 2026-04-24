<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useToast } from "bootstrap-vue-next";
import { delete_blog, query_blog_by_id, query_draft_by_id } from "../Hooks/Blog";
import {
  hasFavoriteAuthSession,
  queryLikeCount,
  queryFavoriteStatus,
  queryLikeStatus,
  setFavoriteState,
  setLikeState,
} from "../Hooks/Fav";
import { followStore } from "../Store/follow";
import { createToast } from "../Utils/reks-toast";
import { playerStore } from "../Store/player";
import { detailStore } from "../Store/detail";

import { useRoute, useRouter } from "vue-router";
import { userStore } from "../Store/user";
import { storeToRefs } from "pinia";

const { userInfo } = storeToRefs(userStore());

const route = useRoute();
const router = useRouter();
const toast = useToast();
const response = ref();
const follow = followStore();
const player = playerStore();
const { addIntoPlayQueue, selectOutSide } = player;
const { currentIndex, playQueueLength } = storeToRefs(player);
const { get_detail } = detailStore();

const isLiked = ref(false);
const likeCount = ref(0);
const likeReady = ref(false);
const likePending = ref(false);
const isFavorited = ref(false);
const favoriteReady = ref(false);
const favoritePending = ref(false);
const deletePending = ref(false);
let favoriteSyncSeq = 0;
let favoriteMutationSeq = 0;
let likeSyncSeq = 0;
let likeMutationSeq = 0;

const authorRid = computed(() => Number(response.value?.user_id));
const isOwnBlog = computed(() => authorRid.value === Number(userInfo.value?.reks_id));
const subscribed = computed(() => follow.isSubscribed(authorRid.value));
const subscribePending = computed(() => follow.isFollowPending(authorRid.value));
const isDraftMode = computed(() => route.name === "blog-draft" || route.meta.source === "draft");

const syncSubscribeState = async () => {
  if (isDraftMode.value) return;
  await follow.syncSubscribeStateByRid(authorRid.value, !isOwnBlog.value);
};

const toggleSubscribe = () => {
  if (isDraftMode.value) return;
  void follow.toggleSubscribeByRid({
    rid: authorRid.value,
    canFollow: !isOwnBlog.value,
    toast,
  });
};

const caseAddMusic = () => {
  const m = response.value.song;
  if (!m?.audio) {
    createToast(toast, "添加失败", "当前音乐缺少音频链接", "danger");
    return;
  }

  if (playQueueLength.value === 0) {
    get_detail({ title: m.name, author: m.username, cover: m.cover });
  }

  const res = addIntoPlayQueue(
    { cover: m.cover, songURL: m.audio, title: m.name, author: m.username },
    currentIndex.value,
  );

  if (res) {
    createToast(toast, "添加成功", "歌曲添加成功", "success");
  } else {
    createToast(toast, "重复添加", "歌曲重复添加", "success");
  }
};

const casePlayMusic = () => {
  const m = response.value?.song;
  if (!m?.audio) {
    createToast(toast, "播放失败", "当前音乐缺少音频链接", "danger");
    return;
  }

  try {
    selectOutSide({
      cover: m.cover,
      songURL: m.audio,
      title: m.name,
      author: m.username,
    });
    get_detail({ title: m.name, author: m.username, cover: m.cover });
    createToast(toast, "播放成功", `正在播放 ${m.username} - ${m.name}`, "success");
  } catch (e) {
    createToast(toast, "播放失败", "未知原因", "danger");
    console.error(e);
  }
};
// 同步点赞状态
const syncLikeStatus = async (id: number) => {
  if (!hasFavoriteAuthSession()) {
    likeReady.value = true;
    isLiked.value = false;
    return;
  }

  likeReady.value = false;
  const syncSeq = ++likeSyncSeq;
  const mutationSeq = likeMutationSeq;

  try {
    const res = await queryLikeStatus(id);
    if (syncSeq !== likeSyncSeq || mutationSeq !== likeMutationSeq) return;
    isLiked.value = res.is_liked;
  } catch (e) {
    console.error(e);
  } finally {
    if (syncSeq === likeSyncSeq && mutationSeq === likeMutationSeq) {
      likeReady.value = true;
    }
  }
};

const syncLikeCount = async (id: number) => {
  try {
    const res = await queryLikeCount(id);
    likeCount.value = Number(res.like_count || 0);
  } catch (e) {
    console.error(e);
    likeCount.value = 0;
  }
};

const syncFavoriteStatus = async (id: number) => {
  if (!hasFavoriteAuthSession()) {
    favoriteReady.value = true;
    isFavorited.value = false;
    return;
  }

  favoriteReady.value = false;
  const syncSeq = ++favoriteSyncSeq;
  const mutationSeq = favoriteMutationSeq;

  try {
    const res = await queryFavoriteStatus(id, "blog");
    if (syncSeq !== favoriteSyncSeq || mutationSeq !== favoriteMutationSeq)
      return;
    isFavorited.value = res.is_favorited;
  } catch (e) {
    console.error(e);
  } finally {
    if (syncSeq === favoriteSyncSeq && mutationSeq === favoriteMutationSeq) {
      favoriteReady.value = true;
    }
  }
};

const handleDelete = async (id: number) => {
  if (deletePending.value) return;
  deletePending.value = true;
  try {
    const res = await delete_blog(id);
    if (res.data) {
      createToast(toast, "删除成功", "该博客已删除", "success");
      // 删除成功后离开详情页，避免继续操作已删除内容。
      setTimeout(() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }, 600);
    } else {
      createToast(toast, "删除失败", "删除未生效，请稍后重试", "danger");
    }
  } catch (e) {
    createToast(toast, "删除失败", "未知原因", "danger");
  } finally {
    deletePending.value = false;
  }
};

const handleFavorite = async () => {
  if (isDraftMode.value) return;
  const blogId = Number(route.params.id);
  if (Number.isNaN(blogId) || favoritePending.value || !favoriteReady.value)
    return;

  if (!hasFavoriteAuthSession()) {
    createToast(toast, "请先登录", "登录后才能收藏博客", "warning");
    return;
  }

  const previous = isFavorited.value;
  const next = !previous;
  favoritePending.value = true;
  favoriteMutationSeq += 1;
  isFavorited.value = next;

  try {
    const res = await setFavoriteState(blogId, "blog", next);
    isFavorited.value = res.is_favorited;
    createToast(
      toast,
      res.is_favorited ? "收藏成功" : "取消收藏成功",
      res.msg,
      "success",
    );
  } catch (e) {
    isFavorited.value = previous;
    console.error(e);
    createToast(toast, "操作失败", "收藏状态更新失败，请稍后重试", "danger");
  } finally {
    favoritePending.value = false;
  }
};

const handleLike = async () => {
  if (isDraftMode.value) return;
  const blogId = Number(route.params.id);
  if (Number.isNaN(blogId) || likePending.value || !likeReady.value) return;

  if (!hasFavoriteAuthSession()) {
    createToast(toast, "请先登录", "登录后才能点赞博客", "warning");
    return;
  }

  const previous = isLiked.value; //点赞前的状态 true/false
  const previousLikeCount = likeCount.value; //点赞前数量
  // 乐观更新，当前状态取反，坐等更新
  const next = !previous;
  // 请求期间锁住，不给瞎几把乱点
  likePending.value = true;
  likeMutationSeq += 1;
  isLiked.value = next;
  // 如果是点赞+1，取消点赞-1
  likeCount.value = Math.max(0, previousLikeCount + (next ? 1 : -1));

  try {
    const res = await setLikeState(blogId, next);
    isLiked.value = res.is_liked;
    if (typeof res.like_count === "number") {
      likeCount.value = Number(res.like_count);
    }
    createToast(
      toast,
      res.is_liked ? "点赞成功" : "取消点赞成功",
      res.msg,
      "success",
    );
  } catch (e) {
    isLiked.value = previous;
    likeCount.value = previousLikeCount;
    console.error(e);
    createToast(toast, "操作失败", "点赞状态更新失败，请稍后重试", "danger");
  } finally {
    likePending.value = false;
  }
};

// 封装加载函数
const loadBlog = async (id: number | string) => {
  if (!id) return;
  const numId = Number(id);
  if (isNaN(numId)) return;

  const res = isDraftMode.value
    ? await query_draft_by_id(numId)
    : await query_blog_by_id(numId);
  response.value = res;
  if (isDraftMode.value) {
    likeCount.value = 0;
    isLiked.value = false;
    likeReady.value = true;
    isFavorited.value = false;
    favoriteReady.value = true;
  } else {
    await syncLikeCount(numId);
    await syncLikeStatus(numId);
    await syncFavoriteStatus(numId);
    await syncSubscribeState();
  }
  console.log(response.value);
};

// 监听路由参数变化（浏览器地址栏输入新ID时会触发）
watch(
  () => [route.params.id, isDraftMode.value],
  ([newId]) => {
    loadBlog(Number(newId));
  },
  { immediate: true }, // 立即执行，替代 onMounted
);

const toAuthorSpace = () => {
  router.push(`/centre/user/${response.value.user_id}`)
}

const toTagTheme = () => {
  console.log("你好")
}

const toEditBlog = () => {
  const blogId = Number(route.params.id);
  if (Number.isNaN(blogId) || blogId <= 0) return;

  router.push({
    name: "upload-edit",
    params: { id: blogId },
    query: isDraftMode.value ? { source: "draft" } : { source: "blog" },
  });
};

</script>

<template>
  <div class="blog-container p-4" v-if="response != null">
    <!-- 左侧主内容区 -->
    <div class="blog-main">
      <h2 class="blog-title">{{ response?.title }}</h2>
      <div class="tags">
        <span v-for="tag in response?.tags" :key="tag" class="tag" @click="toTagTheme()">
          {{ tag }}
        </span>
      </div>

      <section v-if="response.song" class="blog-music-embed">
        <div class="embed-cover-wrap">
          <img :src="response.song?.cover" :alt="response.song?.name || 'blog-music-cover'" class="embed-cover" />
        </div>
        <div class="embed-content">
          <div class="embed-title">{{ response.song?.name }}</div>
          <div class="embed-author d-flex align-items-center gap-2">
            <BAvatar :src="response.song?.avatar || response?.avatar || ''" size="32" />
            <span>{{ response.song?.username || response?.author }}</span>
          </div>
          <div class="embed-actions mt-3 d-flex align-items-center gap-2">
            <BButton variant="dark" size="sm" @click.stop="casePlayMusic">
              <i-bi-play-circle-fill class="me-1" /> 播放
            </BButton>
            <BButton variant="outline-secondary" size="sm" @click.stop="caseAddMusic">
              <i-bi-plus-circle class="me-1" /> 添加队列
            </BButton>
          </div>
        </div>
      </section>

      <hr />

      <div class="blog-body" v-html="response?.content"></div>
    </div>

    <!-- 右侧用户卡片侧边栏 -->
    <aside class="author-sidebar">
      <!--  关联歌曲组 -->

      <div class="author-card">
        <BAvatar size="80" :src="response?.avatar || ''" />
        <div class="author-name" @click="toAuthorSpace()">{{ response?.author }}</div>
        <BButton
          v-if="!isDraftMode"
          variant="outline-secondary"
          size="sm"
          :disabled="subscribePending || isOwnBlog"
          @click="toggleSubscribe"
        >
          {{ isOwnBlog ? "关注" : subscribed ? "已关注" : "+ 关注" }}
        </BButton>
      </div>

      <!-- 互动按钮组 -->
      <div
        class="action-buttons"
        v-if="!isDraftMode || response?.user_id === userInfo?.reks_id"
      >
        <template v-if="!isDraftMode">
          <BButton
            class="action-btn"
            :class="{ active: isLiked, disabled: !likeReady || likePending }"
            :disabled="!likeReady || likePending"
            @click="handleLike"
          >
            <i-bi-hand-thumbs-up />
            <span>{{ likePending ? "处理中" : `点赞 ${likeCount}` }}</span>
          </BButton>
          <BButton
            class="action-btn"
            :class="{
              active: isFavorited,
              disabled: !favoriteReady || favoritePending,
            }"
            :disabled="!favoriteReady || favoritePending"
            @click="handleFavorite"
          >
            <i-bi-heart />
            <span>{{ favoritePending ? "处理中" : "收藏" }}</span>
          </BButton>
        </template>

        <BPopover
          placement="bottom"
          v-if="response?.user_id === userInfo?.reks_id"
        >
          <template #target>
            <BButton class="action-btn">
              <i-bi-gear />
              <span>编辑</span>
            </BButton>
          </template>
          <BButton class="me-2" variant="primary" title="编辑" @click.stop="toEditBlog">
            <i-bi-pen /> 编辑
          </BButton>
          <BPopover placement="bottom">
            <template #target>
              <BButton class="me-2" variant="danger" title="删除">
                <i-bi-trash /> 删除
              </BButton>
            </template>
            <template #title>是否要删除?</template>
            <BButton
              :disabled="deletePending"
              variant="danger"
              title="yes"
              @click.stop="handleDelete(Number(route.params.id))"
              >{{ deletePending ? "删除中" : "确认删除" }}</BButton
            >
          </BPopover>
        </BPopover>
      </div>
    </aside>
  </div>
  <div class="blog mt-5" v-else>
    <Empty title="不存在该博客"></Empty>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.blog-container {
  margin-top: 7.3rem;
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  .blog-main {
    flex: 1;
    @extend %reks-card-box;
    padding: 1.5rem;

    .blog-title {
      font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
      margin-bottom: 1rem;
      padding-top: 1rem;
    }

    .tags {
      margin-bottom: 1rem;

      .tag {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        margin-right: 0.5rem;
        font-size: small;
        background-color: white;
        border: 1px solid #dee2e6;
        border-radius: 0.25rem;
        cursor: pointer;

        &:hover {
          background-color: #f8f9fa;
        }
      }
    }

    .blog-body {
      overflow: hidden;
      width: 100%;

      :deep(p) {
        width: 100%;

        img {
          max-width: 100%;
          height: auto;
        }
      }
    }

    .blog-music-embed {
      margin-top: 1rem;
      margin-bottom: 1rem;
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 1rem;
      padding: 0.9rem;
      border-radius: 0.8rem;
      border: 1px solid rgba(220, 220, 220, 0.9);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(248, 248, 248, 0.9));

      .embed-cover-wrap {
        width: 100%;
        height: 128px;

        .embed-cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0.65rem;
          box-shadow: 0 8px 14px rgba(0, 0, 0, 0.12);
        }
      }



      .embed-title {
        font-size: 1.03rem;
        font-weight: 700;
        color: #2f2f2f;
        margin-bottom: 0.45rem;
      }

      .embed-author {
        color: #666;
        font-size: 0.9rem;
      }
    }
  }

  .author-sidebar {
    width: 280px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .music-card {
      @extend %reks-card-box;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .author-card {
      @extend %reks-card-box;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      position: sticky;
      top: 8rem;

      .author-name {
        font-weight: bold;
        font-size: 1.25rem;
        text-align: center;
        cursor: pointer;
        &:hover{
          text-decoration: underline;
        }
      }
    }

    .action-buttons {
      @extend %reks-card-box;
      padding: 1rem;
      display: flex;
      justify-content: space-around;
      position: sticky;
      top: calc(8rem + 250px);

      .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 0.5rem;
        transition: all 0.2s ease;
        color: #6c757d;

        span {
          font-size: 0.875rem;
          font-weight: 500;
        }

        &:hover {
          background-color: #f8f9fa;
          color: #495057;

          svg {
            transform: scale(1.1);
          }
        }

        &.active {
          color: #dc3545;

          svg {
            fill: currentColor;
            stroke: currentColor;
          }

          &:hover {
            background-color: #fff5f5;
          }
        }

        &.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  }
}

// 响应式：小屏幕时堆叠布局
@media (max-width: 768px) {
  .blog-container {
    flex-direction: column;

    .author-sidebar {
      width: 100%;
      order: -1;

      .author-card {
        position: static;
        flex-direction: row;
        justify-content: flex-start;
        padding: 1rem;
        gap: 1.5rem;
      }

      .blog-main {
        .blog-music-embed {
          grid-template-columns: 1fr;

          .embed-cover-wrap {
            height: 180px;
          }
        }
      }

      .action-buttons {
        position: static;
        flex-direction: row;
        justify-content: center;
        gap: 2rem;
      }
    }
  }
}
</style>
