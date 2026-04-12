<script setup lang="ts">
import { onMounted, ref } from "vue";

type TimelineItem = {
  event: string;
  date?: string;
  big?: string;
};

const hotTopics = [
  {
    title: "ReKindlers是什么",
    desc: "ReKindlers是一个音乐轻博客平台。",
    hint: "连接你我的旋律容器。",
  },
  {
    title: "在ReKindlers里能做什么",
    desc: "在音乐与文字交织的空间里，上传你的旋律，写下你的故事，与懂你的人聊聊。",
    hint: "我想打造一个梦想中的乐园。",
  },
  {
    title: "你是谁",
    desc: "我是梦璃東，是本站的开发者。",
    hint: "我是一个妄想家。",
  },
];

const timeline = ref<TimelineItem[]>([]);
const hoveredTopic = ref<string | null>(null);

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
    <BContainer class="home-hotlist mt-4">
      <HotList />
    </BContainer>
    <!-- <BContainer class="home-cross mt-4 mb-4">
      <Gallery/>
    </BContainer> -->
    <BContainer class="home-lens mt-4 mb-4">
      <article class="home-describe p-3">
        <h5>关于ReKindlers</h5>
        <div class="focus-list mt-3 d-grid gap-2">
          <div
            class="focus-item rounded-3 p-3"
            :class="{ 'is-active': hoveredTopic === hot.title }"
            v-for="hot in hotTopics"
            :key="hot.title"
            tabindex="0"
            @mouseenter="hoveredTopic = hot.title"
            @mouseleave="hoveredTopic = null"
            @focusin="hoveredTopic = hot.title"
            @focusout="hoveredTopic = null"
          >
            <div class="focus-head d-flex align-items-center">
              <p class="title mb-0 h4 fw-semibold">{{ hot.title }}</p>
            </div>
            <div class="text-swap position-relative mt-3">
              <span class="desc-layer desc-origin d-block lh-base">{{
                hot.desc
              }}</span>
              <span class="desc-layer desc-hint d-block lh-base">{{
                hot.hint || hot.desc
              }}</span>
            </div>
          </div>
        </div>
      </article>
      <article class="home-timeline p-3">
        <h5>网站动态</h5>
        <div class="timeline">
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
        </div>
      </article>
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
    grid-template-columns: 1.6fr 1fr;
    gap: 1rem;

    h5 {
      @extend %reks-title;
      margin: 0 0 0.7rem;
    }

    .home-timeline,
    .home-describe {
      @extend %reks-card-box;
      max-height: 500px;
    }

    .home-timeline {
      .timeline {
        overflow-y: scroll;
        overflow-x: hidden;
        max-height: 300px;
      }

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
        border-left: 2px solid rgba(178, 64, 64, 0.25);
        padding-left: 0.65rem;

        .date {
          font-weight: 600;
          font-size: 0.84rem;
        }

        p {
          margin: 0;
          color: #4e4747;
          font-size: 0.9rem;
        }
      }
    }

    .home-describe {
      .focus-list {
        .focus-item {
          background: rgba(255, 255, 255, 0.86);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.44),
            0 8px 16px rgba(122, 39, 39, 0.1);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
          outline: none;

          &:hover {
            transform: translateY(-2px);
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.65),
              0 12px 22px rgba(128, 34, 34, 0.16);
          }

          &:focus-visible {
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.72),
              0 0 0 2px rgba(178, 64, 64, 0.3),
              0 12px 22px rgba(128, 34, 34, 0.14);
          }

          .title {
            font-size: 0.92rem;
          }

          .text-swap {
            min-height: 1.6rem;
          }

          .desc-layer {
            font-size: 1rem;
            transition: opacity 0.26s ease;
          }

          .desc-origin {
            opacity: 1;
          }

          .desc-hint {
            position: absolute;
            inset: 0;
            opacity: 0;
            color: #8a2f2f;
          }

          &.is-active {
            .desc-origin {
              opacity: 0;
            }

            .desc-hint {
              opacity: 1;
            }
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
