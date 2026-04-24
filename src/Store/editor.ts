import type { IDomEditor } from "@wangeditor-next/editor";
import { defineStore } from "pinia";
import { ref, shallowRef, computed } from "vue";


export const editorStore = defineStore("editor", () => {
  // 编辑器实例
  const editor = shallowRef<IDomEditor | undefined>();
  // 标题
  const pub_title = ref<string>("");
  // 内容
  const valueHTML = ref<string>("");
  // 标签
  const pub_tags = ref<string[]>([]);
  // 音乐id
  const music_id = ref<number>(0);

  // ========== 新增：封面图计算属性 ==========
  const coverImages = computed(() => {
    const matches = valueHTML.value?.match(/<img[^>]+src="([^"]+)"/g) || [];
    return matches
      .slice(0, 3)
      .map((match) => match.match(/src="([^"]+)"/)?.[1])
      .filter(Boolean) as string[];
  });

  // 记录 editor 实例
  const handleCreated = (editorInstance: IDomEditor) => {
    editor.value = editorInstance;
  };

  const handleChange = (editorInstance: IDomEditor) => {
    valueHTML.value = editorInstance.getHtml();
  };

  const resetEditorState = () => {
    pub_title.value = "";
    valueHTML.value = "";
    pub_tags.value = [];
    music_id.value = 0;
  };

  return {
    editor,
    valueHTML,
    pub_title,
    pub_tags,
    coverImages, 
    music_id,
    handleCreated,
    handleChange,
    resetEditorState,
  };
});
