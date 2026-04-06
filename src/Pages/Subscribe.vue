<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { BlogData } from "../Utils/reks-interface";
import BlogCard from "../Widgets/BlogCard.vue";
import Empty from "../Components/Empty.vue";
import { query_blog_by_user_id } from "../Hooks/Blog";
import { queryFollowingList, type FollowingUser } from "../Hooks/SubScribe";
import { substore } from "../Store/subscribe";

interface FollowUser {
  id: string | number;
  rid: number | null;
  name: string;
  avatar: string;
}

interface FeedEntry {
  id: number;
  authorId: number;
  blog: BlogData;
}

const subscribe = substore();
const activeFollowId = ref<string | number>("all");
const follows = ref<FollowUser[]>([{ id: "all", rid: null, name: "全部", avatar: "/ai.webp" }]);
const feedCards = ref<FeedEntry[]>([]);
const loading = ref(false);

const sortByCreatedAtDesc = (items: FeedEntry[]) => {
  return [...items].sort((a, b) => {
    const ta = new Date(a.blog.created_at as unknown as string).getTime() || 0;
    const tb = new Date(b.blog.created_at as unknown as string).getTime() || 0;
    return tb - ta;
  });
};

const shownFeeds = computed(() => sortByCreatedAtDesc(feedCards.value));
const latestFeed = computed(() => shownFeeds.value[0] ?? null);
const historyFeeds = computed(() => shownFeeds.value.slice(1));

const mapFollowUser = (user: FollowingUser): FollowUser => ({
  id: user.rid,
  rid: user.rid,
  name: user.username || `用户${user.rid}`,
  avatar: user.avatar || "",
});

const fetchBlogsByRid = async (rid: number) => {
  const res = await query_blog_by_user_id(rid);
  const blogs = Array.isArray(res?.blogs) ? (res.blogs as BlogData[]) : [];
  return blogs.map((blog) => ({
    id: blog.id,
    authorId: rid,
    blog,
  }));
};

const loadFeed = async (followId: string | number) => {
  loading.value = true;
  try {
    if (followId === "all") {
      const targets = follows.value.filter((item) => item.rid !== null) as Array<
        FollowUser & { rid: number }
      >;
      const groups = await Promise.all(targets.map((item) => fetchBlogsByRid(item.rid)));
      feedCards.value = groups.flat();
      return;
    }

    const rid = Number(followId);
    feedCards.value = await fetchBlogsByRid(rid);
  } catch (e) {
    console.error("加载订阅内容失败:", e);
    feedCards.value = [];
  } finally {
    loading.value = false;
  }
};

const hasUserUnread = (rid: number | null) => {
  if (rid === null) {
    return subscribe.hasUnreadFollowing();
  }
  return subscribe.isFollowingRidUnread(rid);
};

const pickFollow = async (person: FollowUser) => {
  activeFollowId.value = person.id;
  if (person.rid !== null) {
    subscribe.markFollowingRead(person.rid);
  }
  await loadFeed(person.id);
};

onMounted(async () => {
  subscribe.initSubscribeList();
  try {
    const followings = await queryFollowingList();
    follows.value = [
      { id: "all", rid: null, name: "全部", avatar: "undefined" },
      ...followings.map(mapFollowUser),
    ];
  } catch (e) {
    console.error("加载关注列表失败:", e);
  }
  await loadFeed("all");
});

</script>

<template>
  <div class="ns p-2">
    <section class="feed-area">
      <div class="follow-strip" role="tablist" aria-label="关注列表">
        <button v-for="person in follows" :key="person.id" class="follow-avatar"
          :class="{ chosen: activeFollowId === person.id }" @click="pickFollow(person)">
          <span class="symbol">
            <BAvatar :src="person.avatar || undefined" :text="person.name.slice(0, 1)" class="follow-bavatar" />
            <BBadge v-show="hasUserUnread(person.rid)" dot-indicator variant="danger" class="avatar-dot" />
          </span>
          <span class="name">{{ person.name }}</span>
        </button>
      </div>

      <div v-if="latestFeed" class="latest-wrap">
        <div class="section-title">最新内容</div>
        <BlogCard :key="latestFeed.id" :blog="latestFeed.blog" :show-actions="false" :show-like="false"
          :show-favorite="false" />
      </div>

      <div v-if="latestFeed && historyFeeds.length" class="divider-line" />

      <div class="feed-grid" v-if="historyFeeds.length">
        <BlogCard v-for="card in historyFeeds" :key="card.id" :blog="card.blog" :show-actions="false" :show-like="false"
          :show-favorite="false" />
      </div>

      <div v-if="loading" class="loading-state">加载中...</div>
      <Empty v-else-if="!shownFeeds.length" title="当前关注暂无内容。" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.ns {
  margin-top: 7.3rem;
  width: 100%;
}

.feed-area {
  @extend %reks-card-box;
  padding: 1.4rem;
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr);
  gap: 0.9rem;
  min-width: 0;
  min-height: 640px;
}

.follow-strip {
  display: flex;
  gap: 0.85rem;
  overflow-x: auto;
  border: 1px solid #efcf9e;
  background: rgba(178, 34, 34, 0.5);
  padding: 0.7rem 0.8rem;
  border-radius: 12px;
}

.follow-avatar {
  border: none;
  background: transparent;
  color: #fff7ef;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  flex: 0 0 auto;
}

.follow-avatar .symbol {
  position: relative;
  width: 3.05rem;
  height: 3.05rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: #8d5f42;
  border: 2px solid rgba(255, 255, 255, 0.35);
}

.follow-bavatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.avatar-dot {
  position: absolute;
  right: -0.1rem;
  top: -0.1rem;
}

.follow-avatar .name {
  font-size: 0.75rem;
  letter-spacing: 0.02em;
}

.follow-avatar.chosen .symbol {
  border-color: #ffffff;
  box-shadow: 0 6px 14px rgba(86, 34, 9, 0.28);
}

.feed-grid {
  padding: 0.85rem;
  overflow-y: auto;
  columns: 4 220px;
  column-gap: 0.8rem;
}

.latest-wrap {
  padding: 0.4rem 0.8rem 0;
}

.section-title {
  margin-bottom: 0.65rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #7a2f0d;
}

.divider-line {
  border-top: 1px solid #e7cfb4;
  margin: 0.2rem 0.8rem;
}

.loading-state {
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 220px;
  background: #fff9f0;
  border: 1px dashed #e8cda8;
  color: #8a6b53;
  font-size: 0.9rem;
  border-radius: 10px;
}

@media (max-width: 1100px) {
  .feed-grid {
    columns: 2 180px;
    max-height: 560px;
  }
}

@media (max-width: 680px) {
  .follow-avatar .symbol {
    width: 2.55rem;
    height: 2.55rem;
    font-size: 0.78rem;
  }

  .feed-grid {
    columns: 1 220px;
    max-height: 500px;
  }
}
</style>