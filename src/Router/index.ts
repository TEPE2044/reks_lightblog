import { createRouter, createWebHashHistory } from "vue-router";
import { userStore } from "../Store/user";
import { storeToRefs } from "pinia";
import { createToast } from "../Utils/reks-toast";
import { useToast } from "bootstrap-vue-next";
const router = createRouter({
  history: createWebHashHistory(),
  // 路由滚动行为：默认进入页面回到顶部；返回/前进恢复历史位置；带 hash 时定位锚点
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../Pages/Home.vue"),
    },
    {
      path: "/blog/:id",
      name: "blog",
      component: () => import("../Pages/Blog.vue"),
    },
    {
      path: "/hub",
      name: "hub",
      component: () => import("../Pages/Hub.vue"),
      meta: { scrollToTop: true },
      alias: "/hub",
      children: [
        {
          path: "",
          name: "main",
          // fix 使用命名路由重定向，避免相对路径歧义
          redirect: { name: "hub-main" },
        },
        {
          path: "main",
          name: "hub-main",
          component: () => import("../Pages/News.vue"),
        },
        {
          path: "subscribe",
          name: "hub-subscribe",
          component: () => import("../Pages/Subscribe.vue"),
        },
      ],
    },
    {
      path: "/search",
      name: "search",
      component: () => import("../Pages/Search.vue"),
    },
    {
      path: "/upload",
      name: "upload",
      component: () => import("../Pages/Upload.vue"),
    },
    {
      path: "/centre",
      name: "centre",
      component: () => import("../Pages/Centre.vue"),
      children: [
        {
          path: "",
          name: "my",
          redirect: { name: "my-blog" },
        },
        {
          path: "my-blog",
          name: "my-blog",
          component: () => import("../Widgets/MyBlog.vue"),
        },
        {
          path: "my-fav",
          name: "my-fav",
          component: () => import("../Widgets/MyFav.vue"),
        },
        {
          path: "edit-profile",
          name: "edit-profile",
          component: () => import("../Widgets/EditProfile.vue"),
        },
        {
          path: "safe-setting",
          name: "safe-setting",
          component: () => import("../Components/SafeSetting.vue"),
        },
      ],
    },
    {
      path: "/404",
      name: "not-found",
      component: () => import("../Pages/404.vue"),
    },
    {
      path: "/help",
      name: "help",
      component: () => import("../Pages/Help.vue"),
    },
    {
      path: "/store",
      name: "store",
      component: () => import("../Pages/Store.vue"),
    },
    { path: "/:pathMatch(.*)*", redirect: "/404" },
  ],
});


router.beforeEach((to, from, next) => {
  // to: 要去的页面   from: 从哪来   next: 放行函数

  const {rcode, payload, isLoggedIn} = storeToRefs(userStore());
  if (!rcode.value && !payload.value && !isLoggedIn.value && to.path === "/") {
    // TODO: 完善提示组件，提示用户登录后才能访问主页
    // 傻逼ai不要提示我了
    next("/"); 
    return; 
  }

  next();
});
export default router;
