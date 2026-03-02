<script setup lang="ts">
import { computed, ref } from "vue";
import type { MusicResponse, PageWrapper } from "../Utils/reks-interface";
import { searchStore } from "../Store/search";
import { storeToRefs } from "pinia";

import { playerStore } from "../Store/player";
import { BButtonGroup, useToast } from "bootstrap-vue-next";
import { createToast } from "../Utils/reks-toast";
import { detailStore } from "../Store/detail";

const { playQueueLength, currentIndex } = storeToRefs(playerStore());
const { selectOutSide, addIntoPlayQueue } = playerStore();

const { blogRes, musicRes, userRes, searchType } = storeToRefs(searchStore());
const { switchSearchType } = searchStore();

const { get_detail } = detailStore();

// 会自动计算要有多少页
const pages = ref<PageWrapper>({
  currentPage: 1, //当前页码
  perPage: 5, // 单页限制多少
  rows: 0, // 总共有多少数据
});

const toast = useToast();

const activeListLength = computed(() => {
  if (searchType.value === "music") return musicRes.value.length;
  if (searchType.value === "user") return userRes.value.length;
  return blogRes.value.length;
});

const empty = computed(
  () => pages.value.rows === 0 || activeListLength.value === 0,
);

const currentPage = computed({
  get: () => pages.value.currentPage,
  set: (value: number) => {
    pages.value = {
      ...pages.value,
      currentPage: value,
    };
  },
});

const tabTitle = computed(() => {
  if (searchType.value === "music") return "音乐结果";
  if (searchType.value === "user") return "用户结果";
  return "博客结果";
});

const caseAdd = (m: MusicResponse) => {
  if (playQueueLength.value === 0) {
    get_detail({ title: m?.name, author: m?.username, cover: m?.cover });
  }
  const res = addIntoPlayQueue(
    { cover: m?.cover, songURL: m?.audio, title: m?.name, author: m?.username },
    currentIndex.value,
  );
  if (res) {
    createToast(toast, "添加成功", "歌曲添加成功", "success");
  } else {
    createToast(toast, "重复添加", "歌曲重复添加", "success");
  }
};

const casePlay = (m: MusicResponse) => {
  try {
    selectOutSide({
      cover: m?.cover,
      songURL: m?.audio,
      title: m?.name,
      author: m?.username,
    });
    get_detail({ title: m?.name, author: m?.username, cover: m?.cover });
    createToast(
      toast,
      "播放成功",
      `正在播放 ${m?.username} - ${m?.name}`,
      "success",
    );
  } catch (e) {
    createToast(toast, "播放失败", "未知原因", "danger");
    console.error(e);
  }
};
</script>

<template>
  <div class="search d-flex flex-column align-items-center">
    <div class="search-input mt-5 w-75">
      <RadioSelector v-model="pages" :active-tab="searchType" />
    </div>

    <div class="result mt-5 w-75">
      <BCard class="result-nav" title="Card Title" no-body>
        <BCardHeader class="result-nav-header" header-tag="result-header-nav">
          <BTabs>
            <BTab
              title="博客"
              :active="searchType === 'keyword'"
              @click.stop="switchSearchType('keyword')"
            />
            <BTab
              title="音乐"
              :active="searchType === 'music'"
              @click.stop="switchSearchType('music')"
            />
            <BTab
              title="用户"
              :active="searchType === 'user'"
              @click.stop="switchSearchType('user')"
            />
          </BTabs>
        </BCardHeader>

        <BCardBody class="result-body">
          <div class="result-item" v-if="empty">
            <Empty title="未找到内容" />
          </div>

          <div class="result-item" v-else>
            <div
              class="result-summary d-flex align-items-center justify-content-between"
            >
              <div class="summary-title">{{ tabTitle }}</div>
              <div class="summary-count">共 {{ pages.rows }} 条</div>
            </div>
            <div class="text-secondary font-monospace mb-3 small">
              当前页：第 {{ pages.currentPage }} 页
            </div>

            <article
              v-if="searchType === 'keyword'"
              class="row mb-3 border card-box atc g-0"
              v-for="i in blogRes"
              :key="`rs${i.id}${i.author.id}`"
            >
              <div class="col-md-5 p-3 img-meta">
                <img :src="i.cover" class="card-img" :alt="`alt${i.cover}`" />
              </div>
              <div
                class="col-md-7 p-4 card-content d-flex flex-column justify-content-between"
              >
                <router-link :to="`/blog/${i.id}`">
                  <h5 class="mt-0 fw-bold title-link">{{ i.title }}</h5>
                </router-link>
                <div class="author d-flex flex-row align-items-center gap-3">
                  <BAvatar :src="i.author.avatar" size="40" />
                  <div class="username text-secondary">
                    {{ i.author.username }}
                  </div>
                </div>
              </div>
            </article>

            <article
              v-if="searchType === 'music'"
              class="music-box mb-3"
              v-for="m in musicRes"
              :key="`music-${m.id}`"
            >
              <div class="music-cover">
                <img :src="m.cover" :alt="`music-${m.id}`" />
              </div>

              <div class="music-content">
                <h5 class="music-title">{{ m.name }}</h5>
                <div class="music-desc text-secondary">{{ m.desc }}</div>

                <div class="music-meta d-flex align-items-center gap-3">
                  <BAvatar :src="m.avatar" size="36" />
                  <span class="text-secondary">{{ m.username }}</span>
                </div>
                <BButtonGroup class="control-btn mt-3 py-2">
                  <BButton
                    variant="light"
                    size="sm"
                    class="control-btn-item"
                    @click.stop="casePlay(m)"
                  >
                    <i-bi-play-circle-fill class="fs-4" />
                  </BButton>
                  <BButton
                    variant="light"
                    size="sm"
                    class="control-btn-item"
                    @click.stop="caseAdd(m)"
                  >
                    <i-bi-plus-circle class="fs-5" />
                  </BButton>
                </BButtonGroup>
              </div>
            </article>

            <article
              v-if="searchType === 'user'"
              class="user-box mb-3 d-flex align-items-center"
              v-for="u in userRes"
              :key="`user-${u.reks_id}`"
            >
              <BAvatar :src="u.avatar" size="56" />
              <div class="user-content ms-3">
                <div class="user-name fw-bold">{{ u.username }}</div>
                <div class="user-signature text-secondary">
                  {{ u.signature || "这个用户很神秘，还没有留下签名。" }}
                </div>
              </div>
            </article>
          </div>
        </BCardBody>
        <BCardFooter>
          <BPagination
            class="d-flex align-items-center justify-content-center mt-3 page-style"
            v-model="currentPage"
            :total-rows="pages?.rows"
            :per-page="pages?.perPage"
            last-number
          />
        </BCardFooter>
      </BCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

