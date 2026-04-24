<script setup lang="ts">
import "@wangeditor-next/editor/dist/css/style.css";
import { storeToRefs } from "pinia";
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { Editor, Toolbar } from "@wangeditor-next/editor-for-vue";
import type { IEditorConfig, IToolbarConfig } from "@wangeditor-next/editor";
import { useToast, useToggle } from "bootstrap-vue-next";
import { editorStore } from "../Store/editor";
import { upload_img } from "../Hooks/Editor";
import { query_blog_by_id, query_draft_by_id, update_blog, update_draft, upload_blog, upload_mblog } from "../Hooks/Blog";
import { formatDateTime } from "../Utils/reks-format-time";
import { createToast } from "../Utils/reks-toast";
import router from "../Router";
import { userStore } from "../Store/user";
import { set } from "@vueuse/core";
import { searchMusic } from "../Hooks/Search";
import type { BlogData, MusicResponse } from "../Utils/reks-interface";
import { substore } from "../Store/subscribe";
import { makeSubscribeMessage } from "../Utils/subscribe-log";

const props = withDefaults(
  defineProps<{
    mblog?: boolean;
    upload: "mblog" | "";
    mode?: "create" | "edit";
    blogId?: number | string;
    source?: "blog" | "draft";
  }>(),
  {
    mblog: false,
    upload: "",
    mode: "create",
    source: "blog",
  },
);

const toast = useToast();
const { userInfo } = storeToRefs(userStore());
const { addSubscribeMessage } = substore();

const resolveCurrentRid = () => userInfo.value?.reks_id ?? "guest";
const isEditMode = computed(() => props.mode === "edit");
const tagsSectionTitle = computed(() =>
  isEditMode.value ? "编辑标签" : "上传标签",
);
const submitLabel = computed(() => (isEditMode.value ? "保存修改" : "发布"));
const confirmTitle = computed(() =>
  isEditMode.value ? "确认保存修改?" : "确认发布?",
);
const submitToastTitle = computed(() =>
  isEditMode.value ? "保存成功" : "发布成功",
);

const leaveEditorPage = () => {
  resetEditorState();

  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.push("/");
};

// 状态管理
const { editor, valueHTML, pub_tags, pub_title, coverImages, music_id } =
  storeToRefs(editorStore());
const { handleCreated, handleChange, resetEditorState: clearEditorState } = editorStore();

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

const resetEditorState = () => {
  clearEditorState();
  selectedMusic.value = null;
  draftMusic.value = null;
  draftMusicId.value = null;
};

const resolveBlogDetail = async (id: number) => {
  if (props.source === "draft") {
    return await query_draft_by_id(id);
  }

  return await query_blog_by_id(id);
};

const fillEditorFromBlog = (blog: BlogData & Record<string, any>) => {
  set(pub_title, blog?.title || "");
  set(valueHTML, blog?.content || "");
  set(pub_tags, Array.isArray(blog?.tags) ? [...blog.tags] : []);

  const song = blog?.song || blog?.music || null;
  const nextMusicId = Number(song?.id || blog?.music_id || 0);

  set(music_id, nextMusicId);
  selectedMusic.value = song;
  draftMusic.value = song;
  draftMusicId.value = nextMusicId || null;
};

const initEditor = async () => {
  if (!isEditMode.value) {
    resetEditorState();
    return;
  }

  const blogId = Number(props.blogId);
  if (Number.isNaN(blogId) || blogId <= 0) {
    createToast(toast, "加载失败", "博客编号无效", "danger");
    return;
  }

  resetEditorState();

  try {
    const res = await resolveBlogDetail(blogId);
    fillEditorFromBlog(res);
  } catch (error) {
    console.error("加载编辑内容失败:", error);
    createToast(toast, "加载失败", "编辑内容读取失败", "danger");
  }
};

