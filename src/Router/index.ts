import { createRouter, createWebHashHistory } from "vue-router";
import { userStore } from "../Store/user";
import { storeToRefs } from "pinia";
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
          path:'my-music',
          name:"my-music",
          component:() => import("../Widgets/MyMusic.vue")
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
  console.log(from.path)
  const { rcode, payload, isLoggedIn } = storeToRefs(userStore());
  const isAuthenticated = rcode.value && payload.value && isLoggedIn.value;
  
  // 未登录 & 当前不在首页 → 强制回到首页
  if (!isAuthenticated && to.path !== "/") {
    next("/");   // ✅ 只有从其他页面跳过来时才重定向
    return;
  }

  next();  // 其他情况正常放行（包括已在首页的情况）
});
export default router;
