<script setup lang="ts">
import { computed, ref } from "vue";
import type { PageWrapper } from "../Utils/reks-interface";
import { searchStore } from "../Store/search";
import { storeToRefs } from "pinia";

const { blogRes } = storeToRefs(searchStore());

// 会自动计算要有多少页
const pages = ref<PageWrapper>({
  currentPage: 1, //当前页码
  perPage: 5, // 单页限制多少
  rows: 0, // 总共有多少数据
});

const empty = computed(() => pages.value.rows === 0 || blogRes.value.length === 0);
</script>

<template>
  <div class="search d-flex flex-column align-items-center">
    <div class="search-input mt-5 w-75">
      <RadioSelector v-model="pages" />
    </div>

    <div class="result mt-5 w-75">
      <BCard class="result-nav" title="Card Title" no-body>
        <BCardHeader class="result-nav-header" header-tag="result-header-nav">
          <BTabs>
            <BTab active title="博客"></BTab>
            <BTab lazy title="音乐"></BTab>
            <BTab lazy title="用户"></BTab>
          </BTabs>
        </BCardHeader>

        <BCardBody class="result-body">
          <div class="result-item" v-if="empty">
            <Empty title="未找到内容" />
          </div>

          <div class="result-item" v-else>
            <div class="result-summary d-flex align-items-center justify-content-between">
              <div class="summary-title">搜索结果</div>
              <div class="summary-count">共 {{ pages.rows }} 条</div>
            </div>
            <div class="text-secondary font-monospace mb-3 small">
              当前页：第 {{ pages.currentPage }} 页
            </div>
            <article
              class="row mb-3 border card-box atc g-0"
              v-for="i in blogRes"
              :key="`rs${i.id}${i.author.id}`"
            >
              <div class="col-md-5 p-3 img-meta">
                <img :src="i.cover" class="card-img" :alt="`alt${i.cover}`" />
              </div>
              <div class="col-md-7 p-4 card-content d-flex flex-column justify-content-between">
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
          </div>
        </BCardBody>
        <BCardFooter>
          <BPagination
            class="d-flex align-items-center justify-content-center mt-3 page-style"
            v-model="pages.currentPage"
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;

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
}
</style>
