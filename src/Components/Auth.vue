<script setup lang="ts">
import { useToast, useToggle } from "bootstrap-vue-next";
import { phoneRegex } from "../Utils/reks-login-regex";
import type { PhoneData, AccountData } from "../Utils/reks-interface";
import { createToast } from "../Utils/reks-toast";
import { reactive, ref, shallowRef, watchEffect } from "vue";
import Vcode from "vue3-puzzle-vcode";
import { useCountdown } from "@vueuse/core";
import { userStore } from "../Store/user";
import { substore } from "../Store/subscribe";
import { makeSubscribeMessage } from "../Utils/subscribe-log";
import { puzzleStore } from "../Store/puzzle";
const props = withDefaults(defineProps<{ showTrigger?: boolean }>(), {
  showTrigger: true,
});

const user = userStore();
const { addSubscribeMessage } = substore();
const emd = useToggle("easy-login-box");
// 账号登录数据
const toast = useToast();

// 验证码锁
const codeActive = ref(false);

// 滑动模块
const {isShow} = storeToRefs(puzzleStore())
const {openPuzzle,onCancel,onSuccess} = puzzleStore()

const cancelLogin = () => {
  onCancel()
  codeActive.value = false
}


/*
login-methods
- phoneLogin 手机号登录（验证码登录）
*/
const phoneData = reactive<PhoneData>({
  phone: "",
  code: "",
  iaccept: false,
});

// trigger 重置表单
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
  },
});

const loading = ref(false);

// trigger 触发发送短信
const sendCode = async () => {
  // 检查是否同意用户协议
  if (!phoneData.iaccept) {
    createToast(toast, "登录失败", "请同意用户协议和隐私政策", "warning");
    return;
  }
  // 检查手机号格式
  else if (!phoneData.phone || phoneData.phone.length !== 11) {
    createToast(toast, "发送失败", "请输入正确的手机号码", "warning");
    return;
  } else if (!phoneRegex(phoneData.phone)) {
    createToast(toast, "发送失败", "手机号码格式不正确", "warning");
    return;
  }

  try {
    codeActive.value = true;
    openPuzzle(async () => {
      try {
        start();
        loading.value = true;
        const getcode_res = await getCode(phoneData.phone, codeActive.value);
        loading.value = false;
        if (getcode_res) {
          createToast(
            toast,
            "验证码已发送",
            `验证码已发送至${phoneData.phone}`,
            "success",
          );
        } else {
          stop();
          codeActive.value = false;
          createToast(
            toast,
            "发送失败",
            "网络或服务错误，请稍后重试",
            "danger",
          );
        }
      } catch (e) {
        console.log("验证码发送失败，重置计时器");
        codeActive.value = false;
        stop();
        createToast(toast, "发送失败", "网络或服务错误，请稍后重试", "danger");
        console.error("发送验证码失败:", e);
      }
    });
  } catch (e) {
    stop();
    console.error("发送验证码失败:", e);
    codeActive.value = false;
  }
};

// trigger 手机号登录
import { useDebounceFn } from "@vueuse/core";
import {
  getCode,
  getUserProfile,
  loginbyAccount,
  loginbyPhone,
} from "../Hooks/Auth";
import { storeToRefs } from "pinia";

const submitPhoneData = useDebounceFn(async () => {
  if (phoneData.iaccept === false) {
    createToast(toast, "登录失败", "请同意用户协议和隐私政策", "warning");
    return;
  } else if (!phoneData.phone || phoneData.phone.length !== 11) {
    createToast(toast, "发送失败", "请输入正确的手机号码", "warning");
    return;
  } else if (!phoneRegex(phoneData.phone)) {
    createToast(toast, "发送失败", "手机号码格式不正确", "warning");
    return;
  }
  try {
    loading.value = true;
    const login_res = await loginbyPhone(phoneData);
    console.log("登录成功:", login_res);
    if (login_res.tokens) {
      // 存储token
      loading.value = false;
      user.userLogin(login_res.tokens);
      createToast(toast, "登录成功", "欢迎回来", "success");
      const user_info = await getUserProfile();
      user.storeUserInfo(user_info.data);
      addSubscribeMessage(
        makeSubscribeMessage(
          "user.login",
          `账号 ${user_info?.data?.username || "未知用户"} 登录成功`,
        ),
        user_info?.data?.reks_id ?? "guest",
      );
      console.log("用户信息:", user_info);
      emd.hide();
      reset();

      if(login_res?.sign === 'new'){
        createToast(toast,"安全提醒","当前账号安全等级低，请前往个人中心设置邮箱、密码","warning")
      }
    } else {
      createToast(toast, "登录失败", login_res.msg, "danger");
    }
  } catch (e) {
    loading.value = false;
    console.error("登录失败:", e);
    createToast(toast, "登录失败",(e as any)?.response.data.detail, "danger");
  }finally{
    loading.value = false;
  }
}, 1300);

