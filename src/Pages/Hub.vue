<template>
  <div class="hub">
    <HubHeader />

    <section class="hub-shell mt-4 mb-4">
      <article class="hub-main overflow-hidden">
        <div class="hang">
          <HubCaro />
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

    <div class="hub-recommand">
      <Recommand />
    </div>
  </div>
</template>

<script setup lang="ts">
const entries = [
  { title: "词条：如何写一篇可持续更新的专栏", meta: "编辑区 · 12次修订" },
  { title: "词条：首页卡片排版规范", meta: "设计区 · 8次修订" },
  { title: "词条：音乐推荐格式模板", meta: "音乐区 · 15次修订" },
  { title: "词条：内容标签命名规则", meta: "维护区 · 6次修订" },
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
.hub-side{
  @extend %reks-card-box;
}

.hub-main {
  padding-top: 0;
  .hang {
    border-bottom: 1px solid rgba(30, 50, 38, 0.08);
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
  .hub-shell {
    grid-template-columns: 1fr;
  }
}
</style>
