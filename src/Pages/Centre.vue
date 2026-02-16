<script setup lang="ts">
import { userStore } from "../Store/user";
const user = userStore();

const navs = [
  { name: "我的博客", path: { name: "my-blog" } },
  { name: "我的收藏", path: { name: "my-fav" } },
  { name: "我的信息", path: { name: "edit-profile" } },
  { name: "账号安全", path: { name: "safe-setting" } },
];
</script>

<template>
  <div class="centre w-100 h-100">
    <BContainer
      class="centre-header p-5 d-flex align-items-center justify-content-around mt-5 gap-3"
    >
      <div class="infos d-flex gap-3 align-items-center">
        <div class="avatar">
          <BAvatar
            size="100px"
            style="box-shadow: grey 2px 3px 2px 1px"
            :src="user.userInfo.avatar || ''"
          />
        </div>
        <div class="info">
          <div class="name fw-bolder h5">
            {{ user.userInfo?.username || "无名" }}
          </div>
          <div class="sign text-secondary">
            {{ user.userInfo?.sign || "" }}
          </div>
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
          <BNavItem
            v-for="nav in navs"
            :key="nav.name"
            :to="nav.path"
            router-tag="router-link"
            exact
          >
            {{ nav.name }}
          </BNavItem>
          <BNavItem @click="" exact
            >返回主页</BNavItem
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
    //TODO:要统一内容高度
    height: 10rem;
    grid-template-areas: "asides contents";
    grid-template-columns: 200px 3fr;
    .centre-sidebar {
      grid-area: asides;
      height: 100%;
      @extend %reks-card-box;
    }
    .centre-content {
      height: 100%;
      grid-area: contents;
      @extend %reks-card-box;
    }
  }
}
</style>
