import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "./style.css";
import router from "./Router";
import { createPinia } from "pinia";
import { userStore } from "./Store/user";
import Skeleton from "@x-ui-vue3/skeleton";
// import { DefaultApolloClient } from "@vue/apollo-composable";
// import reapollo from "./Requests/reapollo";

const pinia = createPinia();
const app = createApp(App);
app.use(router).use(pinia).use(Skeleton);
const user = userStore();
await user.restoreFromLocal();
app.mount("#app");

// 导航后复位 #app 容器滚动，仅在目标路由声明需要时生效
router.afterEach((to, from) => {
	// 仅在真正的路径变化且未使用 hash 锚点时复位
	if (to.path !== from.path && !to.hash && to.meta && (to.meta as any).scrollToTop) {
		requestAnimationFrame(() => {
			const appEl = document.getElementById("app");
			if (appEl) {
				appEl.scrollTo({ top: 0, left: 0, behavior: "auto" });
			}
		});
	}
});
