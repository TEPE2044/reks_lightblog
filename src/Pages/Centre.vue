<script setup lang="ts">
import { onMounted, ref } from "vue";
import router from "../Router";
import {
  queryFollowerList,
  queryFollowingList,
  queryFollowStats,
} from "../Hooks/SubScribe";
import { userStore } from "../Store/user";
const user = userStore();

const navs = [
  { name: "我的博客", path: { name: "my-blog" } },
  { name: "我的音乐", path: { name: "my-music" } },
  { name: "我的收藏", path: { name: "my-fav" } },
  { name: "我的信息", path: { name: "edit-profile" } },
  { name: "账号安全", path: { name: "safe-setting" } },
];

const followStats = ref({
  followingCount: 0,
  followerCount: 0,
});
const followingList = ref<{ rid: number; username: string }[]>([]);
const followerList = ref<{ rid: number; username: string }[]>([]);

const loadFollowData = async () => {
  try {
    const [stats, following, followers] = await Promise.all([
      queryFollowStats(),
      queryFollowingList(),
      queryFollowerList(),
    ]);
    followStats.value = stats;
    followingList.value = following;
    followerList.value = followers;
  } catch (e) {
    console.warn("加载关注数据失败", e);
  }
};

const goGuestView = async () => {
  const rid = Number(user.userInfo?.reks_id);
  if (!Number.isInteger(rid) || rid <= 0) return;
  await router.push({ name: "guest-centre", params: { id: rid } });
};

const goHome = async () => {
  await router.push({ name: "home" });
};

onMounted(() => {
  void loadFollowData();
});
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
      <div class="profile-tools d-flex flex-column align-items-end gap-2">
        <div class="follow-stats d-flex align-items-center gap-3">
          <BDropdown size="sm" variant="outline-secondary" no-caret>
            <template #button-content>
              <span>关注：{{ followStats.followingCount }}</span>
            </template>
            <BDropdownHeader>关注列表</BDropdownHeader>
            <BDropdownItem
              v-for="item in followingList"
              :key="`following-${item.rid}`"
              :to="{ name: 'guest-centre', params: { id: item.rid } }"
              router-tag="router-link"
            >
              {{ item.username }}
            </BDropdownItem>
            <BDropdownItemButton v-if="followingList.length === 0" disabled>
              暂无关注
            </BDropdownItemButton>
          </BDropdown>

          <BDropdown size="sm" variant="outline-secondary"  no-caret>
            <template #button-content>
              <span>粉丝：{{ followStats.followerCount }}</span>
            </template>
            <BDropdownHeader>粉丝列表</BDropdownHeader>
            <BDropdownItem
              v-for="item in followerList"
              :key="`follower-${item.rid}`"
              :to="{ name: 'guest-centre', params: { id: item.rid } }"
              router-tag="router-link"
            >
              {{ item.username }}
            </BDropdownItem>
            <BDropdownItemButton v-if="followerList.length === 0" disabled>
              暂无粉丝
            </BDropdownItemButton>
          </BDropdown>
        </div>

        <div class="guest-action-row">
          <BButton
            size="sm"
            variant="light"
            class="guest-view-btn d-inline-flex align-items-center gap-2"
            @click="goGuestView"
          >
            <i-bi-eye />
            <span>游客视角</span>
          </BButton>
        </div>
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
          <BNavItem @click="goHome" exact
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

    .profile-tools {
      min-width: 220px;

      .follow-stats {
        :deep(.btn) {
          min-width: 96px;
        }
      }

      .guest-action-row {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-top: 0.35rem;
      }

      .guest-view-btn {
        border: 1px solid rgba(178, 34, 34, 0.3);
        color: firebrick;
        background: rgba(178, 34, 34, 0.07);
        font-weight: 600;
        letter-spacing: 0.01em;
      }

      .guest-view-btn:hover {
        background: rgba(178, 34, 34, 0.14);
        border-color: rgba(178, 34, 34, 0.45);
      }
    }
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
