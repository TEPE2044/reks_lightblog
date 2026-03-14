<script setup lang="ts">
import { computed, ref } from "vue";

type Ance = "Blog" | "Announce";

interface TimelineItem {
  id: number;
  time: string;
  title: string;
  detail: string;
  type: Ance;
}

interface FollowUser {
  id: string;
  name: string;
  tag: string;
  color: string;
}

interface FeedCard {
  id: number;
  authorId: string;
  title: string;
  summary: string;
  stamp: string;
  likes: number;
  comments: number;
  level: "short" | "mid" | "tall";
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

const timeline = ref<TimelineItem[]>([
  {
    id: 1,
    time: "09:10",
    title: "同步成功",
    detail: "已完成 6 条新消息的本地索引。",
    type: "Announce",
  },
  {
    id: 2,
    time: "10:22",
    title: "关注变更",
    detail: "你关注了 Luna 与 Rex。",
    type: "Blog",
  },
  {
    id: 3,
    time: "11:05",
    title: "草稿恢复",
    detail: "自动恢复上次未发布草稿。",
    type: "Blog",
  },
  {
    id: 4,
    time: "12:46",
    title: "系统提示",
    detail: "你的消息中心已切换到增量刷新。",
    type: "Announce",
  },
  {
    id: 5,
    time: "14:15",
    title: "收藏更新",
    detail: "你收藏的 2 篇博客有新评论。",
    type: "Blog",
  },
  {
    id: 6,
    time: "16:30",
    title: "安全提醒",
    detail: "检测到新设备登录，已完成验证。",
    type: "Announce",
  },
]);

const feedCards = ref<FeedCard[]>([
  {
    id: 1001,
    authorId: "u1",
    title: "把旧站迁移到轻量架构",
    summary: "拆掉冗余依赖之后，首屏渲染和消息轮询都更稳定。",
    stamp: "5 分钟前",
    likes: 22,
    comments: 8,
    level: "mid",
  },
  {
    id: 1002,
    authorId: "u2",
    title: "交互草图复盘",
    summary: "这次我先从信息密度入手，再做视觉补偿，减少了跳读负担。",
    stamp: "16 分钟前",
    likes: 41,
    comments: 11,
    level: "tall",
  },
  {
    id: 1003,
    authorId: "u3",
    title: "关注分组小技巧",
    summary: "把高频作者放前面，横向列表滚动成本会低很多。",
    stamp: "20 分钟前",
    likes: 12,
    comments: 2,
    level: "short",
  },
  {
    id: 1004,
    authorId: "u4",
    title: "消息卡片的层级切分",
    summary: "标题、摘要、行为按钮拆层后，视觉扫描路径会更直观。",
    stamp: "34 分钟前",
    likes: 17,
    comments: 6,
    level: "mid",
  },
  {
    id: 1005,
    authorId: "u5",
    title: "一次离线缓存实验",
    summary: "断网情况下保留关键状态，恢复后自动合并冲突。",
    stamp: "45 分钟前",
    likes: 29,
    comments: 9,
    level: "tall",
  },
  {
    id: 1006,
    authorId: "u2",
    title: "滚动容器性能小记",
    summary: "头像列表和瀑布流分离后，滚动抖动减少了不少。",
    stamp: "1 小时前",
    likes: 8,
    comments: 1,
    level: "short",
  },
  {
    id: 1007,
    authorId: "u3",
    title: "关于消息中心的信息组织",
    summary: "时间轴适合追踪动作历史，瀑布流适合快速扫读内容。",
    stamp: "1 小时前",
    likes: 14,
    comments: 3,
    level: "mid",
  },
]);

const followMap = computed(() => {
  return follows.value.reduce<Record<string, FollowUser>>((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});
});

const shownTimeline = computed(() => timeline.value);

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
  <div class="announcement-panel">
    <main class="panel-main">
      <aside class="timeline-area ">
        <h3>本地操作记录</h3>
        <div class="timeline-list">
          <article v-for="item in shownTimeline" :key="item.id" class="timeline-item">
            <div class="node" />
            <div class="content">
              <div class="time">{{ item.time }}</div>
              <div class="title">{{ item.title }}</div>
              <p>{{ item.detail }}</p>
            </div>
          </article>
        </div>
      </aside>

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
          <article
            v-for="card in shownFeeds"
            :key="card.id"
            class="feed-card"
            :class="card.level"
            :style="{ '--card-accent': followMap[card.authorId]?.color || '#4f6272' }"
          >
            <div class="card-head">
              <div
                class="mini-avatar"
                :style="{ '--avatar-bg': followMap[card.authorId]?.color || '#666' }"
              >
                {{ followMap[card.authorId]?.tag || 'NA' }}
              </div>
              <div class="meta">
                <strong>{{ followMap[card.authorId]?.name || 'Unknown' }}</strong>
                <span>{{ card.stamp }}</span>
              </div>
            </div>

