<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { shallowRef } from "vue";
import { userStore } from "../Store/user";
const user = userStore()
const sys = shallowRef(false);
</script>
<template>
  <div v-if="user.isLoggedIn"
    class="message-bar d-flex justify-content-around align-items-center p-2 gap-2"
  >
    <BButton @click="sys = !sys" class="position-relative" variant="light">
      <Icon icon="bi:bell"/>
      <BBadge
        v-show="sys"
        dot-indicator
        variant="danger"
        class="position-absolute top-0 start-100 translate-middle"
      />
    </BButton>
    <BButton @click="sys = !sys" class="position-relative" variant="light">
      <Icon icon="bi:envelope"/>
      <BBadge
        v-show="sys"
        dot-indicator
        variant="danger"
        class="position-absolute top-0 start-100 translate-middle"
      />
    </BButton>
    <BDropdown
      variant="light"
      toggle-class="text-decoration-none"
      class="position-relative"
      no-caret
    >
      <template #button-content>
        <Icon icon="bi:person"/>
      </template>
      <BDropdownItem><Icon icon="bi:person"/>  我的空间</BDropdownItem>
      <BDropdownItem><Icon icon="bi:shop"/>  积分商城</BDropdownItem>
      <BDropdownItem><Icon icon="bi:upload"/>  投稿管理</BDropdownItem>
      <BDropdownDivider />
      <BDropdownItem><Icon icon="bi:patch-question"/>  帮助</BDropdownItem>
    </BDropdown>
  </div>
</template>

<style scoped>
</style>
