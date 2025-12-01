<script setup lang="ts">
import { ref } from "vue";

//接口设计1
// 用户使用数据（头像、用户名称、订阅、博客数量、签到积分）

const metricsData = ref([
  { label: "订阅", value: 0 },
  { label: "博客", value: 0 },
  { label: "积分", value: 0 },
]);

const userLoggedIn = ref(false);

// 控制与标记
const modalRef = ref<any | null>(null); // BModal 实例 ref

// 用于判断模态框关闭的状态
const pendingLogin = ref(false);

// 表单数据
const loginName = ref("");
const password = ref("");

// 清空上次输入
const openBox = () => {
  loginName.value = "";
  password.value = "";
  pendingLogin.value = false;
  modalRef.value?.show?.();
};

// 点击ok按钮后的处理函数
// TODO:处理登录
const easyLogin = () => {

  //处理完毕后执行
  alert("登录成功");
  pendingLogin.value = true;
};

// 模态框隐藏后的处理函数
// 如果是登录后隐藏，则更新登录状态
const onModalHidden = () => {
  if (pendingLogin.value === true) {
    userLoggedIn.value = true;
    pendingLogin.value = false;
  } else {
    pendingLogin.value = false;
  }
};

const easyLogout = () => {
  userLoggedIn.value = false;
  pendingLogin.value = false;
  // 清理表单，避免残影
  loginName.value = "";
  password.value = "";
};
</script>

<template>
  <div class="profileCard d-flex flex-column align-items-center justify-content-center gap-3 mt-2">
    <transition name="fadeIn" mode="out-in">
      <!-- 把两个状态作为 transition 的直接子元素并加 key，保证 out-in 正确工作 -->
      <div v-if="!userLoggedIn" key="logged-out" class="user-no-login mt-3 pb-3">
        <div class="easy-login d-flex flex-row gap-4 justify-content-center align-items-center">
          <div class="avatar">
            <BAvatar size="3rem" class="avatar" variant="secondary" />
          </div>

          <BButton @click="openBox" variant="primary">登录</BButton>

          <BModal ref="modalRef" id="easy-login-box" title="快捷登录" ok-title="登录" no-header-close cancel-title="取消"
            hide-cancel-button ok-variant="success" @ok="easyLogin" @hidden="onModalHidden">
            <BInputGroup>
              <BFormInput v-model="loginName" placeholder="用户名/邮箱" />
              <BFormInput v-model="password" placeholder="密码" type="password" />
            </BInputGroup>
          </BModal>
        </div>
      </div>

      <div v-else key="logged-in"
        class="user-login d-flex flex-column gap-4 justify-content-center align-items-center mt-3 pb-3 position-relative">
        <div class="d-flex flex-column gap-2 align-items-center">
          <!-- 如果头像加载失败或没有头像，使用默认头像 -->
          <BAvatar size="5rem" src="/ai.webp" class="avatar mb-2" variant="secondary" />
          <div class="user-name">梦璃東</div>
        </div>

        <BButtonGroup>
          <BButton variant="outline-success">一键签到</BButton>
          <BButton variant="outline-danger" @click="easyLogout">退出登录</BButton>
        </BButtonGroup>

        <div class="metrics-bar d-flex flex-row gap-5 mt-2">
          <div class="metrics-content d-flex flex-column align-items-center" v-for="metrics in metricsData"
            :key="metrics.label">
            <div class="value">{{ metrics.value }}</div>
            <div class="label">{{ metrics.label }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
@use "../Asset/CustomStyle/global.scss";
@import "../Asset/CustomStyle/open-font.scss";

.profileCard {
  @extend %reks-card-box;
  height: 380px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
}

.user-name {
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
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
