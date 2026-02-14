import { defineStore } from "pinia";
import { ref } from "vue";
import { loginOut } from "../Hooks/Auth";

export const userStore = defineStore("user", () => {
  const rcode = ref<string>("");
  const payload = ref<string>("");
  const userInfo = ref<any>(null);
  const tempAvatar = ref<File | null>(null);

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

  const userLogout = async() => {
    // 每次登出要发送接口，把redis里的那条reks_code记录给清除掉
    try{
      await loginOut()
    }catch(e){
      console.warn("已退出登录",e)
    }
  
    rcode.value = "";
    payload.value = "";
    userInfo.value = '';
    localStorage.removeItem("rcode");
    localStorage.removeItem("payload");
    localStorage.removeItem("userinfo");
    isLoggedIn.value = false;
  };

  const restoreFromLocal = async() => {
    const storedRcode = localStorage.getItem("rcode");
    const storedPayload = localStorage.getItem("payload");
    const localUser = localStorage.getItem("userInfo");
    storeUserInfo(localUser ? JSON.parse(localUser) : null);
    if (storedRcode && storedPayload) {
      rcode.value = storedRcode;
      payload.value = storedPayload;
      isLoggedIn.value = true;
    }else{
      await userLogout()
    }
  };

  return {
    rcode,
    payload,
    isLoggedIn,
    userInfo,
    tempAvatar,
    storeUserInfo,
    userLogin,
    userLogout,
    restoreFromLocal
  };
});
