<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { BButton, BButtonGroup } from "bootstrap-vue-next";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import { substore } from "../Store/subscribe";
import { exportSubscribePdf } from "../Utils/subscribe-log";

interface TimelineItem {
  id: number;
  time: string;
  title: string;
  detail: string;
}

interface ActivityItem {
  id: number;
  title: string;
  summary: string;
  meta: string;
  badge: string;
  tone: "warm" | "sky";
}

const { subscribeList } = storeToRefs(substore());
const { initSubscribeList, removeallMessage } = substore();

const shownTimeline = computed<TimelineItem[]>(() => {
  return subscribeList.value.map((item, idx) => ({
    id: idx + 1,
    time: dayjs(item.createdAt).format("MM-DD HH:mm"),
    title: item.title,
    detail: item.details,
  }));
});

const handleClear = () => {
  removeallMessage();
};

const handleExport = () => {
  void exportSubscribePdf(subscribeList.value).catch((error) => {
    console.error("导出日志失败", error);
  });
};

onMounted(() => {
  initSubscribeList();
});

// const activities = ref<ActivityItem[]>([
//   {
//     id: 1,
//     title: "了个关注大冒险积分冲刺",
//     summary: "教程视频、打卡挑战和加分项正在开放，速来参与。",
//     meta: "进行中",
//     badge: "精选",
//     tone: "sky",
//   },
//   {
//     id: 2,
//     title: "话题周：春日创作计划",
//     summary: "发布指定标签内容可获得额外曝光推荐。",
//     meta: "今日截止",
//     badge: "推荐",
//     tone: "warm",
//   },
//   {
//     id: 3,
//     title: "互动任务：评论接力",
//     summary: "完成三次高质量互动可领取徽章与头像框。",
//     meta: "剩余 2 天",
//     badge: "任务",
//     tone: "sky",
//   },
//   {
//     id: 4,
//     title: "创作者加速营",
//     summary: "连续更新可进入加速营名单，获得专题位。",
//     meta: "即将开始",
//     badge: "预告",
//     tone: "warm",
//   },
// ]);
</script>

<template>
  <div class="notif">
    <main class="panel-main">
      <aside class="timeline-area">
        <div
          class="header mb-3 d-flex align-items-center justify-content-between gap-2 flex-row"
        >
          <h5 class="header-h5">消息列表</h5>
          <BButtonGroup size="sm">
            <BButton variant="outline-secondary" @click="handleClear"
              >清空消息</BButton
            >
            <BButton variant="outline-secondary" @click="handleExport"
              >导出</BButton
            >
          </BButtonGroup>
        </div>

        <div class="timeline-list">
          <div v-if="!shownTimeline.length" class="empty-timeline">
            暂无日志
          </div>
          <article
            v-for="item in shownTimeline"
            :key="item.id"
            class="timeline-item"
          >
            <div class="node" />
            <div class="content">
              <div class="time">{{ item.time }}</div>
              <div class="title">{{ item.title }}</div>
              <p>{{ item.detail }}</p>
            </div>
          </article>
        </div>
      </aside>

      <section class="activity-area">
        <h5 class="header-h5">活动板块</h5>
        <Empty title="暂未开放"/>
        <!-- <div class="activity-grid">
          <ActivityCard
            v-for="item in activities"
            :key="item.id"
            :title="item.title"
            :summary="item.summary"
            :meta="item.meta"
            :badge="item.badge"
            :tone="item.tone"
          />
        </div> -->
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.notif {
  padding: 1.1rem;
}

.panel-main {
  padding: 1rem;
  display: grid;
  grid-template-columns: 400px minmax(0, 1fr);
  gap: 1rem;
  min-height: 620px;
}
.header-h5 {
  @extend %reks-title;
}
.timeline-area {
  @extend %reks-card-box;

  padding: 0.9rem;
  overflow: hidden;
  min-height: 580px;
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
  padding-right: 1rem;
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

.empty-timeline {
  color: #8e7a69;
  font-size: 0.84rem;
  padding-left: 0.4rem;
}

.activity-area {
  @extend %reks-card-box;
  padding: 0.9rem;
  min-height: 580px;
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

@media (max-width: 1100px) {
  .panel-main {
    grid-template-columns: 1fr;
  }

  .timeline-area {
    min-height: 460px;
  }

  .activity-area {
    min-height: auto;
  }
}

@media (max-width: 680px) {
  .notif {
    padding: 0.85rem;
  }

  .panel-main {
    padding: 0.7rem;
  }

  .activity-grid {
    grid-template-columns: 1fr;
  }
}
</style>
