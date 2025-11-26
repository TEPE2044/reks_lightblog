<script setup lang="ts">
const alerts = () => {
  //TODO: 跳转登录页面
  alert("Sign In clicked");
};
</script>


<template>
  <div class="signIn" @click="alerts">
    <BAvatar size="3rem" class="avatar" variant="light" />
  </div>
</template>

<style scoped lang="scss">
.signIn {
  display: flex;
  cursor: pointer;
  .avatar{
    user-select: none;
    border: 0.3px solid rgba(128, 128, 128, 0.21);
    padding: 0.2rem;
  }
}

</style>