/** 提交发布 */
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

  const submitBlog = async () => {
    if (isEditMode.value) {
      const blogId = Number(props.blogId);
      if (Number.isNaN(blogId) || blogId <= 0) {
        createToast(toast, "提交失败", "博客编号无效", "danger");
        return;
      }

      if (props.source === "draft") {
        return await update_draft(
          blogId,
          pub_title.value,
          valueHTML.value,
          coverImages.value,
          pub_tags.value,
        );
      }

      return await update_blog(
        blogId,
        pub_title.value,
        valueHTML.value,
        coverImages.value,
        pub_tags.value,
      );
    }

    if (music_id.value !== 0) {
      return await upload_mblog(
        pub_title.value,
        valueHTML.value,
        coverImages.value,
        pub_tags.value,
        music_id.value,
      );
    }

    return await upload_blog(
      pub_title.value,
      valueHTML.value,
      coverImages.value,
      pub_tags.value,
    );
  };

  try {
    const res = await submitBlog();
    console.log("发布成功:", res);

    if (res?.msg) {
      if (!isEditMode.value) {
        addSubscribeMessage(
          makeSubscribeMessage(
            "self.blog.published",
            music_id.value !== 0
              ? `你发布了音乐博客《${pub_title.value}》`
              : `你发布了博客《${pub_title.value}》`,
          ),
          resolveCurrentRid(),
        );
      }

      if (isEditMode.value) {
        createToast(toast, submitToastTitle.value, "博客内容已更新", "success");
        setTimeout(() => {
          leaveEditorPage();
        }, 500);
      } else {
        createToast(toast, submitToastTitle.value, "发布成功！期待上热门哦", "success");
        set(pub_title, "");
        set(valueHTML, "");
        set(coverImages, []);
        set(pub_tags, []);
        set(music_id, 0);
      }
      return;
    }

    createToast(toast, "提交失败", "请重新提交", "danger");
  } catch (error) {
    console.error("发布失败:", error);
    alert("发布失败，请重试");
  }
};

// ==================== 生命周期 ====================
onMounted(() => {
  void initEditor();
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
    editor.value = undefined as any;
  }
  resetEditorState();
});

const sltMusic = useToggle("sltMusic");

const toggleMsBox = () => {
  sltMusic.toggle();
};

const filter = ref("");
const selectedMusic = ref<MusicResponse | null>(null);
const draftMusic = ref<MusicResponse | null>(null);
const draftMusicId = ref<number | null>(null);
const musicRows = ref<MusicResponse[]>([]);
const isMusicLoading = ref(false);
const musicPage = ref(1);
const musicPerPage = ref(8);
const musicTotal = ref(0);

const fields = [
  { key: "select", label: "选择", sortable: false },
  { key: "name", label: "歌曲", sortable: true },
  { key: "username", label: "作者", sortable: true },
  { key: "desc", label: "简介", sortable: false },
  { key: "created_at", label: "上传时间", sortable: true },
  { key: "original", label: "原创", sortable: true },
];

const loadMusicList = async () => {
  isMusicLoading.value = true;
  try {
    const res = await searchMusic(
      musicPage.value,
      musicPerPage.value,
      filter.value.trim(),
    );
    musicRows.value = (res?.data ?? []) as MusicResponse[];
    musicTotal.value = res?.total ?? 0;

    if (draftMusicId.value) {
      const current = musicRows.value.find((m) => m.id === draftMusicId.value);
      draftMusic.value = current ?? draftMusic.value;
    }
  } catch (error) {
    console.error("获取音乐列表失败:", error);
    createToast(toast, "查询失败", "音乐列表加载失败", "danger");
  } finally {
    isMusicLoading.value = false;
  }
};

// 处理 radio 选择
const handleSelect = (item: MusicResponse) => {
  draftMusic.value = item;
  draftMusicId.value = item.id;
  console.log("Selected:", item);
};

const handleMusicModalShow = async () => {
  draftMusic.value = selectedMusic.value;
  draftMusicId.value = music_id.value || null;
  musicPage.value = 1;
  await loadMusicList();
};

