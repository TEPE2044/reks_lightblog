<script setup lang="ts">
import { ref } from 'vue';

const metricsData = ref([
  { label: '订阅', value: 0 },
  { label: '博客', value: 0 },
  { label: '积分', value: 0 },
]);

const userLoggedIn = ref(true);

const handleLogin = () => {

}

</script>


<template>
  <div class="profileCard d-flex flex-column align-items-center justify-content-center gap-3 mt-4">
    <div v-if="userLoggedIn === false" class="user-no-login  mt-3 pb-3">
      <div class="easy-login-box d-flex flex-row gap-4 justify-content-center align-items-center">
        <div class="avatar">
          <BAvatar size="3rem" class="avatar" variant="secondary" />
        </div>
        <BButton variant="primary" @click="handleLogin">
          登录
        </BButton>
      </div>
    </div>

    <!-- 用户登陆后才出现该选项 -->
    <div v-if="userLoggedIn === true"
      class="user-login d-flex flex-column gap-4 justify-content-center align-items-center mt-3 pb-3">
      <div class="avatar">
        <BAvatar size="3rem" class="avatar" variant="secondary" />
      </div>
      <BButton variant="success">一键签到</BButton>

      <div class="metrics-bar d-flex flex-row gap-5">
        <div class="metrics-content d-flex flex-column align-items-center  mt-2 mb-4" :key="metrics.label"
          v-for="metrics in metricsData">
          <div class="value">{{ metrics.value }}</div>
          <div class="label">{{ metrics.label }}</div>
        </div>
      </div>
    </div>


  </div>
</template>

<style scoped lang="scss">
//用新语法@use代替旧语法@import
@use "../Asset/CustomStyle/global.scss";

.profileCard {
  @extend %reks-card-box;
  height: 360px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
}

.avatar {
  @extend %reks-avatar;
}

.label {
  //只有 white-space: nowrap; 能保证一行显示。
  font-size: small;
  white-space: nowrap;
}
</style>