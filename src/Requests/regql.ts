import axios from "axios";
import { userStore } from "../Store/user";
import router from "../Router";

const regql = axios.create({
    baseURL: "http://localhost:12404/api/v1/gql",
    timeout: 15000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

regql.interceptors.request.use(config => {
  const rcode = localStorage.getItem("rcode");
  const payload = localStorage.getItem("payload");
  if (rcode && payload) {
    config.headers["Authorization"] = `Bearer ${rcode}`;
    config.headers["X-Payload"] = payload;
  }
  return config;
})

regql.interceptors.response.use(
    res => {
        // ✅ GraphQL 错误在 res.data.errors 中，HTTP 状态码仍是 200
        if (res.data?.errors?.length > 0) {
            const firstError = res.data.errors[0];
            
            // 检查是否是 401 错误（根据你的后端返回）
            if (firstError.message === "401" || 
                firstError.message.includes("UNAUTHORIZED") ||
                firstError.extensions?.code === "401") {
                
                const user = userStore();
                user.userLogout();
                localStorage.removeItem("rcode");
                localStorage.removeItem("payload");
                alert("身份验证失败，请重新登录");
                
                // 可以选择跳转到登录页
                router.replace('/')
                
                return Promise.reject(new Error("401 Unauthorized"));
            }
        }
        return res;
    },
    err => {
        // ✅ HTTP 层面的错误（如网络断开、CORS、真正的 HTTP 401）
        if (err.response?.status === 401) {
            const user = userStore();
            user.userLogout();
            localStorage.removeItem("rcode");
            localStorage.removeItem("payload");
            router.replace('/')
        }
        return Promise.reject(err);
    }
)

export default regql;