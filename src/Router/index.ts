import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../Pages/Home.vue"),
      alias: "/home",
    },
    {
      path: "/hub",
      name: "hub",
      component: () => import("../Pages/Hub.vue"),
    },
  ],
});

export default router;
