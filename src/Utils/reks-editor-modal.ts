import type {
  IDomEditor,
  IModalMenu,
  SlateNode,
} from "@wangeditor-next/editor";
import { createApp, defineComponent, h, ref } from "vue";
import type { Ref } from "vue";
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
  private editorRef?: Ref<IDomEditor | null>;

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
    // 第一次创建，后续复用（避免重复创建 DOM、重复绑定事件）
    if (!this.container) {
      const menu = this;
      this.container = document.createElement("div");
      this.container.className = "reks-music-modal";
      this.editorRef = ref<IDomEditor | null>(editor);
      const queryRef = ref("");
      const statusRef = ref("请输入关键字后回车或点“搜索”。");
      const loadingRef = ref(false);
      const selectedRef = ref<MusicResponse | null>(null);
      const listRef = ref<MusicResponse[]>([]);
      const lastQueryRef = ref("");
      const pageRef = ref(1);
      const pageSize = 4;
      const totalRef = ref<number | null>(null);

      const doSearch = async (targetPage = 1) => {
        const q = queryRef.value.trim();
        if (!q) {
          statusRef.value = "请输入搜索关键字。";
          listRef.value = [];
          selectedRef.value = null;
          totalRef.value = null;
          return;
        }
        if (
          q === lastQueryRef.value &&
          listRef.value.length &&
          targetPage === pageRef.value
        ) {
          return;
        }

        lastQueryRef.value = q;
        statusRef.value = "搜索中...";
        loadingRef.value = true;
        try {
          const res = await searchMusic(targetPage, pageSize, q);
          const rows = (res?.data ?? []) as MusicResponse[];
          totalRef.value = typeof res?.total === "number" ? res.total : null;
          pageRef.value = targetPage;
          statusRef.value = `共 ${res?.total ?? rows.length} 条，当前展示 ${rows.length} 条。`;
          listRef.value = rows;
          selectedRef.value = null;
        } catch (e) {
          console.error(e);
          statusRef.value = "搜索失败，请稍后重试。";
          listRef.value = [];
          selectedRef.value = null;
          totalRef.value = null;
        } finally {
          loadingRef.value = false;
        }
      };

      const MusicModal = defineComponent({
        name: "MusicModal",
        setup() {
          const listContainerStyle = {
            maxHeight: "240px",
          };

          return () =>
            h(
              "div",
              {
                class: "d-flex flex-column gap-2 p-2",
                style: { minHeight: "300px" },
              },
              [
                h("div", { class: "fw-semibold" }, "搜索并插入音乐卡片"),
                h("div", { class: "d-flex align-items-start gap-2" }, [
                  h("input", {
                    class: "form-control form-control-sm p-2",
                    type: "search",
                    placeholder: "输入关键字，回车搜索",
                    value: queryRef.value,
                    disabled: loadingRef.value,
                    onInput: (event: Event) => {
                      queryRef.value = (event.target as HTMLInputElement).value;
                    },
                    onKeydown: (event: KeyboardEvent) => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      pageRef.value = 1;
                      void doSearch(1);
                    },
                  }),
                  
                  h("div", { class: "d-flex flex-column gap-2" }, [
                    h(
                      "button",
                      {
                        class: "btn btn-sm btn-outline-secondary",
                        type: "button",
                        disabled: loadingRef.value,
                        onClick: () => {
                          pageRef.value = 1;
                          void doSearch(1);
                        },
                      },
                      "搜索",
                    ),
                    h(
                      "button",
                      {
                        class: "btn btn-sm btn-primary",
                        type: "button",
                        disabled: !selectedRef.value,
                        onClick: () => {
                          const selected = selectedRef.value;
                          const currentEditor = menu.editorRef?.value;
                          if (!selected || !currentEditor) return;
                          currentEditor.insertText(`[music:${selected.id}]`);
                        },
                      },
                      "插入",
                    ),
                  ]),
                ]),
                h("div", { class: "small text-secondary" }, statusRef.value),
                                h("div", { class: "border-0 d-flex flex-row gap-2 p-0" }, [
                  h(
                    "button",
                    {
                      class: "btn btn-sm btn-outline-secondary",
                      type: "button",
                      disabled:
                        loadingRef.value ||
                        listRef.value.length <= 0 ||
                        pageRef.value <= 1,
                      onClick: () => void doSearch(pageRef.value - 1),
                    },
                    "<",
                  ),
                  h(
                    "button",
                    {
                      class: "btn btn-sm btn-outline-secondary",
                      type: "button",
                      disabled:
                        loadingRef.value ||
                        listRef.value.length <= 0 ||
                        (totalRef.value !== null
                          ? pageRef.value * pageSize >= totalRef.value
                          : listRef.value.length < pageSize),
                      onClick: () => void doSearch(pageRef.value + 1),
                    },
                    ">",
                  ),
                ]),
                h(
                  "div",
                  {
                    class: "d-flex flex-column gap-2 overflow-auto pe-1",
                    style: listContainerStyle,
                  },
                  listRef.value.length
                    ? listRef.value.map((music) =>
                        h(
                          "div",
                          {
                            key: music.id,
                            class: [
                              "border rounded p-2 lh-sm",
                              {
                                "border-primary bg-primary-subtle":
                                  selectedRef.value?.id === music.id,
                              },
                            ],
                            style: { cursor: "pointer" },
                            onClick: () => {
                              selectedRef.value = music;
                            },
                          },
                          [
                            h(
                              "div",
                              { class: "fw-semibold small" },
                              music.name || `音乐 #${music.id}`,
                            ),
                            h(
                              "div",
                              {
                                class:
                                  "mt-1 small text-secondary d-flex justify-content-between gap-2",
                              },
                              [
                                h(
                                  "span",
                                  null,
                                  music.username
                                    ? `作者：${music.username}`
                                    : "作者：-",
                                ),
                                h(
                                  "span",
                                  null,
                                  music.original ? "原创" : "搬运/翻唱",
                                ),
                              ],
                            ),
                          ],
                        ),
                      )
                    : [
                        h(
                          "div",
                          { class: "small text-secondary" },
                          lastQueryRef.value
                            ? "没有搜到结果，换个关键字试试。"
                            : "输入关键字后回车或点击搜索。",
                        ),
                      ],
                )
              ],
            );
        },
      });

      createApp(MusicModal).mount(this.container);
    }

    if (this.editorRef) {
      this.editorRef.value = editor;
    }

    return this.container as any;
  }
}
