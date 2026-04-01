<template>
  <div class="hub">
    <HubHeader />

    <section class="hub-shell mt-4 mb-4">
      <article class="hub-main overflow-hidden">
        <div class="hang">
          <HubCaro />
        </div>

        <div class="atlas p-3">
          <div class="atlas-head d-flex flex-row gap-4">
            <h5>这里的主题不够好看</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit
              omnis vitae pariatur facilis ex quae, beatae, molestias voluptatum
              similique harum fugiat quod perferendis iste laudantium ratione
              ipsum libero incidunt dolore?
            </p>
            <!-- <span>按主题快速进入社区知识区</span> -->
          </div>

          <!-- <div class="atlas-tags">
            <button v-for="topic in topics" :key="topic" class="topic-chip" type="button">
              {{ topic }}
            </button>
          </div> -->
        </div>
      </article>

      <aside class="hub-side p-3">
        <div class="side-head">
          <h5>热门标签</h5>
          <span>像翻百科一样探索内容</span>
        </div>

        <ul class="entry-list">
          <li v-for="entry in entries" :key="entry.title">
            <p class="entry-title">{{ entry.title }}</p>
            <span class="entry-meta">{{ entry.meta }}</span>
          </li>
        </ul>

        <div class="random-entry">
          <h6>随机词条</h6>
          <p>{{ randomEntry }}</p>
        </div>
      </aside>
    </section>

    <section class="hub-lens mb-4">
      <article class="hub-timeline p-3">
        <h5>网站动态</h5>
        <ul>
          <li v-for="item in timeline" :key="item.date + item.event">
            <span class="date">{{ item.date }}</span>
            <p>{{ item.event }}</p>
          </li>
        </ul>
      </article>

      <article class="hub-focus p-3">
        <h5>热议条目</h5>
        少了音乐节目
        <div class="focus-list">
          <div class="focus-item" v-for="hot in hotTopics" :key="hot.title">
            <p class="title">{{ hot.title }}</p>
            <span>{{ hot.desc }}</span>
          </div>
        </div>
      </article>
    </section>

    <div class="hub-recommand">
      <div class="hub-recommand-head px-2">
        <h5>协作广场</h5>
        <span>推荐、讨论在这里汇流</span>
      </div>
      <Recommand />
    </div>
  </div>
</template>

<script setup lang="ts">
const topics = [
  "新手引导",
  "编辑器技巧",
  "写作风格",
  "音乐策展",
  "活动记录",
  "公共资源",
  "站点历史",
  "社区公约",
];

const entries = [
  { title: "词条：如何写一篇可持续更新的专栏", meta: "编辑区 · 12次修订" },
  { title: "词条：首页卡片排版规范", meta: "设计区 · 8次修订" },
  { title: "词条：音乐推荐格式模板", meta: "音乐区 · 15次修订" },
  { title: "词条：内容标签命名规则", meta: "维护区 · 6次修订" },
];

const timeline = [
  { date: "04-01", event: "社区广场改版，新增词条索引与时间轴视图。" },
  { date: "03-28", event: "创作者协作挑战开启，主题为“春日记录”。" },
  { date: "03-24", event: "站点公共素材库上线，支持模板复用。" },
  { date: "03-18", event: "发布内容标注规范，优化搜索与归档体验。" },
];

const hotTopics = [
  { title: "沉浸式长文的封面策略", desc: "讨论如何让标题与首图形成叙事关系。" },
  { title: "社区播客栏目提案", desc: "围绕“慢读”和“慢聊”的新栏目征集。" },
  { title: "个人主页信息架构", desc: "关于展示作品、动态、收藏的模块组织。" },
];

const randomEntry = "词条：如何在 1200 字内讲清一个真实故事";
</script>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.hub {
  margin-top: 7.3rem;
  padding-bottom: 2rem;
}

.hub-shell {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.hub-main,
.hub-side,
.hub-timeline,
.hub-focus,
.hub-recommand-head {
  @extend %reks-card-box;
}

.hub-main {
  padding-top: 0;
  .hang {
    border-bottom: 1px solid rgba(30, 50, 38, 0.08);
  }

  .atlas {
    .atlas-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 0.75rem;

      h5 {
        @extend %reks-section-title;
        margin: 0;
        color: #223428;
      }

      span {
        font-size: 0.88rem;
        color: #4b5e4f;
      }
    }
  }
}

.hub-side {
  .side-head {
    margin-bottom: 0.8rem;

    h5 {
      @extend %reks-section-title;
      margin: 0;
      color: #203126;
    }

    span {
      font-size: 0.85rem;
      color: #4d5f50;
    }
  }

  .entry-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.5rem;

    li {
      border-radius: 10px;
      padding: 0.55rem 0.6rem;
      background: rgba(255, 255, 255, 0.65);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.42);
    }

    .entry-title {
      margin: 0;
      color: #2a3d30;
      font-size: 0.9rem;
      line-height: 1.35;
    }

    .entry-meta {
      color: #5a6c5d;
      font-size: 0.78rem;
    }
  }

  .random-entry {
    margin-top: 0.85rem;
    border-radius: 10px;
    background: #f8f5ec;
    padding: 0.6rem;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.56);

    h6 {
      margin: 0;
      color: #24352a;
      font-size: 0.85rem;
    }

    p {
      margin: 0.35rem 0 0;
      font-size: 0.88rem;
      color: #44584a;
    }
  }
}

.hub-lens {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1rem;

  h5 {
    @extend %reks-section-title;
    margin: 0 0 0.7rem;
    color: #223328;
  }

  .hub-timeline {
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.55rem;
    }

    li {
      display: grid;
      grid-template-columns: 56px 1fr;
      gap: 0.75rem;
      align-items: start;
      border-left: 2px solid rgba(60, 87, 69, 0.2);
      padding-left: 0.65rem;

      .date {
        color: #2f4b39;
        font-weight: 600;
        font-size: 0.84rem;
      }

      p {
        margin: 0;
        color: #4d6152;
        font-size: 0.9rem;
      }
    }
  }

  .hub-focus {
    .focus-list {
      display: grid;
      gap: 0.55rem;

      .focus-item {
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.65);
        padding: 0.58rem;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.44);

        .title {
          margin: 0;
          color: #223529;
          font-size: 0.92rem;
          font-weight: 600;
        }

        span {
          display: block;
          margin-top: 0.25rem;
          color: #566a5b;
          font-size: 0.84rem;
          line-height: 1.35;
        }
      }
    }
  }
}

.hub-recommand-head {
  border-radius: 10px;
  margin-bottom: 0.6rem;
  padding-top: 0.55rem;
  padding-bottom: 0.55rem;

  h5 {
    @extend %reks-section-title;
    margin: 0;
    color: #233529;
  }

  span {
    font-size: 0.86rem;
    color: #536656;
  }
}

@media (max-width: 1100px) {
  .hub-shell,
  .hub-lens {
    grid-template-columns: 1fr;
  }
}
</style>
