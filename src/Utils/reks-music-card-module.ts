import { DomEditor, SlateTransforms } from "@wangeditor-next/editor";
import type {
  IDomEditor,
  SlateDescendant,
  SlateElement,
} from "@wangeditor-next/editor";
// wangeditor 的 DOMElement 是全局 Element 的别名，避免深层路径导入。
type DOMElement = Element;

import type { VNode } from "snabbdom";
import { h } from "snabbdom";

import type { MusicResponse } from "./reks-interface";
import { playerStore } from "../Store/player";

export type MusicCardElement = {
  type: "musicCard";
  id: number;
  name: string;
  author: string;
  audio: string;
  cover: string;
  children: Array<{ text: "" }>;
};

export const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

export const buildMusicCardElem = (music: MusicResponse): MusicCardElement => {
  return {
    type: "musicCard",
    id: music.id,
    name: music.name || "",
    author: music.username || "",
    audio: music.audio || "",
    cover: music.cover || "",
    children: [{ text: "" }],
  };
};

// 自定义节点渲染为 DOM（snabbdom VNode）
const renderMusicCard = (
  elemNode: SlateElement,
  _children: VNode[] | null,
  editor: IDomEditor,
) => {
  const node = elemNode as MusicCardElement;
  const name = node.name || "未命名";
  const author = node.author || "未知作者";
  const selected = DomEditor.isNodeSelected(editor, elemNode);
  const store = playerStore();

  const queueItem = {
    cover: node.cover || "",
    songURL: node.audio || "",
    title: name,
    author,
  };

  const className = selected
    ? "reks-music-card reks-music-card--selected"
    : "reks-music-card";

  return h(
    "div",
    {
      props: { contentEditable: false, className },
      attrs: {
        "data-w-e-type": "musicCard",
        "data-w-e-is-void": "true",
        "data-music-card": "1",
        "data-selected": selected ? "true" : "",
        "data-id": String(node.id || 0),
        "data-name": node.name || "",
        "data-artist": node.author || "",
        "data-audio": node.audio || "",
        "data-cover": node.cover || "",
      },
      on: {
        mousedown: (event: MouseEvent) => {
          event.preventDefault();
          const path = DomEditor.findPath(editor, elemNode);
          SlateTransforms.select(editor, path);
        },
      },
    },
    [
      h("div", { props: { className: "reks-music-card__cover" } }, [
        h("img", {
          props: { src: node.cover || "", alt: name },
          attrs: { loading: "lazy" },
        }),
      ]),
      h("div", { props: { className: "reks-music-card__title" } }, name),
      h("div", { props: { className: "reks-music-card__meta" } }, author),
      h("div", { props: { className: "reks-music-card__actions" } }, [
        h(
          "button",
          {
            attrs: { type: "button", "data-action": "play" },
            on: {
              click: (event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                store.selectOutSide(queueItem);
              },
            },
          },
          "播放",
        ),
        h(
          "button",
          {
            attrs: { type: "button", "data-action": "queue" },
            on: {
              click: (event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                store.addIntoPlayQueue(queueItem, store.currentIndex);
              },
            },
          },
          "添加队列",
        ),
      ]),
    ],
  );
};

const renderMusicCardConf = {
  type: "musicCard",
  renderElem: renderMusicCard,
};

// 节点序列化为 HTML（用于导出/复制）
const musicCardToHtml = (elemNode: SlateElement) => {
  const node = elemNode as MusicCardElement;
  const name = escapeHtml(node.name || "未命名");
  const author = escapeHtml(node.author || "未知作者");
  const audio = escapeHtml(node.audio || "");
  const cover = escapeHtml(node.cover || "");

  return `
    <div class="reks-music-card"
         data-w-e-type="musicCard"
         data-w-e-is-void="true"
         data-music-card="1"
         data-id="${node.id || 0}"
         data-name="${name}"
         data-artist="${author}"
         data-audio="${audio}"
         data-cover="${cover}">
      <div class="reks-music-card__cover">
        <img src="${cover}" alt="${name}" loading="lazy" />
      </div>
      <div class="reks-music-card__title">${name}</div>
      <div class="reks-music-card__meta">${author}</div>
      <div class="reks-music-card__actions">
        <button type="button" data-action="play">播放</button>
        <button type="button" data-action="queue">添加队列</button>
      </div>
    </div>
  `;
};

const musicCardToHtmlConf = {
  type: "musicCard",
  elemToHtml: musicCardToHtml,
};

// 解析 HTML 为节点（用于粘贴/加载）
const parseMusicCardHtml = (
  elem: DOMElement,
  _children: SlateDescendant[],
  _editor: IDomEditor,
): MusicCardElement => {
  const id = Number(elem.getAttribute("data-id") || 0);
  const name = elem.getAttribute("data-name") || "";
  const author = elem.getAttribute("data-artist") || "";
  const audio = elem.getAttribute("data-audio") || "";
  const cover = elem.getAttribute("data-cover") || "";

  return {
    type: "musicCard",
    id,
    name,
    author,
    audio,
    cover,
    children: [{ text: "" }],
  };
};

const parseMusicCardHtmlConf = {
  selector: 'div[data-w-e-type="musicCard"]',
  parseElemHtml: parseMusicCardHtml,
};

const withMusicCard = (editor: IDomEditor) => {
  const { isVoid } = editor;

  editor.isVoid = (elem) => {
    if (elem.type === "musicCard") return true;
    return isVoid(elem);
  };

  return editor;
};

export default {
  renderElems: [renderMusicCardConf],
  elemsToHtml: [musicCardToHtmlConf],
  parseElemsHtml: [parseMusicCardHtmlConf],
  editorPlugin: withMusicCard,
};
