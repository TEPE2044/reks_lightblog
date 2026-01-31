<script setup lang="ts">
import "@wangeditor-next/editor/dist/css/style.css";
import { storeToRefs } from "pinia";
import { onMounted, onBeforeUnmount, watchEffect } from "vue";
import { Editor, Toolbar } from "@wangeditor-next/editor-for-vue";
import type { IEditorConfig, IToolbarConfig } from "@wangeditor-next/editor";
import { Icon } from "@iconify/vue";
import { useToggle } from "bootstrap-vue-next";
import { editorStore } from "../Store/editor";
import { upload_img } from "../Hooks/Editor";
import { upload_blog } from "../Hooks/Blog";
const { editor, valueHTML, pub_tags, pub_title } = storeToRefs(editorStore());
const { handleCreated, handleChange } = editorStore();
// TODO:专业模式->开启MarkDown、新手指引、自动保存、退出前保存、挂机保存、草稿、评论
const epw = useToggle("preview");
const preview = () => {
  if (pub_title.value !== "") {
    epw.show();
  }
  console.log("标题为空");
};

const easyEditor: Partial<IToolbarConfig> = {
  toolbarKeys: [
    {
      key: "group-image",
      title: "图片工具",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="currentColor"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"/><path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71l-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z"/></g></svg>',
      menuKeys: ["insertImage", "uploadImage"],
    },
    "emotion",
    "insertVideo",
    "insertLink",
    "|",
    "bold",
    "italic",
    "underline",
    "color",
    "|",
    "numberedList",
    "divider",
    "|",
    "justifyLeft",
    "justifyCenter",
    "justifyRight",
    // {
    //   key: "group-video",
    //   title: "视频工具",
    //   iconSvg:
    //     '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2z"/></svg>',
    //   menuKeys: ["insertVideo"],
    //   // 暂不支持本地上传视频 menuKeys: ["insertVideo", "uploadVideo"],
    // },
  ],
};

const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      metaWithUrl: false,
      onSuccess: (insertFn: any, res) => {
        insertFn(res.data.url, res.data.alt || "", res.data.url);
      },
      onFailed: () => {},
      onError: () => {},
      base64LimitSize: 0,
      customUpload: async (file: any, insertFn: any) => {
        // 前端拦截图片类型
        const form = new FormData();
        form.append("img", file);

        try {
          const res = await upload_img(form);
          if (res.errno === 0) {
            // insertFn 会把图片插到编辑器
            insertFn(res.data.url, res.data.alt || "", res.data.url);
          } else {
            alert(res.message || "上传失败");
          }
        } catch (e) {
          console.error(e);
        }
      },
    },
  },
};
// 上传blog
const submitCreate = async () => {
  try {
    const res = await upload_blog(
      pub_title.value,
      valueHTML.value,
      pub_tags.value,
    );
    console.log(res);
  } catch (e) {
    console.error(e);
    // TODO:toast提示
  }
};

onMounted(() => {
  valueHTML.value = "";
});

onBeforeUnmount(() => {
  const temp = editor.value;
  if (temp == null) return;
  temp.destroy();
  //fix
  editor.value = undefined;
});
watchEffect(() => {
  console.log(valueHTML.value);
});
</script>
<template>
  <div class="editors mx-auto">
    <div class="title w-100">
      <div class="form-floating mt-3 mb-3">
        <input
          type="text"
          class="form-control"
          id="uploadTitle"
          v-model="pub_title"
          maxlength="20"
          minlength="1"
          required
        />
        <label for="uploadTitle">从标题开始吧</label>
      </div>
    </div>

    <div class="edit-space">
      <Toolbar
        class="toolbar"
        :editor="editor"
        :defaultConfig="easyEditor"
        :mode="'default'"
      />
      <Editor
        class="editor"
        v-model="valueHTML"
        :mode="'default'"
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
    </div>
    <div class="tags mt-3 mb-3">
      <BFormTags
        v-model="pub_tags"
        :limit="5"
        remove-on-delete
        add-button-text="Add"
        limit-tags-text="最多只能设置5个标签噢"
        input-id="tags-basic"
        placeholder="设置标签(使用回车确定标签)"
      />
    </div>
    <div class="options mt-4">
      <!-- 是否转载 -->
      <BPopover placement="bottom">
        <template #target>
          <BButton class="float-end" variant="success"> 发布 </BButton>
        </template>
        <template #title><strong>确认发布?</strong></template>
        <BButton
          size="sm"
          class="me-2"
          variant="success"
          @click="submitCreate()"
        >
          <Icon icon="bi-send" /> 发布
        </BButton>
        <BButton size="sm" variant="primary">
          <Icon icon="bi-box" /> 暂存
        </BButton>
      </BPopover>
      <BButton class="float-end me-2" variant="primary" @click="preview()"
        >预览</BButton
      >
    </div>
  </div>
  <!-- 预览模态框 -->
  <BModal
    scrollable
    no-close-on-backdrop
    no-backdrop
    no-footer
    size="lg"
    id="preview"
  >
    <h2 class="ptitle mb-4">{{ pub_title }}</h2>
    <span
      v-for="tag in pub_tags"
      class="ptags border rounded-2 bg-white text-black me-2 p-1"
      >{{ tag }}</span
    >
    <hr />
    <div class="content" v-html="valueHTML"></div>
    <div class="shadow-sm d-flex align-items-center justify-content-evenly p-4">
      <div class="author d-flex gap-3 align-items-center">
        <BAvatar size="50" />
        <div class="author-details">
          <div class="name fw-bolder h5">梦璃東</div>
          <div class="sign text-secondary">梦璃東有梦</div>
        </div>
      </div>
      <BButton variant="outline-secondary" size="sm">+ 关注</BButton>
    </div>
  </BModal>
</template>

<style lang="scss" scoped>
#preview {
  .ptitle {
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  }

  .ptags {
    cursor: pointer;
    font-size: small;
  }

  .content {
    overflow: hidden;
    width: fit-content;
    :deep(p) {
      width: 100%;

      img {
        width: 100%;
      }
    }
  }
}

.editors {
  width: 100%;
  min-height: 200px;
  background-color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;

  .title {
    .title-space {
      font-size: 24px;
      outline: none;

      &:focus {
        box-shadow: none;
      }
    }
  }

  .edit-space {
    width: 100px;
    > .toolbar {
      display: flex;
      flex-direction: column;
      border-bottom: 2px solid gainsboro;
    }

    > .editor {
      overflow-y: auto;
      min-height: 301px;
      max-height: 400px;
      border-top: 1px solid rgb(211, 211, 211);
      border-bottom: 2px solid gainsboro;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }

    .editor,
    .toolbar {
      width: 600px;
    }
  }

  .tags {
    width: 600px;
  }
}
</style>
