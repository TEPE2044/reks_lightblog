<script setup lang="ts">
import "@wangeditor-next/editor/dist/css/style.css";
import { storeToRefs } from "pinia";
import { onMounted, onBeforeUnmount} from "vue";
import { Editor, Toolbar } from "@wangeditor-next/editor-for-vue";
import type { IEditorConfig, IToolbarConfig } from "@wangeditor-next/editor";
import { useToast, useToggle } from "bootstrap-vue-next";
import { editorStore } from "../Store/editor";
import { upload_img } from "../Hooks/Editor";
import { upload_blog } from "../Hooks/Blog";
import { createToast } from "../Utils/reks-toast";
import router from "../Router";
import { userStore } from "../Store/user";

const postType = defineModel({ default: "blog" });
const toast = useToast();
const { userInfo } = storeToRefs(userStore());

// 状态管理
const { editor, valueHTML, pub_tags, pub_title, coverImages } = storeToRefs(editorStore());
const { handleCreated, handleChange } = editorStore();

// modal
const { show: showPreview } = useToggle("preview");

// editor
const toolbarConfig: Partial<IToolbarConfig> = {
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
    "musicCard",
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
  ],
};

const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      metaWithUrl: false,
      // 成功/失败回调（如果使用服务端上传时启用）
      onSuccess: (insertFn: any, res) => {
        insertFn(res.data.url, res.data.alt || "", res.data.url);
        router.push("/");
        createToast(toast, "图片上传成功", "标题为空", "success");
      },
      onFailed: () => {
        createToast(toast, "图片上传失败", "占位信息", "danger");
      },
      onError: () => {
        createToast(toast, "图片上传失败", "占位信息", "danger");
      },
      base64LimitSize: 0,
      // 自定义上传
      customUpload: async (file: File, insertFn: any) => {
        const form = new FormData();
        form.append("img", file);

        try {
          const res = await upload_img(form);
          if (res.errno === 0) {
            insertFn(res.data.url, res.data.alt || "", res.data.url);
            createToast(toast, "上传成功", "图片上传成功", "success");
          } else {

            alert(res.message || "上传失败");
          }
        } catch (error) {
          console.error("图片上传失败:", error);
          createToast(toast, "上传失败", "图片上传失败", "danger");
        }
      },
    },
  },
};

// ==================== 方法 ====================
/** 打开预览 */
const handlePreview = () => {
  if (!pub_title.value.trim()) {
    createToast(toast, "预览失败", "标题为空", "warning");
    return;
  }
  showPreview();
};

/** 提交发布 */
// TODO:兼容两种形式的上传，一种是音频上传，一种是博客上传，handleSubmit使用传参的形式
const handleSubmit = async () => {
  // 表单验证
  if (!pub_title.value.trim()) {
    alert("请输入标题");
    return;
  }
  if (!valueHTML.value || valueHTML.value === "<p><br></p>") {
    alert("请输入内容");
    return;
  }

  try {
    const res = await upload_blog(
      pub_title.value,
      valueHTML.value,
      coverImages.value,
      pub_tags.value
    );
    console.log("发布成功:", res);
    createToast(toast, "发布成功", "发布成功！期待上热门哦", "success");
    // TODO：这里发完就要控制一下用户行为，不能让他一直点
    // TODO: 发布成功后跳转到文章详情页或清空表单
  } catch (error) {
    console.error("发布失败:", error);
    alert("发布失败，请重试");
  }
};

// ==================== 生命周期 ====================
onMounted(() => {
  valueHTML.value = "";
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
    editor.value = undefined as any;
  }
});
</script>

