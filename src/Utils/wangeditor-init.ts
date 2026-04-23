import { Boot } from "@wangeditor-next/editor";
import { MUSIC_CARD_MENU_KEY, MusicCardMenu } from "./reks-editor-modal";

// 全局只需要执行一次（建议在 main.ts import 这个文件）
Boot.registerMenu({
  // 音乐卡片菜单注册
  key: MUSIC_CARD_MENU_KEY,
  factory() {
    return new MusicCardMenu();
  },
});