const handleMusicModalOk = (evt?: { preventDefault?: () => void }) => {
  if (!draftMusic.value) {
    evt?.preventDefault?.();
    createToast(toast, "提示", "请先选择一首歌曲", "warning");
    return;
  }

  selectedMusic.value = draftMusic.value;
  set(music_id, draftMusic.value.id);
  createToast(toast, "已选择", `已绑定歌曲: ${draftMusic.value.name}`, "success");
};

const resetDraftSelection = () => {
  draftMusic.value = selectedMusic.value;
  draftMusicId.value = music_id.value || null;
};

const handleMusicSearch = async () => {
  musicPage.value = 1;
  await loadMusicList();
};

watch(musicPage, async () => {
  await loadMusicList();
});

const previewMusic = computed(() => {
  if (!music_id.value || music_id.value === 0) return null;
  if (selectedMusic.value?.id === music_id.value) return selectedMusic.value;
  return null;
});

watch(
  () => [props.mode, props.blogId, props.source],
  () => {
    void initEditor();
  },
);

//TODO: 1.表格整理 2.搜索接口接入 3.游标查询 4.ok选择后绑定id 5.取消将id置0
</script>

<template>
  <BModal
    id="sltMusic"
    title="选择歌曲"
    size="xl"
    cancel-title="取消"
    ok-title="选定"
    backdrop
    scrollable
    lazy
    no-header-close
    no-close-on-backdrop
    no-close-on-esc
    @show="handleMusicModalShow"
    @ok="handleMusicModalOk"
    @cancel="resetDraftSelection"
    @hidden="resetDraftSelection"
  >
    <div>
      <BFormGroup label="查找歌曲" label-for="filter-input" class="mb-3">
        <BInputGroup>
          <BFormInput
            id="filter-input"
            v-model="filter"
            type="search"
            placeholder="输入歌曲名关键字"
            @keydown.enter="handleMusicSearch"
          />
          <BButton variant="outline-secondary" @click="handleMusicSearch">
            搜索
          </BButton>
        </BInputGroup>
      </BFormGroup>

      <BTable
        :items="musicRows"
        :fields="fields"
        :busy="isMusicLoading"
        hover
      >
        <!-- 自定义 select 列：渲染 radio -->
        <template #cell(select)="{ item }">
          <BFormRadio
            :value="item.id"
            v-model="draftMusicId"
            :name="'music-radio'"
            @change="handleSelect(item)"
          />
        </template>
        <template #cell(created_at)="{ item }">
          {{ formatDateTime(item.created_at) }}
        </template>
        <template #cell(original)="{ item }">
          {{ item.original ? "是" : "否" }}
        </template>
        <template #cell(desc)="{ item }">
          {{ item.desc || "-" }}
        </template>
      </BTable>

      <BPagination
        v-model="musicPage"
        class="mt-3"
        align="center"
        :total-rows="musicTotal"
        :per-page="musicPerPage"
      />
    </div>
  </BModal>

  <div class="editor-container mx-auto">
    <section class="audio-secetion mt-2 mb-4" v-if="mblog && !isEditMode">
      <p class="section-title">选择歌曲</p>
      <div class="bgrp d-flex gap-3">
        <BButton variant="outline-secondary" @click.stop="toggleMsBox()"
          >选择已有的歌曲</BButton
        >
        <BButton to="/upload/music">上传新歌曲</BButton>
      </div>
      <p class="text-muted mt-2 mb-2">
        已选择: {{ selectedMusic ? selectedMusic.name : "无" }}
      </p>
    </section>
    <section class="editor-section" :class="{ 'mt-3': mblog }">
      <!-- 标题输入 -->
      <div class="form-floating mb-2">
        <input
          id="uploadTitle"
          v-model="pub_title"
          type="text"
          class="form-control"
          minlength="1"
          maxlength="20"
          required
          placeholder="有何感想？"
        />
        <label for="uploadTitle">从标题开始</label>
      </div>
      <Toolbar
        class="editor-toolbar"
        :editor="editor"
        :default-config="toolbarConfig"
        mode="default"
      />
      <Editor
        v-model="valueHTML"
        class="editor-content"
        :default-config="editorConfig"
        mode="default"
        @on-created="handleCreated"
        @on-change="handleChange"
      />
    </section>

    <section class="tags-section">
      <p class="section-title">{{ tagsSectionTitle }}</p>
      <BFormTags
        v-model="pub_tags"
        input-id="tags-basic"
        :limit="5"
        duplicate-tag-text="重复标签"
        remove-on-delete
        add-button-text="Add"
        limit-tags-text="最多只能设置5个标签噢"
        placeholder="设置标签(使用回车确定标签)"
      />
    </section>

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
    <section class="actions-section">
      <BPopover placement="bottom">
        <template #target>
          <BButton variant="success" class="float-end">{{ submitLabel }}</BButton>
        </template>
        <template #title>
          <strong>{{ confirmTitle }}</strong>
        </template>
        <BButton
          v-if="upload === 'mblog'"
          title="音乐博客"
          size="sm"
          variant="success"
          class="me-2"
          @click="handleSubmit"
        >
          <i-bi-send /> {{ submitLabel }}
        </BButton>
        <BButton
          v-else
          title="普通博客"
          size="sm"
          variant="success"
          class="me-2"
          @click="handleSubmit"
        >
          <i-bi-send /> {{ submitLabel }}
        </BButton>
        <!-- <BButton size="sm" variant="primary"> <i-bi-box /> 暂存 </BButton> -->
      </BPopover>
      <BButton variant="primary" class="float-end me-2" @click="handlePreview">
        预览
      </BButton>
    </section>
  </div>

  <!-- 预览模态框 -->
  <BModal
    id="preview"
    size="lg"
    scrollable
    no-close-on-backdrop
    no-backdrop
    no-footer
  >
    <article class="preview-content">
      <h2 class="preview-title">{{ pub_title }}</h2>

      <div class="preview-tags">
        <span v-for="tag in pub_tags" :key="tag" class="preview-tag">
          {{ tag }}
        </span>
      </div>
      
      <hr />
      <article v-if="music_id !== 0 && !isEditMode" class="music-box preview-music-box mb-3">
        <div class="music-cover">
          <img
            :src="previewMusic?.cover || '/a_huayu.webp'"
            :alt="`preview-music-${music_id}`"
          />
        </div>

        <div class="music-content">
          <h5 class="music-title">{{ previewMusic?.name || `已绑定音乐 #${music_id}` }}</h5>
          <div class="music-desc text-secondary">
            {{ previewMusic?.desc || "音乐信息将在发布后展示" }}
          </div>

          <div class="music-meta d-flex align-items-center gap-3">
            <BAvatar :src="previewMusic?.avatar || undefined" size="36" />
            <span class="text-secondary">{{ previewMusic?.username || "未知作者" }}</span>
          </div>

          <audio v-if="previewMusic?.audio" class="mt-2" :src="previewMusic.audio" controls />
        </div>
      </article>


      <div class="preview-body" v-html="valueHTML"></div>

      <footer class="preview-footer">
        <div class="author-info">
          <BAvatar size="50" :src="userInfo?.avatar || null" />
          <div class="author-details">
            <div class="author-name">{{ userInfo?.username }}</div>
            <div class="author-sign">{{ userInfo?.sign || "" }}</div>
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
  min-height: 200px;
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
  .preview-music-box {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(220, 220, 220, 0.9);
    background-color: rgba(255, 255, 255, 0.84);

    .music-cover img {
      width: 100%;
      height: 160px;
      object-fit: cover;
      border-radius: 0.5rem;
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
    }

    .music-title {
      margin-bottom: 0.5rem;
      color: #2f2f2f;
      font-weight: 700;
      letter-spacing: 0.01em;
    }

    .music-desc {
      margin-bottom: 0.8rem;
      line-height: 1.5;
      display: -webkit-box;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .music-meta {
      flex-wrap: wrap;

      span {
        font-size: 0.92rem;
        font-weight: 500;
      }
    }
  }

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

@media (max-width: 768px) {
  .preview-content {
    .preview-music-box {
      grid-template-columns: 1fr;

      .music-cover img {
        height: 180px;
      }
    }
  }
}
</style>
