<script setup lang="ts">
import { onMounted, ref } from "vue";

type TimelineItem = {
  event: string;
  date?: string;
  big?: string;
};

// const hotTopics = [
//   { title: "沉浸式长文的封面策略", desc: "讨论如何让标题与首图形成叙事关系。" },
//   { title: "社区播客栏目提案", desc: "围绕“慢读”和“慢聊”的新栏目征集。" },
//   { title: "个人主页信息架构", desc: "关于展示作品、动态、收藏的模块组织。" },
// ];

const timeline = ref<TimelineItem[]>([]);

onMounted(async () => {
  const res = await fetch("/timeline.json");
  timeline.value = await res.json();
});
</script>

<template>
  <div class="home">
    <BContainer class="home-header">
      <div class="activities-caro">
        <Caro />
      </div>

      <div class="fastlogin">
        <FastLogin />
      </div>
    </BContainer>
    <BContainer class="home-content mt-4">
      <ShowCase />
    </BContainer>
    <!-- <BContainer class="home-lens mt-4 mb-4">
      <article class="hub-timeline p-3">
        <h5>网站动态</h5>
        <ul>
          <li
            v-for="item in timeline"
            :key="item.date + item.event"
            class="d-flex align-items-center"
          >
            <div class="fw-bolder" v-if="item?.big">{{ item?.big }}</div>
            <span class="date" v-else>
              {{ item.date }}
            </span>
            <p>{{ item.event }}</p>
          </li>
        </ul>
      </article>

      <article class="hub-radio p-3">
        <h5>焠星电台</h5>
        <div class="focus-list">
          <div class="focus-item" v-for="hot in hotTopics" :key="hot.title">
            <p class="title">{{ hot.title }}</p>
            <span>{{ hot.desc }}</span>
          </div>
        </div>
      </article>
    </BContainer> -->
    <BContainer class="home-hotlist mt-4">
      <HotList />
    </BContainer>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.home {
  .home-header {
    margin-top: 7.3rem;
    display: grid;
    grid-template-areas: "fastlogin caro";
    grid-template-columns: 1fr 4fr;
    gap: 20px;

    @media (max-width: 1000px) {
      display: flex;
      flex-direction: column;
    }

    .activities-caro {
      grid-area: caro;
    }

    .fastlogin {
      grid-area: fastlogin;
    }
  }

  .home-lens {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 1rem;

    h5 {
      @extend %reks-title;
      margin: 0 0 0.7rem;
      color: #223328;
    }

    .hub-timeline,
    .hub-radio {
      @extend %reks-card-box;
      max-height: 300px;
    }

    .hub-timeline {
      overflow-y: scroll;
      overflow-x: hidden;
      ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 0.55rem;
      }

      li {
        display: grid;
        grid-template-columns: 90px 1fr;
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

    .hub-radio {
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

  @media (max-width: 1100px) {
    .home-lens {
      grid-template-columns: 1fr;
    }
  }
}
</style>
