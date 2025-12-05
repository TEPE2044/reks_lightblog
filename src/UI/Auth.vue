<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useToast, useToggle } from "bootstrap-vue-next";
import { createToast } from "../Utils/reks-toast";
import { reactive, ref } from "vue";
import Vcode from "vue3-puzzle-vcode";
import { accountValidation,phoneValidation } from "../Utils/reks-login-regex";
// modal打开逻辑 easy-modal
// const {show, hide} = useToggle(id)
const emd = useToggle("easy-login-box");
const toast = useToast();

// puzzle打开逻辑
const isShow = ref(false);

const reset = () => {
  formData.account = "";
  formData.password = "";
  phoneData.phone = "";
  phoneData.code = "";
};

const onShow = () => {
  isShow.value = true;
  emd.hide();
};

const onClose = () => {
  reset();
  isShow.value = false;
};

const onSuccess = () => {
  createToast(toast, "登录成功", "欢迎回来", "danger");
  onClose();
};

// 区分原生的FormData API和我们自己的数据结构
interface FormData {
  account: string;
  password: string;
}

interface PhoneData {
  phone: string;
  code: string ;
}
const formData = reactive<FormData>({
  account: "",
  password: "",
});

const phoneData = reactive<PhoneData>({
  phone: "",
  code: "",
});


const loginbyAccount = () =>{

  const accountError = accountValidation(formData.account, formData.password) ? "" : "请输入有效的账号和密码";

  if (accountError) {
    createToast(toast, "登录失败", accountError, "warning");
    return;
  }
  onShow();
  createToast(toast, "登录成功", "欢迎回来", "success");
  reset();
  emd.hide();
}

const loginbyPhone = () => {
  const phoneError = phoneValidation(phoneData.phone) ? "" : "请输入有效的手机号";
  if (phoneError) {
    createToast(toast, "登录失败", phoneError, "warning");
    return;
  }
  onShow();
  createToast(toast, "登录成功", "欢迎回来", "success");
  reset();
  emd.hide();
}
</script>

<template>
  <div class="auth">
    <BButton @click="emd.show()" variant="primary">登录</BButton>

    <BModal id="easy-login-box" title="登录" ok-title="登录" no-header-close centered>
      <div
        class="lgo d-flex align-items-center justify-content-center gap-2 mb-4"
      >
        <img
          src="/reks.svg"
          class="img-thumbnail top_pic mb-3"
          alt="reks_label.png"
        />
        <figure class="figure">
          <figcaption>Rekindle Everything</figcaption>
        </figure>
      </div>
      <BTabs content-class="mt-3" align="center" lazy pills>
        <BTab title="短信登录">
          <div class="form w-75 mx-auto">
            <BForm class="mx-auto">
              <BFormFloatingLabel
                class="mt-4 mb-3"
                label="手机号"
                label-for="user-phone"
              >
                <BFormInput
                  type="email"
                  id="user-phone"
                  placeholder="请输入手机号"
                  v-model="phoneData.phone"
                  required
                />
              </BFormFloatingLabel>

              <BInputGroup class="mb-2">
                <BFormFloatingLabel label="验证码" label-for="user-code">
                  <BFormInput
                    type="text"
                    id="user-code"
                    placeholder="请输入验证码"
                    v-model="phoneData.code"
                    required
                  />
                </BFormFloatingLabel>

                <BButton
                  :disabled="phoneData.phone.length < 11"
                  text="button"
                  variant="primary"
                  >获取验证码</BButton
                >
              </BInputGroup>

              <BButton class="w-100 mt-5" variant="primary" @click="loginbyPhone"
                >登录</BButton
              >
            </BForm>
          </div>
        </BTab>

        <BTab title="账号登录">
          <div class="form w-75 mx-auto">
            <BForm class="mx-auto">
              <BFormFloatingLabel
                class="mt-4 mb-3"
                label="账号"
                label-for="user-account"
              >
                <BFormInput
                  type="email"
                  id="user-account"
                  placeholder="请输入账号"
                  v-model="formData.account"
                />
              </BFormFloatingLabel>

              <BFormFloatingLabel
                class="mb-2"
                label="密码"
                label-for="user-password"
              >
                <BFormInput
                  type="password"
                  id="user-password"
                  placeholder="请输入密码"
                  v-model="formData.password"
                />
              </BFormFloatingLabel>

              <BButton class="w-100 mt-5" variant="primary" @click="loginbyAccount"
                >登录</BButton
              >

              <div
                class="mt-5 freshman d-flex align-items-center justify-content-center"
              >
                我没有账号
                // TODO 加popover提示
              </div>
            </BForm>
          </div>
        </BTab>
      </BTabs>

      <template #footer>
        <BButton
          variant="success"
          class="wechat-login"
          @click="createToast(toast, '敬请期待', '暂未开通', 'info')"
        >
          <Icon color="white" icon="bi:wechat" /> 微信登录
        </BButton>
      </template>
      <Vcode :show="isShow" @success="onSuccess" @close="onClose" />
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
