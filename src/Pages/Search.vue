<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";

const lazyText = ref("");

// const toLowerCaseFormatter = (value: string) => value.toLowerCase();
</script>

<template>
  <div class="search d-flex flex-column align-items-center">
    <div class="search-input mt-5 w-50">
      <BInputGroup>
        <BFormInput type="text" v-model="lazyText" />
        <BButton variant="outline-success" class="d-flex align-items-center gap-1"> <Icon icon="bi:search" /> 搜索</BButton>
      </BInputGroup>
    </div>

    <div class="result mt-5 w-75">
      <!-- TODO: 搜索结果展示,要进行分类 -->
      <BCard class="result-nav" title="Card Title" no-body>
        <BCardHeader class="result-nav-header" header-tag="result-header-nav">
          <BNav card-header tabs>
            <BNavItem  exact exact-active-class="active">博客</BNavItem>
            <BNavItem  exact exact-active-class="active">电台</BNavItem>
            <BNavItem to="/" exact exact-active-class="active">图片</BNavItem>
            <BNavItem to="/" exact exact-active-class="active">用户</BNavItem>
          </BNav>
        </BCardHeader>

        <BCardBody class="result-body">
          <!-- <RouterView /> -->
        </BCardBody>
      </BCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";
.search{
  margin-top: 5rem;
}
.result-header-nav{
  background-color: rgba($color: #ffffff, $alpha: 0.2);
}
</style>
