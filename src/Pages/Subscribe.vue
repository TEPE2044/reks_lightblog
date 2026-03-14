<script setup lang="ts">
import { computed, ref } from "vue";
import type { BlogData } from "../Utils/reks-interface";
import BlogCard from "../Widgets/BlogCard.vue";

interface FollowUser {
  id: string;
  name: string;
  tag: string;
  color: string;
}

interface FeedEntry {
  id: number;
  authorId: string;
  blog: BlogData;
}

const activeFollowId = ref<string>("all");

const follows = ref<FollowUser[]>([
  { id: "all", name: "全部", tag: "ALL", color: "#303030" },
  { id: "u1", name: "Mika", tag: "MK", color: "#8f5d42" },
  { id: "u2", name: "Luna", tag: "LU", color: "#3c6382" },
  { id: "u3", name: "Rex", tag: "RX", color: "#5f8d4e" },
  { id: "u4", name: "Kite", tag: "KT", color: "#685a9f" },
  { id: "u5", name: "Nova", tag: "NV", color: "#a25454" },
]);

const feedCards = ref<FeedEntry[]>([
  {
    id: 1001,
    authorId: "u1",
    blog: {
      id: 1001,
      title: "把旧站迁移到轻量架构",
      created_at: new Date("2026-03-14T09:10:00"),
      cover: ["/ai.webp", "/ai.webp", "/ai.webp"],
      type: 1,
    },
  },
  {
    id: 1002,
    authorId: "u2",
    blog: {
      id: 1002,
      title: "交互草图复盘",
      created_at: new Date("2026-03-14T10:22:00"),
      cover: ["/ai.webp", "/ai.webp", "/ai.webp"],
      type: 1,
    },
  },
  {
    id: 1003,
    authorId: "u3",
    blog: {
      id: 1003,
      title: "关注分组小技巧",
      created_at: new Date("2026-03-14T11:05:00"),
      cover: ["/ai.webp", "/ai.webp"],
      type: 1,
    },
  },
  {
    id: 1004,
    authorId: "u4",
    blog: {
      id: 1004,
      title: "消息卡片的层级切分",
      created_at: new Date("2026-03-14T12:46:00"),
      cover: ["/ai.webp"],
      type: 1,
    },
  },
  {
    id: 1005,
    authorId: "u5",
    blog: {
      id: 1005,
      title: "一次离线缓存实验",
      created_at: new Date("2026-03-14T14:15:00"),
      cover: ["/ai.webp", "/ai.webp", "/ai.webp"],
      type: 0,
      music: {
        id: 501,
        name: "Amber Sunset",
        cover: "/ai.webp",
        audio: "/music.mp3",
        username: "Nova",
        avatar: "/ai.webp",
      },
    },
  },
  {
    id: 1006,
    authorId: "u2",
    blog: {
      id: 1006,
      title: "滚动容器性能小记",
      created_at: new Date("2026-03-14T15:05:00"),
      cover: ["/ai.webp", "/ai.webp"],
      type: 1,
    },
  },
  {
    id: 1007,
    authorId: "u3",
    blog: {
      id: 1007,
      title: "关于消息中心的信息组织",
      created_at: new Date("2026-03-14T16:30:00"),
      cover: ["/ai.webp", "/ai.webp", "/ai.webp"],
      type: 1,
    },
  },
]);

const shownFeeds = computed(() => {
  if (activeFollowId.value === "all") {
    return feedCards.value;
  }
  return feedCards.value.filter((card) => card.authorId === activeFollowId.value);
});

const pickFollow = (id: string) => {
  activeFollowId.value = id;
};

</script>

<template>
  <div class="ns p-4">
    <section class="feed-area">
      <div class="follow-strip" role="tablist" aria-label="关注列表">
        <button
          v-for="person in follows"
          :key="person.id"
          class="follow-avatar"
          :class="{ chosen: activeFollowId === person.id }"
          :style="{ '--avatar-bg': person.color }"
          @click="pickFollow(person.id)"
        >
          <span class="symbol" v-if="person.id === 'all'">▲</span>
          <span class="symbol" v-else>{{ person.tag }}</span>
          <span class="name">{{ person.name }}</span>
        </button>
      </div>

      <div class="feed-grid">
        <BlogCard
          v-for="card in shownFeeds"
          :key="card.id"
          :blog="card.blog"
          :show-actions="false"
          :show-like="false"
          :show-favorite="false"
        />

        <div v-if="!shownFeeds.length" class="empty-state">
          当前关注暂无内容。
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.ns {
  width: 100%;
}

.feed-area {
  @extend %reks-card-box;
  padding: 1.4rem;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
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
  width: 3.05rem;
  height: 3.05rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--avatar-bg);
  border: 2px solid rgba(255, 255, 255, 0.35);
  font-size: 0.95rem;
  font-weight: 800;
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

.empty-state {
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