            <h4>{{ card.title }}</h4>
            <p>{{ card.summary }}</p>

            <footer>
              <span>赞 {{ card.likes }}</span>
              <span>评 {{ card.comments }}</span>
            </footer>
          </article>

          <div v-if="!shownFeeds.length" class="empty-state">
            当前关注暂无内容。
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.announcement-panel {
  padding: 1.1rem;
}

.panel-main {
  padding: 1rem;
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 1rem;
  min-height: 660px;
}

.timeline-area {
   @extend %reks-card-box;
  padding: 0.9rem;
  overflow: hidden;
}

.timeline-area h3 {
  font-size: 1rem;
  margin: 0 0 0.8rem;
  font-weight: 800;
}

.timeline-list {
  position: relative;
  height: calc(100% - 2rem);
  overflow-y: auto;
  padding-right: 0.3rem;
}

.timeline-list::before {
  content: "";
  position: absolute;
  left: 0.45rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #f0d7af;
}

.timeline-item {
  position: relative;
  padding-left: 1.6rem;
  margin-bottom: 0.9rem;
}

.timeline-item .node {
  position: absolute;
  left: 0;
  top: 0.45rem;
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  border: 2px solid #d0722b;
  background: #fffef8;
  box-shadow: 0 0 0 4px rgba(208, 114, 43, 0.14);
}

.timeline-item .time {
  font-size: 0.75rem;
  color: #9b6f4f;
}

.timeline-item .title {
  font-size: 0.9rem;
  font-weight: 800;
  color: #4e3625;
}

.timeline-item p {
  margin: 0.2rem 0 0;
  font-size: 0.8rem;
  color: #6f5a4a;
  line-height: 1.45;
}

.feed-area {
  @extend %reks-card-box;
  padding: 2rem;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 0.9rem;
  min-width: 0;
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
  columns: 3 220px;
  column-gap: 0.8rem;
}

.feed-card {
  --card-accent: #496173;
  break-inside: avoid;
  display: inline-block;
  width: 100%;
  margin: 0 0 0.8rem;
  background: #ffffff;
  border: 1px solid #efdcc1;
  border-top: 3px solid var(--card-accent);
  border-radius: 10px;
  padding: 0.75rem;
  box-shadow: 0 8px 18px rgba(117, 72, 39, 0.08);
}

.feed-card.short {
  min-height: 170px;
}

.feed-card.mid {
  min-height: 220px;
}

.feed-card.tall {
  min-height: 280px;
}

.card-head {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.mini-avatar {
  --avatar-bg: #666;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--avatar-bg);
  color: #f5f5f5;
  font-size: 0.7rem;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
}

.meta strong {
  font-size: 0.84rem;
  color: #5a402e;
}

.meta span {
  font-size: 0.73rem;
  color: #91745c;
}

.feed-card h4 {
  margin: 0.75rem 0 0.35rem;
  font-size: 1rem;
  color: #4a3120;
}

.feed-card p {
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.55;
  color: #6e5645;
}

.feed-card footer {
  margin-top: 0.7rem;
  display: flex;
  gap: 0.9rem;
  font-size: 0.78rem;
  color: #9b7860;
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
  .panel-main {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .timeline-area {
    max-height: 240px;
  }

  .feed-grid {
    columns: 2 180px;
    max-height: 560px;
  }
}

@media (max-width: 680px) {
  .announcement-panel {
    padding: 0.85rem;
  }

  .panel-main {
    padding: 0.7rem;
  }

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
