import axios from "axios";
import { userStore } from "../Store/user";
import router from "../Router";


const reapi = axios.create({
   baseURL: "http://localhost:12404/api/v1/",
  //baseURL: "https://v1.rekindlers.top/api/v1/",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
// 请求拦截器
reapi.interceptors.request.use(config => {
  const rcode = localStorage.getItem("rcode");
  const payload = localStorage.getItem("payload");
  if (rcode && payload) {
    config.headers["Authorization"] = `Bearer ${rcode}`;
    config.headers["X-Payload"] = payload;
  }
  return config;
})


// 响应拦截器
reapi.interceptors.response.use(
  res => res,
  async err => {
    if(err.response?.status === 401) {
      const user = userStore();
      user.userLogout();
      router.replace('/')
    }
    if(err.response?.status === 429){
      alert("请求次数已达上限！请勿重复请求")
    }
    return Promise.reject(err);
  }
)
export default reapi;