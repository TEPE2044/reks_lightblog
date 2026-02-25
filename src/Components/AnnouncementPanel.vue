<script setup lang="ts">
import { computed, ref } from "vue";

const announcements = ref([
  {
    id: 1,
    title: "系统维护通知",
    content: "今晚 23:30-00:30 将进行系统维护，期间部分功能不可用。",
    tag: "置顶",
    time: "2分钟前",
  },
  {
    id: 2,
    title: "新增隐私设置",
    content: "支持对关注列表和动态可见范围进行配置。",
    tag: "更新",
    time: "1小时前",
  },
  {
    id: 3,
    title: "活动提醒",
    content: "本周社区活动已上线，欢迎参与。",
    tag: "活动",
    time: "昨天",
  },
]);

const subscriptions = ref([
  {
    id: 1,
    name: "梦璃東",
    latest: "发布了新博客：『风起云涌』",
    time: "3分钟前",
    unread: true,
  },
  {
    id: 2,
    name: "小林",
    latest: "更新了随笔：『旅途』",
    time: "18分钟前",
    unread: true,
  },
  {
    id: 3,
    name: "阿泽",
    latest: "发布了新博客：『工程札记』",
    time: "2小时前",
    unread: false,
  },
  {
    id: 4,
    name: "Mika",
    latest: "更新了笔记：『本周总结』",
    time: "昨天",
    unread: false,
  },
]);

const unreadCount = computed(() =>
  subscriptions.value.filter((item) => item.unread).length,
);
</script>

<template>
  <div class="announcement-panel">
    <section class="announce-list">
      <div class="panel-title">
        <span>公告</span>
        <span class="hint">最新系统通知与活动</span>
      </div>
      <div class="announce-card" v-for="item in announcements" :key="item.id">
        <div class="card-top">
          <div class="title">{{ item.title }}</div>
          <span class="tag">{{ item.tag }}</span>
        </div>
        <div class="content">{{ item.content }}</div>
        <div class="time">{{ item.time }}</div>
      </div>
    </section>

    <aside class="subscribe-list">
      <div class="panel-title">
        <span>订阅列表</span>
        <span class="badge" v-if="unreadCount">{{ unreadCount }}</span>
      </div>

      <div
        class="subscribe-card"
        v-for="item in subscriptions"
        :key="item.id"
      >
        <div class="avatar">
          <BAvatar />
          <span class="dot" v-if="item.unread"></span>
        </div>
        <div class="meta">
          <div class="name">{{ item.name }}</div>
          <div class="latest">{{ item.latest }}</div>
        </div>
        <div class="time">{{ item.time }}</div>
      </div>
    </aside>
  </div>
</template>

<style lang="scss" scoped>
.announcement-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1.5rem;
  width: min(100%, 1100px);
  margin: 0 auto;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  font-size: 1rem;
  color: #495057;
  margin-bottom: 0.9rem;

  .hint {
    font-weight: 400;
    font-size: 0.82rem;
    color: #6c757d;
  }

  .badge {
    margin-left: auto;
    background: #dc3545;
    color: #fff;
    padding: 0.1rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 999px;
  }
}

.announce-list {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 1rem;
  padding: 1.2rem;

  .announce-card {
    padding: 1rem;
    border-radius: 0.8rem;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    & + .announce-card {
      margin-top: 0.9rem;
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.8rem;
      margin-bottom: 0.5rem;

      .title {
        font-weight: 600;
        color: #212529;
      }

      .tag {
        font-size: 0.72rem;
        color: #0d6efd;
        background: rgba(13, 110, 253, 0.12);
        padding: 0.15rem 0.5rem;
        border-radius: 999px;
      }
    }

    .content {
      color: #495057;
      font-size: 0.92rem;
      line-height: 1.5;
    }

    .time {
      margin-top: 0.6rem;
      font-size: 0.75rem;
      color: #9aa0a6;
    }
  }
}

.subscribe-list {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 1rem;
  padding: 1.2rem;

  .subscribe-card {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 0.6rem;
    align-items: center;
    padding: 0.6rem 0.4rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);

    &:last-child {
      border-bottom: none;
    }

    .avatar {
      position: relative;

      .dot {
        position: absolute;
        right: -1px;
        bottom: -1px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #dc3545;
        border: 2px solid #fff;
      }
    }

    .meta {
      min-width: 0;

      .name {
        font-weight: 600;
        font-size: 0.9rem;
        color: #212529;
      }

      .latest {
        font-size: 0.78rem;
        color: #6c757d;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .time {
      font-size: 0.75rem;
      color: #9aa0a6;
      white-space: nowrap;
    }
  }
}

@media (max-width: 960px) {
  .announcement-panel {
    grid-template-columns: 1fr;
  }
}
</style>
