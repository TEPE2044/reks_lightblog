<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useToggle } from "bootstrap-vue-next";
import { ref, computed } from "vue";


const esc = useToggle("easy-set-code");
const esp = useToggle("easy-set-password");
const ese = useToggle("easy-set-email");

const pswVisible = ref(false);
const eyes = computed(() => (pswVisible.value ? "text" : "password"));

const getRecoverCode = () => {
  console.log("oops！");
};
// TODO:设置密码逻辑，直接向该人类发送验证码，校验，是->进入密码修改，不是（错误次数大于5）->滚，强制下线（根据风险评估封禁该账号）
// TODO:设置邮箱逻辑，用户输入邮箱后发往服务器，锁定表单，检验该邮箱是否有效，成功，生成一次性token，存入状态到redis中
// TODO:使用jinjitemplate载入HTML邮件（待设计）
</script>
<template>
  <div class="safe-settings p-3">
    <div class="safe-title h5 ps-2">
      账号安全 <BButton size="sm" pill variant="dark">?</BButton>
    </div>

    <BRow class="safe-options p-4" cols="4" align-h="center" gutter-y="5">
      <BCol
        class="safe-box d-flex align-items-center justify-content-center gap-3 offset"
      >
        <Icon icon="bi:key" width="30" height="30" />
        <BButton variant="outline-primary" @click="esp.toggle()"
          >设置密码</BButton
        >
      </BCol>
      <BCol
        class="safe-box d-flex align-items-center justify-content-center gap-3 offset-1"
        ><Icon icon="bi:envelope" width="30" height="30" />
        <BButton variant="outline-success" @click="ese.toggle()">
          设置邮箱</BButton
        >
      </BCol>

      <BCol
        class="safe-box d-flex align-items-center justify-content-center gap-3 offset-1"
        ><Icon icon="bi:telephone" width="30" height="30" />
        <BButton variant="outline-primary">更换手机号</BButton>
      </BCol>
    </BRow>

    <div class="safe-title h5 ps-2">其他</div>
    <BRow class="safe-options p-4" cols="4" align-h="center" gutter-y="5">
      <BCol
        class="safe-box d-flex align-items-center justify-content-center gap-4"
        ><Icon icon="bi:person-gear" width="30" height="30" />
        <BButton variant="outline-secondary">访问控制</BButton>
      </BCol>
      <BCol
        class="safe-box d-flex align-items-center justify-content-center gap-4 offset-1"
      >
        <Icon icon="bi:journal-text" width="30" height="30" />
        <BButton variant="outline-primary">用户日志</BButton>
      </BCol>
      <BCol
        class="safe-box d-flex align-items-center justify-content-center gap-4 offset-1"
        ><Icon icon="bi:person-dash" width="30" height="30" />
        <BButton variant="outline-danger">注销账号</BButton>
      </BCol>
    </BRow>
  </div>

  <BModal id="easy-set-code" title="申请恢复码" no-footer>
    <BButton pill variant="primary" @click="getRecoverCode()"
      >开启恢复码验证</BButton
    >
    <BAlert show variant="primary">
      该恢复码只会申请后出现一次，请妥善保存！
    </BAlert>
    <BButton pill variant="primary" @click="getRecoverCode()"
      >申请恢复码</BButton
    >
    <div class="result text-center mt-3 mb-3">
      <code>juqiskfal</code>
    </div>
  </BModal>

  <BModal id="easy-set-password" title="设置密码">
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
        <BButton variant="success">确定</BButton>
      </div>
    </template>
  </BModal>

  <BModal id="easy-set-email" title="设置邮箱">
    <BAlert show variant="warning">
      我们将向该邮箱发送验证码，以确保这是您。
    </BAlert>
    <BInputGroup>
      <BFormInput type="email" placeholder="请设置您的邮箱" />
    </BInputGroup>
    <template #footer>
      <div class="float-end">
        <BButton variant="success">确定</BButton>
      </div>
    </template>
  </BModal>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";
.safe-title {
  @extend %reks-title;
}
.safe-box {
  @extend %reks-card-box;
  height: 120px;
  border: 1px solid rgba(0, 0, 0, 0.274);
}
</style>