/*
login-methods
- accountLogin 账号登录
*/
const accountData = reactive<AccountData>({
  account: "",
  password: "",
});

// 更优雅的写法2026/12/13（🐧跳舞）
const sumbitAccountData = useDebounceFn(() => {
  // 账号登录功能
  const check = [
    {
      valid: !!accountData.account && accountData.account.length === 11,
      msg: "请输入正确的账号",
    },
    { valid: phoneRegex(accountData.account), msg: "账号格式不正确" },
    {
      valid:
        accountData.password &&
        accountData.password.length >= 6 &&
        accountData.password.length <= 20,
      msg: "请输入正确的密码",
    },
  ];
  for (const item of check) {
    if (!item.valid) {
      createToast(toast, "登录失败", item.msg, "warning");
      return;
    }
  }

  try {
    // 密码加密 -> 密码不加密了
    // const hashed_password = hashPsw(accountData.password);
    openPuzzle(async () => {
      try {
        loading.value = true;
        const login_res = await loginbyAccount(accountData);
        // console.log("账号登录成功:", login_res);
        if (login_res.tokens) {
          // 存储token
          loading.value = false;
          user.userLogin(login_res.tokens);
          createToast(toast, "登录成功", "欢迎回来", "success");
          const user_info = await getUserProfile();
          user.storeUserInfo(user_info.data);
          addSubscribeMessage(
            makeSubscribeMessage(
              "user.login",
              `账号 ${user_info?.data?.username || "未知用户"} 登录成功`,
            ),
            user_info?.data?.reks_id ?? "guest",
          );
          console.log("用户信息:", user_info);
          emd.hide();
          reset();
        }
      } catch (e) {
        loading.value = false;
        console.error("账号登录失败:", e);
        createToast(toast, "登录失败", "网络或服务错误，请稍后重试", "danger");
      }
    });
  } catch (e) {
    loading.value = false;
    console.error("账号登录失败:", e);
    createToast(toast, "登录失败", "账号不存在或账号信息错误", "danger");
  }
}, 1000);

watchEffect(() => {
  console.log("accept", phoneData.iaccept);
  console.log("account", accountData.account.length);
});
</script>

