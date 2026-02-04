// vite.config.js/ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";
import { BootstrapVueNextResolver } from "bootstrap-vue-next/resolvers";
import IconsResolver from "unplugin-icons/resolver";
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        BootstrapVueNextResolver(),
        IconsResolver(),
      ],
      dts: true,
    }),
    Icons({
      compiler: "vue3",
      autoInstall: true,
    }),
  ],
  server: {
    port: 5173,
    host: "0.0.0.0",
    cors: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          editor: ["@wangeditor-next/editor"],
          bv: ["bootstrap-vue-next"],
        },
      },
    },
  },
});
