<script setup lang="ts">
import { useToggle } from "bootstrap-vue-next";
const esa = useToggle("avatar-me");

const navs = [
  { name: "我的投稿", path: "/some/route/foo" },
  { name: "我的收藏", path: "/some/route/aar" },
  { name: "我的合集", path: "/some/route/bar" },
  { name: "我的积分", path: "/some/route/car" },
  { name: "我的关注", path: "/some/route/dar" },
  { name: "我的等级", path: "/some/route/ear" },
  { name: "安全设置", path: "/some/route/far" },
];
</script>
<template>
  <div class="centre w-100 h-100">
    <BContainer
      class="centre-header p-5 d-flex align-items-center justify-content-around mt-5"
    >
      <div class="infos d-flex gap-3 align-items-center">
        <div class="info">
          <div class="name fw-bolder h5">梦璃東</div>
          <div class="sign text-secondary">这个人很懒</div>
        </div>
      </div>
      <div class="btns">
        <BButton variant="outline-secondary" class="mx-2">关注</BButton>
        <BDropdown offset="10" no-wrapper no-caret>
          <template #button-content>...</template>
          <BButton variant="outline-secondary" class="mx-2">私信</BButton>
          <BButton variant="outline-secondary" class="mx-2">举报</BButton>
        </BDropdown>
      </div>
    </BContainer>

    <BContainer class="centre-body mt-5 h-100">
      <div class="centre-sidebar p-3">
        <BNav card-header tabs vertical>
          <!-- <BNavItem>'s with child routes. Note the trailing slash on the first <BNavItem> -->
          <BNavItem
            v-for="nav in navs"
            :key="nav.name"
            :to="nav.path"
            exact
            exact-active-class="active"
          >
            {{ nav.name }}
          </BNavItem>
          <BNavItem @click="" exact exact-active-class="active"
            >退出登录</BNavItem
          >
        </BNav>
      </div>
      <div class="centre-content">
        <RouterView />
      </div>
    </BContainer>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";
:deep(.nav-link) {
  color: firebrick;
}
.centre {
  margin-top: 7.5rem;
  .centre-header {
    position: relative;
    width: 100%;
    @extend %reks-card-box;
    gap: 6rem; 
  }
  .centre-body {
    display: grid;
    width: 100%;
    gap: 3rem;
    padding: 0;
    grid-template-areas: "asides contents";
    grid-template-columns: 200px 3fr;
    .centre-sidebar {
      grid-area: asides;
      height: 100%;
      @extend %reks-card-box;
    }
    .centre-content {
      grid-area: contents;
      @extend %reks-card-box;
    }
  }
}
</style>
