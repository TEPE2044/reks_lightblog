<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { shallowRef } from "vue";
import { userStore } from "../Store/user";
import { useToggle } from "bootstrap-vue-next";
const user = userStore();
const sys = shallowRef(false);
const emd = useToggle("easy-login-box");
</script>
<template>
  <div
    class="message-bar rounded d-flex justify-content-around align-items-center p-2 gap-2"
  >
    <BButton @click="sys = !sys" class="position-relative" variant="light">
      <Icon icon="bi:bell" />
      <BBadge
        v-show="sys"
        dot-indicator
        variant="danger"
        class="position-absolute top-0 start-100 translate-middle"
      />
    </BButton>
    <BButton @click="sys = !sys" class="position-relative" variant="light">
      <Icon icon="bi:envelope" />
      <BBadge
        v-show="sys"
        dot-indicator
        variant="danger"
        class="position-absolute top-0 start-100 translate-middle"
      />
    </BButton>

    <BButton @click="emd.show()" class="position-relative" variant="light" v-if="!user.isLoggedIn">
      <Icon icon="bi:person-circle" />
    </BButton>

    <BDropdown
      v-else
      auto-close="inside"
      offset="15"
      variant="light"
      toggle-class="text-decoration-none"
      class="position-relative "
      no-caret
    >
      <template #button-content>
        <Icon icon="bi:person-circle" />
      </template>
      <div class="rs-dropdown-card">
        <div
          class="avatar mt-2 d-flex flex justify-content-center align-items-center"
        >
          <BAvatar size="lg"/>
        </div>
        <div class="info d-flex flex justify-content-center align-items-center">
          <p class="name mt-3 mb-1">梦璃東</p>
        </div>
      </div>
      <BDropdownDivider />
      <BDropdownItem class="text-center" to="/space">我的空间</BDropdownItem>
      <BDropdownItem class="text-center" to="/store">积分商城</BDropdownItem>
      <BDropdownItem class="text-center" to="/upload">投稿管理</BDropdownItem>
      <BDropdownDivider />
      <BDropdownItem class="text-center" @click="user.userLogout">退出登录</BDropdownItem>
    </BDropdown>
  </div>
</template>

<style scoped></style>