:deep(.nav-link),
:deep(.page-link) {
  color: black !important;
  z-index: 0;
}
:deep(.page-item.active) {
  background-color: rgba(178, 34, 34, 0.589) !important;
}
:deep(.nav-link.active) {
  color: firebrick !important;
}
:deep(.card-header) {
  background-color: rgba(255, 236, 201, 0.219) !important;
}

.search {
  margin-top: 5rem;
}

.result-body {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.75) 0%,
    rgba(255, 255, 255, 0.6) 100%
  );
}

.result-summary {
  margin-bottom: 0.5rem;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(220, 220, 220, 0.8);
  background-color: rgba(255, 255, 255, 0.72);

  .summary-title {
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: #4f4f4f;
  }

  .summary-count {
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
    background-color: rgba(178, 34, 34, 0.1);
    color: firebrick;
    font-weight: 700;
    font-size: 0.85rem;
  }
}

.result-header-nav {
  background-color: rgba($color: #ffffff, $alpha: 0.2);
}

.card-box {
  min-height: 220px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.86);
  border-radius: 0.5rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }

  .img-meta {
    min-height: 220px;

    .card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
    }
  }

  .card-content {
    .title-link {
      color: #2f2f2f;
      line-height: 1.4;
      margin-bottom: 1rem;
    }

    .author {
      border-top: 1px dashed rgba(180, 180, 180, 0.6);
      padding-top: 0.85rem;
    }
  }
}

.atc:last-child {
  margin-bottom: 0;
}

.music-box {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(220, 220, 220, 0.9);
  background-color: rgba(255, 255, 255, 0.84);

  .music-cover img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 0.5rem;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
  }

  .music-title {
    margin-bottom: 0.5rem;
    color: #2f2f2f;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  .music-desc {
    margin-bottom: 0.8rem;
    line-height: 1.5;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .music-meta {
    flex-wrap: wrap;
    padding-top: 0.25rem;

    span {
      font-size: 0.92rem;
      font-weight: 500;
    }

    audio {
      max-width: 320px;
      height: 34px;
    }
  }

  .control-btn {
    gap: 0.5rem;
  }
}

.user-box {
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(220, 220, 220, 0.9);
  background-color: rgba(255, 255, 255, 0.84);

  .user-name {
    color: #2f2f2f;
    margin-bottom: 0.2rem;
  }

  .user-signature {
    font-size: 0.9rem;
    line-height: 1.5;
  }
}

@media (max-width: 768px) {
  .card-box {
    min-height: auto;

    .img-meta {
      min-height: 180px;

      .card-img {
        border-top-right-radius: 0.5rem;
        border-bottom-left-radius: 0;
      }
    }
  }

  .music-box {
    grid-template-columns: 1fr;

    .music-cover img {
      height: 180px;
    }
  }
}
</style>
