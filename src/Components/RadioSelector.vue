<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { searchBlog, searchBlogTag, searchMusic, searchUser } from "../Hooks/Search";
import type { PageWrapper } from "../Utils/reks-interface";
import { searchStore } from "../Store/search";
import { storeToRefs } from "pinia";
import { useDebounceFn } from "@vueuse/core";

const props = defineProps<{
  activeTab: "keyword" | "music" | "user";
}>();

const store = searchStore();
const { setBlogRes, setMusicRes, setUserRes, clearSearchResult } = store;
const { searchType } = storeToRefs(store);

const mode = ref<"keyword" | "tag">("keyword");
const pages = defineModel<PageWrapper>({
  default: { currentPage: 1, perPage: 5, rows: 0 },
});

const lazyTags = ref<string[]>([]);
const lazyText = ref("");
const options = [
  { text: "内容搜索", value: "keyword" },
  { text: "标签搜索", value: "tag" },
];

const inputPlaceholder = computed(() => {
  if (props.activeTab === "music") return "请输入音乐关键词🎵";
  if (props.activeTab === "user") return "请输入用户名或昵称👤";
  return "请输入文本🤖";
});

const resetPageToFirst = () => {
  if (!pages.value) return;
  pages.value = {
    ...pages.value,
    currentPage: 1,
    rows: 0,
  };
};

const setPagedResult = (res?: { total?: number; data?: unknown[] }) => {
  if (!pages.value) return;
  pages.value.rows = res?.total ?? 0;
};

const queryBlog = async () => {
  const keyword = lazyText.value.trim();
  if (!keyword) return;

  const res = await searchBlog(
    pages.value?.currentPage as number,
    pages.value?.perPage as number,
    keyword,
  );

  setPagedResult(res);
  setBlogRes((res?.data ?? []) as never[]);
  setMusicRes([]);
  setUserRes([]);
};

const queryTags = async () => {
  if (lazyTags.value.length === 0) return;

  const res = await searchBlogTag(
    pages.value?.currentPage as number,
    pages.value?.perPage as number,
    lazyTags.value,
  );

  setPagedResult(res);
  setBlogRes((res?.data ?? []) as never[]);
  setMusicRes([]);
  setUserRes([]);
};

const queryMusic = async () => {
  const keyword = lazyText.value.trim();
  if (!keyword) return;

  const res = await searchMusic(
    pages.value?.currentPage as number,
    pages.value?.perPage as number,
    keyword,
  );

  setPagedResult(res);
  setMusicRes(res?.data);
  setBlogRes([]);
  setUserRes([]);
};

const queryUser = async () => {
  const keyword = lazyText.value.trim();
  if (!keyword) return;

  const res = await searchUser(
    pages.value?.currentPage as number,
    pages.value?.perPage as number,
    keyword,
  );

  setPagedResult(res);
  setUserRes(res?.data);
  setBlogRes([]);
  setMusicRes([]);
};

const runSearchByTab = useDebounceFn(async () => {
  if (props.activeTab === "keyword") {
    if (mode.value === "tag") {
      await queryTags();
      return;
    }
    await queryBlog();
    return;
  }

  if (props.activeTab === "music") {
    await queryMusic();
    return;
  }

  await queryUser();
}, 1000);

watch(
  () => pages.value?.currentPage,
  async (value, oldValue) => {
    if (!value || value === oldValue) return;
    await runSearchByTab();
  },
);

watch(
  () => props.activeTab,
  (value) => {
    searchType.value = value;
    mode.value = "keyword";
    lazyTags.value = [];
    lazyText.value = "";
    clearSearchResult();
    resetPageToFirst();
  },
  { immediate: true },
);

watch(mode, (value) => {
  if (value === "keyword") {
    lazyTags.value = [];
    return;
  }
  lazyText.value = "";
});
</script>

<template>
  <div class="radio-selector">
    <section class="tag mt-2" v-if="activeTab === 'keyword' && mode === 'tag'">
      <BInputGroup>
        <BFormTags v-model="lazyTags" :limit="5" remove-on-delete add-button-text="Add" limit-tags-text="最多只能设置5个标签噢"
          input-id="tags-basic" placeholder="添加标签(使用回车确定标签)" @keydown.enter.stop="runSearchByTab" />
        <BButton @click.stop="runSearchByTab" variant="outline-success" class="d-flex align-items-center gap-1">
          <i-bi-search /> 搜索
        </BButton>
      </BInputGroup>
    </section>

    <section class="keyword mt-2" v-else>
      <BInputGroup>
        <BFormInput type="text" :placeholder="inputPlaceholder" v-model="lazyText" @keydown.enter.stop="runSearchByTab" />
        <BButton @click.stop="runSearchByTab" variant="outline-success" class="d-flex align-items-center gap-1">
          <i-bi-search /> 搜索
        </BButton>
      </BInputGroup>
    </section>

    <BFormRadioGroup v-show="activeTab === 'keyword'" class="mt-3" v-model="mode" :options="options"
      name="search-type" />
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.radio-selector {
  padding: 1rem;
  @extend %reks-card-box;
}
</style>