<template>
  <div class="auth">
    <BButton v-if="props.showTrigger" @click="emd.show()" variant="primary"
      >登录</BButton
    >

    <BModal
      id="easy-login-box"
      title="登录"
      ok-title="登录"
      footer
      centered
      no-header-close
    >
      <div
        class="lgo d-flex align-items-center justify-content-center gap-2 my-3"
      >
        <img
          src="/reks.svg"
          class="img-thumbnail top_pic mb-3"
          alt="reks_label.png"
        />
        <figure class="figure">
          <figcaption>ReKindle Everything</figcaption>
        </figure>
      </div>

      <div class="box box-show w-75 mx-auto" v-if="isShow">
        <Vcode :show="isShow" type="inside" @success="onSuccess()" />
        <BButton
          class="d-flex justify-content-center align-items-center mt-4"
          @click="cancelLogin()"
          >取消登录</BButton
        >
      </div>
      <BTabs content-class="mt-3" align="center" lazy pills>
        <BTab title="账号登录">
          <div class="form w-75 mx-auto">
            <BForm class="mx-auto" validated>
              <BFormFloatingLabel
                class="mt-4 mb-3"
                label="账号"
                label-for="user-account"
              >
                <BFormInput
                  :disabled="loading"
                  autocomplete="current-account"
                  type="tel"
                  id="user-account"
                  placeholder="请输入账号(手机号)"
                  is-valid
                  required
                  v-model="accountData.account"
                />
                <div class="invalid-feedback">请输入账号(手机号)</div>
              </BFormFloatingLabel>

              <BFormFloatingLabel
                class="mb-2"
                label="密码"
                label-for="user-password"
              >
                <BFormInput
                  :disabled="loading"
                  autocomplete="current-password"
                  type="password"
                  id="user-password"
                  placeholder="请输入密码"
                  v-model="accountData.password"
                  is-valid
                  required
                />
                <div class="invalid-feedback">请输入密码</div>
              </BFormFloatingLabel>

              <BButton
                class="w-100 mt-2"
                variant="primary"
                @click="sumbitAccountData"
                :disabled="loading === true"
                >登录</BButton
              >

              <div
                class="freshman mt-3 d-flex align-items-center justify-content-center"
              >
                我没有账号
                <BPopover
                  target=".freshman"
                  placement="bottom"
                  triggers="hover focus"
                >
                  首次使用，请使用短信登录注册账号
                </BPopover>
              </div>
            </BForm>
          </div>
        </BTab>

        <BTab title="短信登录" ref="message">
          <div class="form w-75 mx-auto">
            <BForm class="mx-auto" validated>
              <BFormFloatingLabel
                class="mt-4 mb-2"
                label="手机号"
                label-for="user-phone"
              >
                <BFormInput
                  type="tel"
                  id="user-phone"
                  placeholder="请输入手机号"
                  v-model="phoneData.phone"
                  is-valid
                  required
                />
                <div class="invalid-feedback">请输入手机号</div>
              </BFormFloatingLabel>

              <BInputGroup class="mb-2">
                <BFormFloatingLabel label="验证码" label-for="user-code">
                  <BFormInput
                    type="text"
                    id="user-code"
                    placeholder="请输入验证码"
                    v-model="phoneData.code"
                    :disabled="phoneData.phone.length === 0"
                    required
                  />
                </BFormFloatingLabel>

                <BButton
                  v-if="!codeActive"
                  text="button"
                  :disabled="phoneData.phone.length === 0"
                  variant="primary"
                  @click="sendCode"
                  >获取验证码
                </BButton>
                <BButton v-else text="button" :disabled="true" variant="primary"
                  >{{ remaining }}s</BButton
                >
              </BInputGroup>
            </BForm>
            <BFormCheckbox
              v-model="phoneData.iaccept"
              name="checkbox-1"
              class="mt-4 mb-2"
              :state="phoneData.iaccept"
            >
              我已阅读并同意<BLink class="prt" href="#">用户协议</BLink>和<BLink
                class="prt"
                href="#"
                >隐私政策</BLink
              >
            </BFormCheckbox>

            <BButton
              :disabled="loading === true"
              class="w-100 mt-4 mb-3"
              variant="primary"
              @click="submitPhoneData"
              >登录</BButton
            >
          </div>
        </BTab>
      </BTabs>

      <template #footer>
        <div class="d-flex w-100 justify-content-between text-primary">
          <BLink to="/help" @click="emd.hide()">遇到问题?</BLink>
        </div>
      </template>
    </BModal>
  </div>
</template>

<style lang="scss" scoped>
// :deep(.prt){
//   color: black !important;

// }
.prt {
  color: rgb(209, 173, 251);
}

:deep(.nav-link) {
  color: black;
}

:deep(.nav-pills) {
  gap: 2rem;
}

:deep(.vue-puzzle-vcode) {
  display: flex;
  justify-content: center;
  align-items: center;
}

.wechat-login {
  cursor: pointer;
}
// inset: 0;
// /* 等价于 */
// top: 0; right: 0; bottom: 0; left: 0;
.box-show {
  padding: 1.8rem;
  position: absolute;
  inset: 0;
  background: #fff;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.giveup {
  margin-top: 1rem;
  transform: translateY(12px);
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