<template>
  <div class="editor-container mx-auto">
    <!-- 音频上传 -->
    <section class="audio-section" v-if="postType == 'audio'">
      <MusicForm />
    </section>

    <!-- 博客 -->
    <section class="editor-section" v-if="postType !== 'audio'">
      <!-- 标题输入 -->
      <div class="form-floating mb-2">
        <input id="uploadTitle" v-model="pub_title" type="text" class="form-control" minlength="1" maxlength="20"
          required placeholder="有何感想？" />
        <label for="uploadTitle">从标题开始</label>
      </div>
      <Toolbar class="editor-toolbar" :editor="editor" :default-config="toolbarConfig" mode="default" />
      <Editor v-model="valueHTML" class="editor-content" :default-config="editorConfig" mode="default"
        @on-created="handleCreated" @on-change="handleChange"/>
    </section>

    <section class="tags-section" v-if="postType !== 'audio'">
      <p class="section-title">上传标签</p>
      <BFormTags v-model="pub_tags" input-id="tags-basic" :limit="5" duplicate-tag-text="重复标签" remove-on-delete
        add-button-text="Add" limit-tags-text="最多只能设置5个标签噢" placeholder="设置标签(使用回车确定标签)" />
    </section>

    <!-- <section class="audio-secetion mt-2" v-if="postType == 'mblog'">
      <RadioSelector />
    </section> -->

    <!-- 规定确认 -->
    <!-- <section class="agreement-section">
      <div class="form-check">
        <input
          id="gridCheck1"
          class="form-check-input"
          type="checkbox"
          required
        />
        <label class="form-check-label" for="gridCheck1">
          我已阅读
          <router-link to="/rule">相关规定</router-link>
        </label>
      </div>
    </section> -->

    <!-- 操作按钮 -->
    <section class="actions-section" v-if="postType !== 'audio'">
      <BPopover placement="bottom">
        <template #target>
          <BButton variant="success" class="float-end">发布</BButton>
        </template>
        <template #title>
          <strong>确认发布?</strong>
        </template>
        <BButton size="sm" variant="success" class="me-2" @click="handleSubmit">
          <i-bi-send /> 发布
        </BButton>
        <BButton size="sm" variant="primary"> <i-bi-box /> 暂存 </BButton>
      </BPopover>
      <BButton variant="primary" class="float-end me-2" @click="handlePreview">
        预览
      </BButton>
    </section>
  </div>

  <!-- 预览模态框 -->
  <BModal id="preview" size="lg" scrollable no-close-on-backdrop no-backdrop no-footer>
    <article class="preview-content">
      <h2 class="preview-title">{{ pub_title }}</h2>

      <div class="preview-tags">
        <span v-for="tag in pub_tags" :key="tag" class="preview-tag">
          {{ tag }}
        </span>
      </div>

      <hr />

      <div class="preview-body" v-html="valueHTML"></div>

      <footer class="preview-footer">
        <div class="author-info">
          <BAvatar size="50" :src="userInfo?.avatar || null" />
          <div class="author-details">
            <div class="author-name">{{ userInfo?.username }}</div>
            <div class="author-sign">{{ userInfo?.sign || '' }}</div>
          </div>
        </div>
        <BButton variant="outline-secondary" size="sm">+ 关注</BButton>
      </footer>
    </article>
  </BModal>
</template>

<style lang="scss" scoped>
// ==================== 变量 ====================
$editor-width: 800px;
$border-color: #d3d3d3;
$border-radius: 5px;

// ==================== 容器 ====================
.editor-container {
  width: 100%;
  min-height: 500px;
  padding: 20px;
  background-color: white;
  display: flex;
  flex-direction: column;
}

// ==================== 区块间距 ====================
section {
  margin-bottom: 1rem;

  &.post-type-section {
    margin-top: 1rem;
  }

  &.actions-section {
    margin-top: 1.5rem;
  }
}

.section-title {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

// ==================== 标题输入 ====================

// ==================== 编辑器 ====================
.editor-section {
  width: 100%;

  .editor-toolbar {
    border-bottom: 2px solid gainsboro;
  }

  .editor-content {
    min-height: 600px;
    // max-height: 650px;
    overflow-y: auto;
    border-top: 1px solid $border-color;
    border-bottom: 2px solid gainsboro;
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
  }

  // 统一宽度
  :deep(.w-e-toolbar),
  :deep(.w-e-text-container) {
    width: 100%;
  }
}

// ==================== 标签 ====================
.tags-section {
  :deep(.b-form-tags) {
    width: $editor-width;
  }
}

// ==================== 预览模态框 ====================
.preview-content {
  .preview-title {
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    margin-bottom: 1rem;
    padding-top: 1rem;
  }

  .preview-tags {
    margin-bottom: 1rem;

    .preview-tag {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      margin-right: 0.5rem;
      font-size: small;
      background-color: white;
      border: 1px solid #dee2e6;
      border-radius: 0.25rem;
      cursor: pointer;

      &:hover {
        background-color: #f8f9fa;
      }
    }
  }

  .preview-body {
    overflow: hidden;
    width: 100%;

    :deep(p) {
      width: 100%;

      img {
        max-width: 100%;
        height: auto;
      }
    }
  }

  .preview-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    margin-top: 2rem;
    box-shadow: 0 -0.125rem 0.25rem rgba(0, 0, 0, 0.075);

    .author-info {
      display: flex;
      align-items: center;
      gap: 1rem;

      .author-details {
        .author-name {
          font-weight: bold;
          font-size: 1.25rem;
        }

        .author-sign {
          color: #6c757d;
        }
      }
    }
  }
}
</style>
