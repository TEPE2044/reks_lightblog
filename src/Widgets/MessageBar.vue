<script setup lang="ts">

import { shallowRef } from "vue";
import { userStore } from "../Store/user";
import { useToggle } from "bootstrap-vue-next";
import router from "../Router";
const user = userStore();
const sys = shallowRef(false);
const emd = useToggle("easy-login-box");
const pageToUpload = () => {
  router.push('/upload')
}
const pageToRtalk = () => {
  router.push('/rtalk')
  sys.value = !sys.value
}
</script>
<template>
  <div class="message-bar rounded d-flex justify-content-around align-items-center p-2 gap-2">
    <BButton @click="pageToRtalk()" class="position-relative" variant="light" v-if="user.isLoggedIn">
      <i-bi-bell />

      <BBadge v-show="sys" dot-indicator variant="danger" class="position-absolute top-0 start-100 translate-middle" />
    </BButton>
    <BButton @click="emd.show()" class="position-relative" variant="light" v-if="!user.isLoggedIn">
      <i-bi-person-circle />
    </BButton>

    <BDropdown v-else auto-close="inside" offset="15" variant="light" toggle-class="text-decoration-none"
      class="position-relative " no-caret>
      <template #button-content>
        <i-bi-person-circle />
      </template>
      <div class="rs-dropdown-card">
        <div class="avatar mt-2 d-flex flex justify-content-center align-items-center">
          <BAvatar :src="user.userInfo.avatar || ''" size="lg" />
        </div>
        <div class="info d-flex flex justify-content-center align-items-center">
          <p class="name mt-3 mb-1">梦璃東</p>
        </div>
      </div>
      <BDropdownDivider />
      <BDropdownItem class="text-center" to="/centre">我的空间</BDropdownItem>
      <!-- <BDropdownItem class="text-center" to="/store">积分商城</BDropdownItem> -->
      <!-- <BDropdownItem class="text-center" to="/upload">我要投稿</BDropdownItem> -->
      <BDropdownDivider />
      <BDropdownItem class="text-center" @click="user.userLogout">退出登录</BDropdownItem>
    </BDropdown>

    <BButton title="博客" class="position-relative" variant="light" @click="pageToUpload()" v-if="user.isLoggedIn">
      <i-bi-upload /> &nbsp;发布博客
    </BButton>
  </div>
</template>

<style scoped></style>
