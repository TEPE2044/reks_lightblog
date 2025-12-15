import axios from "axios";
import { userStore } from "../Store/user";

const reapi = axios.create({
  baseURL: "http://localhost:12404/api/v1/",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
// 响应拦截器
reapi.interceptors.response.use(
  res => res,
  err => {
    if(err.response.status === 401) {
      const user = userStore();
      user.userLogout();
      alert("身份验证失败，请重新登录");
    }
    return Promise.reject(err);
  }
)

const setAxiosHeader = async (payload: string, rcode: string) => {
  reapi.defaults.headers.common["Authorization"] = `Bearer ${rcode}`;
  reapi.defaults.headers.common["X-Payload"] = payload;
}

export { setAxiosHeader };
export default reapi;