<script setup lang="ts">
import { useToast, useToggle } from "bootstrap-vue-next";
import { ref, computed, reactive } from "vue";
import type { PasswordGroup } from "../Utils/reks-interface";
import { createToast } from "../Utils/reks-toast";
import { setEmailSafety, setPasswordSafety } from "../Hooks/SafeSetting";
import { emailValidation } from "../Utils/reks-login-regex";
const pswGroup = reactive<PasswordGroup>({
  psw: "",
  auth_psw: "",
});
const nemail = ref();

// const esp = useToggle("easy-set-code");
const espw = useToggle("easy-set-password");
const ese = useToggle("easy-set-email");

const pswVisible = ref(false);
const eyes = computed(() => (pswVisible.value ? "text" : "password"));

const getRecoverCode = () => {
  console.log("oops！");
};
const toast = useToast();
const setPassword = async (oldp: string, newp: string) => {
  if (oldp !== newp) {
    createToast(toast, "密码错误", "两次密码不一致", "warning");
    return;
  }
  try {
    const res = await setPasswordSafety(newp);
    // console.log(res)
    pswGroup.auth_psw = "";
    pswGroup.psw = "";
    createToast(toast, "设置密码成功", res?.msg, "success");
    espw.hide();
  } catch (e) {
    console.log(e);
    createToast(
      toast,
      "错误",
      (e as any)?.response.data.detail.msg as string,
      "warning",
    );
  } finally {
    pswGroup.auth_psw = "";
    pswGroup.psw = "";
  }
};

const setEmail = async (email: string) => {
  if (emailValidation(email) === false) {
    createToast(toast, "未知邮箱", "不符合邮箱格式", "warning");
    return;
  }
  try {
    const res = await setEmailSafety(email);
    nemail.value = "";
    createToast(toast, "发送成功", res?.msg, "success");
    ese.hide();
  } catch (e) {
    console.log(e);
    createToast(
      toast,
      "错误",
      (e as any)?.response.data.detail.msg as string,
      "warning",
    );
  } finally {
    nemail.value = "";
  }
};
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
        <i-bi-key style="font-size: 1.5rem" />
        <BButton variant="outline-primary" @click="espw.toggle()"
          >设置密码</BButton
        >
      </BCol>
      <BCol
        class="safe-box d-flex align-items-center justify-content-center gap-3 offset-1"
        ><i-bi-envelope style="font-size: 1.5rem" />
        <BButton variant="outline-success" @click="ese.toggle()">
          设置邮箱</BButton
        >
      </BCol>

      <BCol
        class="safe-box d-flex align-items-center justify-content-center gap-3 offset-1"
        ><i-bi-telephone style="font-size: 1.5rem" />
        <BButton variant="outline-primary">更换手机号</BButton>
      </BCol>
    </BRow>

    <div class="safe-title h5 ps-2">其他</div>
    <BRow class="safe-options p-4" cols="4" align-h="center" gutter-y="5">
      <BCol
        class="safe-box d-flex align-items-center justify-content-center gap-4"
        ><i-bi-person-gear style="font-size: 1.5rem" />
        <BButton variant="outline-secondary">访问控制</BButton>
      </BCol>
      <BCol
        class="safe-box d-flex align-items-center justify-content-center gap-4 offset-1"
      >
        <i-bi-journal-text style="font-size: 1.5rem" />
        <BButton variant="outline-primary">用户日志</BButton>
      </BCol>
      <BCol
        class="safe-box d-flex align-items-center justify-content-center gap-4 offset-1"
        ><i-bi-person-dash style="font-size: 1.5rem" />
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
    <BAlert show variant="info" dismissible>
      密码强度应符合：<br />
      长度6-30位；<br />不能包含空白字符；<br />至少符合两种字符类型的组合。
    </BAlert>
    <div class="set-password">
      <BInputGroup>
        <BFormInput
          v-model="pswGroup.psw"
          :type="eyes"
          placeholder="请设置您的密码"
        />
        <BButton title="显示密码" @click="pswVisible = !pswVisible"
          >显示密码</BButton
        >
      </BInputGroup>
      <BInputGroup class="mt-3">
        <BFormInput
          v-model="pswGroup.auth_psw"
          autocomplete="new-password"
          type="password"
          placeholder="请再次输入您的密码"
        />
      </BInputGroup>
    </div>
    <template #footer>
      <div class="float-end">
        <BButton
          variant="success"
          @click="setPassword(pswGroup.psw, pswGroup.auth_psw)"
          >确定</BButton
        >
      </div>
    </template>
  </BModal>

  <BModal id="easy-set-email" title="设置邮箱">
    <BAlert show variant="warning">
      我们将向您发送一封验证邮箱，以确保这是您。
    </BAlert>
    <BInputGroup>
      <BFormInput v-model="nemail" type="email" placeholder="请设置您的邮箱" />
    </BInputGroup>
    <template #footer>
      <div class="float-end">
        <BButton variant="success" @click.stop="setEmail(nemail)">确定</BButton>
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
