import { createRouter, createWebHashHistory } from "vue-router";
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
      path: "/help",
      name: "help",
      component: () => import("../Pages/Help.vue"),
    },
  ],
});

export default router;
