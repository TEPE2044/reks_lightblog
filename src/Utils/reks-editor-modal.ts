import type {
  IDomEditor,
  IModalMenu,
  SlateNode,
} from "@wangeditor-next/editor";
import { searchMusic } from "../Hooks/Search";

export const MUSIC_CARD_MENU_KEY = "musicCard";

export const _searchMusic = async (content: string) => {
  const { data } = await searchMusic(1, 6, content);
  return data;
};

export class MusicCardMenu implements IModalMenu {
  title: string;
  iconSvg: string;
  tag: string;
  showModal: boolean;
  modalWidth: number;

  constructor() {
    this.title = "音乐卡片";
    // this.iconSvg = '<svg >...</svg>'
    this.iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="currentColor"><path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2s2.5.895 2.5 2"/><path fill-rule="evenodd" d="M12 3v10h-1V3z"/><path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1z"/><path fill-rule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5"/></g></svg>`;
    this.tag = "button";
    this.showModal = true;
    this.modalWidth = 300;
  }

  // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
  isActive(_editor: IDomEditor): boolean {
    return false;
  }

  // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue(_editor: IDomEditor): string | boolean {
    return "";
  }

  // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
  isDisabled(_editor: IDomEditor): boolean {
    return false;
  }

  // 点击菜单时触发的函数
  exec(_editor: IDomEditor, value: string | boolean) {
    console.log(value);
  }

  // 弹出框 modal 的定位：1. 返回某一个 SlateNode； 2. 返回 null （根据当前选区自动定位）
  getModalPositionNode(_editor: IDomEditor): SlateNode | null {
    return null;
  }

  // 定义 modal 内部的 DOM Element
  getModalContentElem(editor: IDomEditor) {
    // 创建整体容器
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "8px";
    container.style.minHeight = "300px";

    // 创建容器内标题
    const title = document.createElement("div");
    title.textContent = "插入音乐卡片";
    title.style.fontWeight = "600";
    container.appendChild(title);

    // 创建容器内输入框
    const input = document.createElement("input");
    input.placeholder = "搜索歌曲";
    input.value = "";
    input.style.width = "100%";
    input.type = "search";
    input.style.padding = "6px 10px";
    input.style.boxSizing = "border-box";
    input.style.borderRadius = "6px";
    input.style.border = "1px solid #ccc";
    input.style.outline = "none";
    input.style.fontSize = "14px";
    input.style.transition = "all 0.3s ease";
    input.style.cursor = "pointer";
    input.addEventListener("blur", () => {
      alert("blur");
    });
    input.addEventListener("keydown", async (e) => {
      const data = await _searchMusic(input.value);
      if (data) {
        for(let d in data){
            const dc = document.createElement('div')
            dc.style.height = '100px'
            dc.textContent = d
        } 
      }
    });
    container.appendChild(input);

    // 创建容器内按钮
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "插入";
    btn.style.padding = "6px 10px";
    // btn.addEventListener("click", () => {
    //   const id = (input.value || "").trim();
    //   if (!id) return;
    //   editor.insertText(`[music:${id}]`);
    // });
    container.appendChild(btn);

    return container as any;
  }
}
