<script setup lang="ts">

import { onMounted, ref } from "vue";
import type { PageWrapper } from "../Utils/reks-interface";
const lazyText = ref("");
const lazyTags = ref([]);

// 请求参数 内容，标签，

// const toLowerCaseFormatter = (value: string) => value.toLowerCase();
const pages = ref<PageWrapper>({
  currentPage: 1,
  perPage: 1,
  pageLimit: 5,
  rows: 0,
});

onMounted(() => {
  pages.value = {
    currentPage: 1,
    perPage: 1,
    pageLimit: 5,
    rows: 5,
  };
});
</script>

<template>
  <div class="search d-flex flex-column align-items-center">
    <div class="search-input mt-5 w-75">
      <BInputGroup>
        <BFormInput type="text" v-model="lazyText" />
        <BButton
          variant="outline-success"
          class="d-flex align-items-center gap-1"
        >
        <i-bi-search/> 搜索</BButton
        >
      </BInputGroup>
    </div>
    <div class="tags mt-3 w-50">
      <BInputGroup>
        <BFormTags
          v-model="lazyTags"
          :limit="5"
          remove-on-delete
          add-button-text="Add"
          limit-tags-text="最多只能设置5个标签噢"
          input-id="tags-basic"
          placeholder="添加标签(使用回车确定标签)"
        />
      </BInputGroup>
    </div>

    <div class="result mt-5 w-75">
      <BCard class="result-nav" title="Card Title" no-body>
        <BCardHeader class="result-nav-header" header-tag="result-header-nav">
          <BNav card-header tabs>
            <BNavItem exact exact-active-class="active">博客</BNavItem>
            <BNavItem>电台</BNavItem>
            <BNavItem>图片</BNavItem>
            <BNavItem>用户</BNavItem>
          </BNav>
        </BCardHeader>

        <BCardBody class="result-body">
          <div class="result-item">
            <div class="text-secondary font-monospace">检索到共25条结果</div>
            <article
              class="row mb-2 shadow-md border card-box atc"
              style="padding-top: 0"
              v-for="i in pages.pageLimit"
            >
              <div class="col-6 p-4 img-meta" :key="`rs${i}`">
                <img
                  src="https://picsum.photos/id/1/200/300"
                  class="card-img"
                  alt="..."
                />
              </div>
              <div class="col-6 p-4">
                <router-link to="/">
                  <h5 class="mt-0">梦</h5>
                  <p>重燃希望</p>
                </router-link>
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
.result-header-nav {
  background-color: rgba($color: #ffffff, $alpha: 0.2);
}

.card-box {
  max-height: 200px;
  background-color: rgba(255, 255, 255, 0.86);
  border-radius: 0.5rem;
  padding-top: 0.5rem;
  .img-meta {
    max-height: 200px;
    .card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-top-right-radius: 0.5rem;
      border-top-left-radius: 0.5rem;
    }
  }
}

.atc:last-child {
  margin-bottom: 0;
}
</style>
