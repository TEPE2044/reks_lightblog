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
    Icons({
      compiler: "vue3",
      autoInstall: true,
    }),
    Components({
      dirs: ['src/Components','src/Layouts','src/Pages','src/Widgets'],
      extensions: ['vue'],
      resolvers: [
        BootstrapVueNextResolver(),
        IconsResolver({
          enabledCollections: ['bi']
        }),
      ],
      dts: true,
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
