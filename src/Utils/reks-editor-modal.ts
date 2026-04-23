import type {
  IDomEditor,
  IModalMenu,
  SlateNode,
} from "@wangeditor-next/editor";
import { searchMusic } from "../Hooks/Search";
import type { MusicResponse } from "./reks-interface";

export const MUSIC_CARD_MENU_KEY = "musicCard";

export class MusicCardMenu implements IModalMenu {
  title: string;
  iconSvg: string;
  tag: string;
  showModal: boolean;
  modalWidth: number;

  private container?: HTMLDivElement;
  private input?: HTMLInputElement;
  private list?: HTMLDivElement;
  private status?: HTMLDivElement;
  private selected?: MusicResponse | null;
  private currentEditor?: IDomEditor;
  private lastQuery = "";

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
    this.currentEditor = editor;

    // 第一次创建，后续复用（避免重复创建 DOM、重复绑定事件）
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = "reks-music-modal";

      // 用 styleTag 管理样式，别把 style 写满一屏
      const style = document.createElement("style");
      style.textContent = `
        .reks-music-modal{display:flex;flex-direction:column;gap:10px;min-height:300px;padding:4px 2px;}
        .reks-music-modal__title{font-weight:600;}
        .reks-music-modal__row{display:flex;gap:8px;align-items:center;}
        .reks-music-modal__input{flex:1;padding:6px 10px;border:1px solid #ccc;border-radius:6px;font-size:14px;outline:none;}
        .reks-music-modal__btn{padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#fff;}
        .reks-music-modal__btn:disabled{opacity:.5;cursor:not-allowed;}
        .reks-music-modal__status{font-size:12px;color:#666;min-height:18px;}
        .reks-music-modal__list{display:flex;flex-direction:column;gap:6px;max-height:240px;overflow:auto;padding-right:4px;}
        .reks-music-modal__item{border:1px solid #eee;border-radius:8px;padding:8px;cursor:pointer;line-height:1.2;}
        .reks-music-modal__item:hover{background:#fafafa;}
        .reks-music-modal__item.is-active{border-color:#8ab4ff;background:#f3f8ff;}
        .reks-music-modal__name{font-weight:600;font-size:13px;}
        .reks-music-modal__meta{margin-top:4px;font-size:12px;color:#666;display:flex;justify-content:space-between;gap:8px;}
        .reks-music-modal__btng{display:flex;flex-direction:column;gap:20px;}
      `.trim();
      this.container.appendChild(style);

      const title = document.createElement("div");
      title.className = "reks-music-modal__title";
      title.textContent = "搜索并插入音乐卡片";
      this.container.appendChild(title);

      const row = document.createElement("div");
      row.className = "reks-music-modal__row";
        
      this.input = document.createElement("input");
      this.input.className = "reks-music-modal__input";
      this.input.type = "search";
      this.input.placeholder = "输入关键字，回车搜索";
      row.appendChild(this.input);

      const btnGroup = document.createElement("div")
      btnGroup.className = "reks-music-modal__btng"
      row.appendChild(btnGroup)

      const searchBtn = document.createElement("button");
      searchBtn.className = "reks-music-modal__btn";
      searchBtn.type = "button";
      searchBtn.textContent = "搜索";
      btnGroup.appendChild(searchBtn);

      const insertBtn = document.createElement("button");
      insertBtn.className = "reks-music-modal__btn";
      insertBtn.type = "button";
      insertBtn.textContent = "插入";
      insertBtn.disabled = true;
      btnGroup.appendChild(insertBtn);

      this.container.appendChild(row);

      this.status = document.createElement("div");
      this.status.className = "reks-music-modal__status";
      this.status.textContent = "请输入关键字后回车或点“搜索”。";
      this.container.appendChild(this.status);

      this.list = document.createElement("div");
      this.list.className = "reks-music-modal__list";
      this.container.appendChild(this.list);

      const setLoading = (loading: boolean) => {
        searchBtn.disabled = loading;
        this.input!.disabled = loading;
      };

      const setSelected = (m: MusicResponse | null) => {
        this.selected = m;
        insertBtn.disabled = !m;
        // 更新 active 样式
        const children = Array.from(this.list!.children) as HTMLDivElement[];
        children.forEach((el) => {
          const id = Number(el.dataset["id"]);
          el.classList.toggle("is-active", Boolean(m && id === m.id));
        });
      };

      const renderList = (rows: MusicResponse[]) => {
        this.list!.innerHTML = "";
        setSelected(null);
        if (!rows.length) {
          const empty = document.createElement("div");
          empty.className = "reks-music-modal__status";
          empty.textContent = "没有搜到结果，换个关键字试试。";
          this.list!.appendChild(empty);
          return;
        }

        const frag = document.createDocumentFragment();
        rows.forEach((m) => {
          const item = document.createElement("div");
          item.className = "reks-music-modal__item";
          item.dataset["id"] = String(m.id);

          const name = document.createElement("div");
          name.className = "reks-music-modal__name";
          name.textContent = m.name || `音乐 #${m.id}`;
          item.appendChild(name);

          const meta = document.createElement("div");
          meta.className = "reks-music-modal__meta";

          const author = document.createElement("span");
          author.textContent = m.username ? `作者：${m.username}` : "作者：-";
          meta.appendChild(author);

          const tag = document.createElement("span");
          tag.textContent = m.original ? "原创" : "搬运/翻唱";
          meta.appendChild(tag);

          item.appendChild(meta);

          item.addEventListener("click", () => setSelected(m));
          frag.appendChild(item);
        });
        this.list!.appendChild(frag);
      };

      const doSearch = async () => {
        const q = (this.input!.value || "").trim();
        if (!q) {
          this.status!.textContent = "请输入搜索关键字。";
          renderList([]);
          return;
        }
        if (q === this.lastQuery && this.list!.children.length) return;

        this.lastQuery = q;
        this.status!.textContent = "搜索中...";
        setLoading(true);
        try {
          const res = await searchMusic(1, 6, q);
          const rows = (res?.data ?? []) as MusicResponse[];
          this.status!.textContent = `共 ${res?.total ?? rows.length} 条，当前展示 ${rows.length} 条。`;
          renderList(rows);
        } catch (e) {
          console.error(e);
          this.status!.textContent = "搜索失败，请稍后重试。";
          renderList([]);
        } finally {
          setLoading(false);
        }
      };

      this.input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          void doSearch();
        }
      });
      searchBtn.addEventListener("click", () => void doSearch());

      insertBtn.addEventListener("click", () => {
        if (!this.selected) return;
        const ed = this.currentEditor;
        if (!ed) return;
        ed.insertText(`[music:${this.selected.id}]`);
      });
    }

    return this.container as any;
  }
}
