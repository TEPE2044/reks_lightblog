<script setup lang="ts">
import { useToast, useToggle } from "bootstrap-vue-next";
import { phoneRegex } from "../Utils/reks-login-regex";
import type { PhoneData } from "../Utils/reks-interface";
import { createToast } from "../Utils/reks-toast";
import { reactive, ref, shallowRef } from "vue";
import Vcode from "vue3-puzzle-vcode";
import reapi from "../Requests/reapi";
import { useCountdown } from "@vueuse/core";
import { userStore } from "../Store/user";

// modal打开逻辑 easy-modal
// const {show, hide} = useToggle(id)
const user = userStore();
const emd = useToggle("easy-login-box");
// 账号登录数据
const toast = useToast();
// 验证码锁
const codeActive = ref(false);
// puzzle打开逻辑
const isShow = ref(false);

const reset = () => {
  // accountData.account = "";
  // accountData.password = "";
  phoneData.phone = "";
  phoneData.code = "";
  phoneData.iaccept = false;
};

// 计时器
const countdownSeconds = shallowRef(60);
const { remaining, start, stop } = useCountdown(countdownSeconds, {
  onComplete() {
    codeActive.value = false;
  }
});

const phoneData = reactive<PhoneData>({
  phone: "",
  code: "",
  iaccept: false,
});

// 获取短信验证码
const getCode = async () => {
  try {
    const code_res = await reapi({
      method: "POST",
      url: "/auth/send-sms-code",
      data: {
        phone: phoneData.phone,
        codeActive: codeActive.value,
      },
    });
    return code_res;
  } catch (e) {
    console.error("获取验证码失败:", e);
    createToast(toast, "发送失败", "网络或服务错误，请稍后重试", "danger");
  }
};

// 触发发送短信
const sendCode = async () => {
  try {
    // 检查是否同意用户协议
    if (!phoneData.iaccept) {
      createToast(toast, "登录失败", "请同意用户协议和隐私政策", "warning");
      return;
    }
    // 检查手机号格式
    if (!phoneData.phone || phoneData.phone.length !== 11) {
      createToast(toast, "发送失败", "请输入正确的手机号码", "warning");
      return;
    }
    if (!phoneRegex(phoneData.phone)) {
      createToast(toast, "发送失败", "手机号码格式不正确", "warning");
      return;
    }

    codeActive.value = true;
    start();
    // OnlyTest
    const { code } = await getCode();
    sessionStorage.setItem("sms_code", code);
    createToast(
      toast,
      "验证码已发送",
      `验证码已发送至${phoneData.phone}`,
      "success"
    );
  } catch (e) {
    stop();
    console.error("发送验证码失败:", e);
    codeActive.value = false;
  }
};

const loginbyPhone = async () => {
  const res = await reapi({
    method: "POST",
    url: "/auth/login-by-phone",
    data: {
      phone: phoneData.phone,
      code: phoneData.code,
      iaccept: phoneData.iaccept,
    },
  });
  return res
}

// 控制puzzle显示与隐藏
const onShow = () => {
  isShow.value = true;
  emd.hide();
};
// puzzle成功回调
const onSuccess = () => {
  isShow.value = false;
};
// 关闭puzzle并且清空表单
const onClose = () => {
  isShow.value = false;
  alert(user.isLoggedIn);
  if (user.isLoggedIn === false) {
    emd.show();
  }
};

const submitPhoneData = async () => {
  if (phoneData.iaccept === false) {
    createToast(toast, "登录失败", "请同意用户协议和隐私政策", "warning");
    return;
  }
  if (codeActive.value === false) {
    createToast(toast, "登录失败", "请先获取验证码", "warning");
    return;
  }
  if (!phoneData.phone || phoneData.phone.length !== 11) {
    createToast(toast, "发送失败", "请输入正确的手机号码", "warning");
    return;
  }
  if (!phoneRegex(phoneData.phone)) {
    createToast(toast, "发送失败", "手机号码格式不正确", "warning");
    return;
  }
  try {
    onShow();
    const { msg } = await loginbyPhone();
    createToast(toast, "登录成功", msg, "success");
    reset();
    user.userLogin();
  } catch (e) {
    console.error("登录失败:", e);
    createToast(toast, "登录失败", "网络或服务错误，请稍后重试", "danger");
  }
};
</script>

