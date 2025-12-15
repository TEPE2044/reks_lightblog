import { defineStore } from "pinia";
import { ref } from "vue";
import router from "../Router";


export const userStore = defineStore("user", () => {
  const rcode = ref<string>("");
  const payload = ref<string>("");
  const isLoggedIn = ref(!!localStorage.getItem("token"));

  const userLogin = (tokens: { rcode: string; payload: string }) => {
    isLoggedIn.value = true;
    rcode.value = tokens.rcode;
    payload.value = tokens.payload;

    localStorage.setItem("payload", tokens.payload);
    localStorage.setItem("rcode", tokens.rcode);
  };

  const userLogout = () => {
    rcode.value = "";
    payload.value = "";
    localStorage.removeItem("rcode");
    localStorage.removeItem("payload");
    isLoggedIn.value = false;
    router.replace('/')
  };

  const restoreFromLocal = () => {
    const storedRcode = localStorage.getItem("rcode");
    const storedPayload = localStorage.getItem("payload");
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
    userLogin,
    userLogout,
    restoreFromLocal
  };
});
