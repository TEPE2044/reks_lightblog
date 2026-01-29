// vite.config.js/ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { BootstrapVueNextResolver } from "bootstrap-vue-next/resolvers";

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [BootstrapVueNextResolver()],
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