<template>
  <div class="auth">
    <BButton @click="emd.show()" variant="primary">登录</BButton>

    <BModal id="easy-login-box" title="登录" ok-title="登录" no-header-close footer centered>
      <div class="lgo d-flex align-items-center justify-content-center gap-2 my-3">
        <img src="/reks.svg" class="img-thumbnail top_pic mb-3" alt="reks_label.png" />
        <figure class="figure">
          <figcaption>Rekindle Everything</figcaption>
        </figure>
      </div>
      <BTabs content-class="mt-3" align="center" lazy pills>
        <BTab title="短信登录">
          <div class="form w-75 mx-auto">
            <BForm class="mx-auto" validated>
              <BFormFloatingLabel class="mt-4 mb-2" label="手机号" label-for="user-phone">
                <BFormInput type="tel" id="user-phone" placeholder="请输入手机号" v-model="phoneData.phone" is-valid
                  required />
                <div class="invalid-feedback">请输入手机号</div>
              </BFormFloatingLabel>

              <BInputGroup class="mb-2">
                <BFormFloatingLabel label="验证码" label-for="user-code">
                  <BFormInput type="text" id="user-code" placeholder="请输入验证码" v-model="phoneData.code"
                    :disabled="phoneData.phone.length === 0" required />
                </BFormFloatingLabel>

                <BButton v-if="!codeActive" text="button" :disabled="phoneData.phone.length === 0" variant="primary"
                  @click="sendCode">获取验证码</BButton>
                <BButton v-else text="button" :disabled="true" variant="primary">{{ remaining }}s</BButton>
              </BInputGroup>

              <BFormCheckbox v-model="phoneData.iaccept" name="checkbox-1" class="mt-4 mb-2">
                我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私政策</a>
              </BFormCheckbox>

              <BButton :disabled="phoneData.code.length === 0" class="w-100 mt-4 mb-3" variant="primary"
                @click="submitPhoneData">登录</BButton>
            </BForm>
          </div>
        </BTab>

        <BTab title="账号登录">
          <div class="form w-75 mx-auto">
            <BForm class="mx-auto">
              <BFormFloatingLabel class="mt-4 mb-3" label="账号" label-for="user-account">
                <BFormInput type="email" id="user-account" placeholder="请输入账号" v-model="accountData.account" />
              </BFormFloatingLabel>

              <BFormFloatingLabel class="mb-2" label="密码" label-for="user-password">
                <BFormInput type="password" id="user-password" placeholder="请输入密码" v-model="accountData.password" />
              </BFormFloatingLabel>

              <BButton class="w-100 mt-5" variant="primary" @click="loginbyAccount">登录</BButton>

              <div class="freshman mt-3 d-flex align-items-center justify-content-center">
                我没有账号
                <BPopover target=".freshman" placement="bottom" triggers="hover focus">
                  首次使用，请使用短信登录注册账号
                </BPopover>
              </div>
            </BForm>
          </div>
        </BTab>
      </BTabs>

      <Vcode :show="isShow" @success="onSuccess" @close="onClose" />
      <template #footer>
        <div class="d-flex w-100 justify-content-between text-primary">
          <BLink to="/forgot">忘记密码</BLink>
          <BLink to="/help">遇到问题</BLink>
        </div>
      </template>
    </BModal>
  </div>
</template>

<style lang="scss" scoped>
:deep(.nav-link) {
  color: black;
}

:deep(.nav-pills) {
  gap: 2rem;
}

.wechat-login {
  cursor: pointer;
}

.top_pic {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 100px;
}

.freshman {
  cursor: pointer;
  color: grey;
  text-decoration: underline;
}
</style>
