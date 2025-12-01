<script setup lang="ts">
import { useModal } from "bootstrap-vue-next";
import { ref } from "vue";
import { vBModal } from "bootstrap-vue-next/directives/BModal";
const metricsData = ref([
  { label: "订阅", value: 0 },
  { label: "博客", value: 0 },
  { label: "积分", value: 0 },
]);

const userLoggedIn = ref(false);

const { create } = useModal();

const easyLogin = () => {
  // userLoggedIn.value = true;
};
</script>

<template>
  <div
    class="profileCard d-flex flex-column align-items-center justify-content-center gap-3 mt-4"
  >
    <div v-if="userLoggedIn === false" class="user-no-login mt-3 pb-3">
      <div
        class="easy-login d-flex flex-row gap-4 justify-content-center align-items-center"
      >
        <div class="avatar">
          <BAvatar size="3rem" class="avatar" variant="secondary" />
        </div>
        <BButton v-b-modal.modal-scrollable variant="primary">登录</BButton>
        <BModal id="modal-scrollable" title="便捷登录">
          <BInputGroup>
            <BFormInput placeholder="用户名/邮箱" />

            <BFormSelect>
              <option value="bot">你不是人机</option>
              <option value="isbot">是的我是傻逼</option>
            </BFormSelect>
          </BInputGroup>
          <template #footer>
            <BButton variant="success" @click="easyLogin">登录</BButton>
          </template>
        </BModal>
      </div>
    </div>

    <!-- 用户登陆后才出现该选项 -->
    <Transition name="fadeIn" mode="out-in">
      <div
        v-if="userLoggedIn === true"
        class="user-login d-flex flex-column gap-4 justify-content-center align-items-center mt-3 pb-3 position-relative"
      >
        <div class="avatar">
          <BAvatar size="3rem" class="avatar" variant="secondary" />
        </div>
        <BButton variant="success">一键签到</BButton>

        <div class="metrics-bar d-flex flex-row gap-5">
          <div
            class="metrics-content d-flex flex-column align-items-center mt-2 mb-4"
            :key="metrics.label"
            v-for="metrics in metricsData"
          >
            <div class="value">{{ metrics.value }}</div>
            <div class="label">{{ metrics.label }}</div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
//用新语法@use代替旧语法@import
@use "../Asset/CustomStyle/global.scss";

.profileCard {
  @extend %reks-card-box;
  height: 400px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
  .easy-login-box {
    display: none;
  }
}

.avatar {
  @extend %reks-avatar;
  &:hover {
    transform: scale(1.1);
  }
}

.label {
  //只有 white-space: nowrap; 能保证一行显示。
  font-size: small;
  white-space: nowrap;
}

.fadeIn-enter-active,
.fadeIn-leave-active {
  transition: opacity 400ms cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: opacity, transform, filter;
}

/* 透明、向下偏移并模糊 */
.fadeIn-enter-from {
  opacity: 0;
  transform: translateY(10px);
  filter: blur(10px);
}
</style>
