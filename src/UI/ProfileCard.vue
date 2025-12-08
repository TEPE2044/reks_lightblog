<script setup lang="ts">
import { ref } from "vue";
import Auth from "./Auth.vue";
const metricsData = ref([
  { label: "订阅", value: 0 },
  { label: "博客", value: 0 },
  { label: "积分", value: 0 },
]);

import { userStore } from "../Store/user";
const user = userStore();

const easyLogout = () => {
  user.userLogout();
};
</script>

<template>
  <div
    class="profileCard d-flex flex-column align-items-center justify-content-center gap-3 mt-2"
  >
    <transition name="fadeIn" mode="out-in">
      <!-- 把两个状态作为 transition 的直接子元素并加 key，保证 out-in 正确工作 -->
      <div
        v-if="!user.isLoggedIn"
        key="logged-out"
        class="user-no-login mt-3 pb-3"
      >
        <div
          class="easy-login d-flex flex-row gap-4 justify-content-center align-items-center"
        >
          <div class="avatar">
            <BAvatar size="3rem" class="avatar" variant="secondary" />
          </div>

          <div class="auth-btn">
            <Auth/>
          </div>
        </div>
      </div>

      <div
        v-else
        key="logged-in"
        class="user-login d-flex flex-column gap-4 justify-content-center align-items-center mt-3 pb-3 position-relative"
      >
        <div class="d-flex flex-column gap-2 align-items-center">
          <!-- 如果头像加载失败或没有头像，使用默认头像 -->
          <BAvatar
            size="5rem"
            src="/ai.webp"
            class="avatar mb-2"
            variant="secondary"
          />
          <div class="user-name">梦璃東</div>
        </div>

        <BButtonGroup>
          <BButton variant="outline-success">一键签到</BButton>
          <BButton variant="outline-danger" @click="easyLogout"
            >退出登录</BButton
          >
        </BButtonGroup>

        <div class="metrics-bar d-flex flex-row gap-5 mt-2">
          <div
            class="metrics-content d-flex flex-column align-items-center"
            v-for="metrics in metricsData"
            :key="metrics.label"
          >
            <div class="value">{{ metrics.value }}</div>
            <div class="label">{{ metrics.label }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
@use "../Asset/CustomStyle/global.scss" as global;
@use "../Asset/CustomStyle/open-font.scss";

.profileCard {
  @extend %reks-card-box;
  height: global.$caro-height;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
}

.user-name {
  font-family: "Alibaba-PuHuiTi-Medium", sans-serif;
}

.avatar {
  @extend %reks-avatar;

  &:hover {
    transform: scale(1.05);
  }
}

/* 完整的“迷雾出现/消失”过渡（enter + leave 都定义）*/
.fadeIn-enter-active,
.fadeIn-leave-active {
  transition: opacity 320ms cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: opacity, transform, filter;
}

/* 进入：从透明、下移、模糊 到 可见、原位、清晰 */
.fadeIn-enter-from {
  opacity: 0;
  transform: translateY(10px);
  filter: blur(10px);
}

.fadeIn-enter-to {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

/* 离开：从可见 到 透明、上移、模糊（与 enter 方向相反）*/
.fadeIn-leave-from {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

.fadeIn-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  filter: blur(8px);
}

/* reduced motion 支持 */
@media (prefers-reduced-motion: reduce) {
  .fadeIn-enter-active,
  .fadeIn-leave-active {
    transition: none !important;
  }
}
</style>
