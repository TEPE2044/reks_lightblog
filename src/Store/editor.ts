import type { IDomEditor } from "@wangeditor-next/editor";
import { defineStore } from "pinia";
import { ref, shallowRef, computed } from "vue";
import { Boot } from '@wangeditor-next/editor'
import markdownModule from '@wangeditor-next/plugin-markdown'
export const editorStore = defineStore("editor", () => {
  // 编辑器实例
  const editor = shallowRef<IDomEditor | undefined>();
  Boot.registerModule(markdownModule);
  // 标题
  const pub_title = ref<string>("");
  // 内容
  const valueHTML = ref<string>("");
  // 标签
  const pub_tags = ref<string[]>([]);

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

  return {
    editor,
    valueHTML,
    pub_title,
    pub_tags,
    coverImages, 
    handleCreated,
    handleChange,
  };
});
