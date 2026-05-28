import { Boot } from "@wangeditor-next/editor";
import markdownModule from "@wangeditor-next/plugin-markdown";
import { MUSIC_CARD_MENU_KEY, MusicCardMenu } from "./reks-editor-modal";
import musicCardModule from "./reks-music-card-module";

// 全局只需要执行一次（建议在 main.ts import 这个文件）
// Markdown 快捷语法（# 标题、``` 代码块、列表等），须在创建编辑器之前注册且只注册一次
Boot.registerModule(markdownModule);
// 注册音乐卡片
Boot.registerModule(musicCardModule);

Boot.registerMenu({
  // 音乐卡片菜单注册
  key: MUSIC_CARD_MENU_KEY,
  factory() {
    return new MusicCardMenu();
  },
});

