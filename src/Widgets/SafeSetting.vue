<template>
  <!-- TODO:做一个列表，点击标签后，跳转相应的模态框 -->

  <BButton @click="esp.toggle()">设置密码</BButton>
  <BButton @click="ese.toggle()">设置邮箱</BButton>

  <BModal id="easy-set-password">
    <BAlert show variant="info">
      为了保护您的账户安全，请设置一个强密码。
    </BAlert>
    <div class="set-password">
      <BInputGroup>
        <BFormInput :type="eyes" placeholder="请设置您的密码" />
        <BButton title="显示密码" @click="pswVisible = !pswVisible"
          >显示密码</BButton
        >
      </BInputGroup>
      <BInputGroup class="mt-3">
        <BFormInput
          autocomplete="new-password"
          type="password"
          placeholder="请再次输入您的密码"
        />
      </BInputGroup>
    </div>
    <template #footer>
      <div class="float-end">
        <BButton variant="success">完成</BButton>
      </div>
    </template>
  </BModal>

  <BModal id="easy-set-email">
    <BAlert show variant="warning">
      请确保这是有效、可用的邮箱，我们将使用邮箱作为手机号丢失的凭证。
    </BAlert>
    <BInputGroup>
      <BFormInput type="email" placeholder="请设置您的邮箱" />
    </BInputGroup>
    <template #footer>
      <div class="float-end">
        <BButton variant="success">保存</BButton>
      </div>
    </template>
  </BModal>
</template>

<script setup lang="ts">
import { useToggle } from "bootstrap-vue-next";
import { ref, computed } from "vue";

const esp = useToggle("easy-set-password");
const ese = useToggle("easy-set-email");

const pswVisible = ref(false);
const eyes = computed(() => (pswVisible.value ? "text" : "password"));
</script>

<style scoped>
.guidance {
  height: 400px;
}
</style>
