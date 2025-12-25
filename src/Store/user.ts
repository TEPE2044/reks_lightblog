import { defineStore } from "pinia";
import { ref } from "vue";
import router from "../Router";


export const userStore = defineStore("user", () => {
  const rcode = ref<string>("");
  const payload = ref<string>("");
  const userInfo = ref<any>(null);

  const isLoggedIn = ref(!!localStorage.getItem("token"));

  const storeUserInfo = (info: any) => {
    userInfo.value = info;
    localStorage.setItem("userInfo", JSON.stringify(info));
  }


  const userLogin = (tokens: { rcode: string; payload: string }) => {
    isLoggedIn.value = true;
    rcode.value = tokens.rcode;
    payload.value = tokens.payload;

    localStorage.setItem("payload", tokens.payload);
    localStorage.setItem("rcode", tokens.rcode);
  };

  const userLogout = () => {
    // TODO:虽然不是在这里，但是每次登出要发送接口，把redis里的那条reks_code记录给清除掉
    rcode.value = "";
    payload.value = "";
    userInfo.value = '';
    localStorage.removeItem("rcode");
    localStorage.removeItem("payload");
    localStorage.removeItem("userinfo");
    isLoggedIn.value = false;
    router.replace('/')
  };

  const restoreFromLocal = () => {
    const storedRcode = localStorage.getItem("rcode");
    const storedPayload = localStorage.getItem("payload");
    const localUser = localStorage.getItem("userInfo");
    storeUserInfo(localUser ? JSON.parse(localUser) : null);
    if (storedRcode && storedPayload) {
      rcode.value = storedRcode;
      payload.value = storedPayload;
      isLoggedIn.value = true;
    }
  };

  return {
    rcode,
    payload,
    isLoggedIn,
    userInfo,
    storeUserInfo,
    userLogin,
    userLogout,
    restoreFromLocal
  };
});
