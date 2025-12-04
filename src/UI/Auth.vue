<script setup lang="ts">
import { useToggle } from "bootstrap-vue-next";
import { ref } from "vue";
import Vcode from "vue3-puzzle-vcode";
// modal打开逻辑 easy-modal 
// const {show, hide} = useToggle(id)
const emd = useToggle('easy-login-box')

// puzzle打开逻辑
const isShow = ref(false);

const onShow = () => {
  isShow.value = true;
};

const onClose = () => {
  alert("验证关闭");
  isShow.value = false;
};

const onSuccess = () => {
  alert("登录成功")
  onClose(); 
};
</script>

<template>
  <div class="auth">
    <BButton @click="emd.show()" variant="primary">登录</BButton>

    <BModal
      id="easy-login-box"
      title="登录"
      ok-title="登录"
      no-header-close
      cancel-title="取消"
      hide-cancel-button
      ok-variant="success"
      @ok="onShow"
      @hidden="emd.hide()"
    >
      <div class="form">
        
      </div>

      
      <Vcode :show="isShow" @success="onSuccess" @close="onClose" />
    </BModal>
  </div>
</template>

<style scoped></style>
