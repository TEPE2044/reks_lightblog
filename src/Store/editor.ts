import type { IDomEditor } from "@wangeditor-next/editor";
import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
// import { Boot } from "@wangeditor-next/editor";
// import markdownModule from "@wangeditor-next/plugin-markdown";

export const editorStore = defineStore("editor", () => {
  // 编辑器实例
  const editor = shallowRef<IDomEditor>();
  // markdown支持
  // Boot.registerModule(markdownModule);
  //标题
  const pub_title = ref<string>("")
  // 内容
  const valueHTML = ref<string>("");
  // 标签
  const pub_tags = ref<string[]>([]);

  // 记录 editor 实例，重要！
  const handleCreated = (editorInstance: IDomEditor) => {
    editor.value = editorInstance;
  };
  // @onChange回调啥？非常简单的道理，当然是回调editor实例
  // 想想Howler播放器为什么新创建一个实例之后原来的没法控制了
  // 要继续输送这个editor到下一个位置才行，就是这个道理
  const handleChange = (editorInstance: IDomEditor) => {
    valueHTML.value = editorInstance.getHtml();
  };

  //草稿箱
  //   const draftLatest = (idle: boolean) => {
  //     if ((idle = true)) {
  //       localStorage.setItem("draft", valueHTML.value);
  //       alert("已自动存储");
  //     }
  //   };

  return {
    editor,
    valueHTML,
    pub_title,
    pub_tags,
    handleCreated,
    handleChange,
  };
});
