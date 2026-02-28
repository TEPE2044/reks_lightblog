<script setup lang="ts">
import { ref, watch } from "vue";
import { searchBlog, searchBlogTag } from "../Hooks/Search";
import type { PageWrapper } from "../Utils/reks-interface";
import { useDebounceFn } from "@vueuse/core";
import { searchStore } from "../Store/search";
const { setBlogRes } = searchStore();

const searchType = ref("keyword");
const pages = defineModel<PageWrapper>({
  default: { currentPage: 1, perPage: 5, rows: 0 }
});

const lazyTags = ref<string[] | []>([]);
const lazyText = ref<string | "">("");
const options = [
  { text: "内容搜索", value: "keyword" },
  { text: "标签搜索", value: "tag" },
];

const queryBlog = async () => {
  const res = await searchBlog(
    pages.value?.currentPage as number,
    pages.value?.perPage as number,
    lazyText.value as string,
  );
  if(res && pages.value){
    pages.value.rows = res?.total
    setBlogRes(res?.data)
  }
};

const query_blog = useDebounceFn(queryBlog, 1000);

const queryTags = async () => {
  const res = await searchBlogTag(
    pages.value?.currentPage as number,
    pages.value?.perPage as number,
    lazyTags.value as string[],
  );
  if (res && pages.value) {
    // console.log(res)
    pages.value.rows = res?.total;
    setBlogRes(res?.data);
  }
};

const query_tags = useDebounceFn(queryTags, 1000);

watch(
 () => pages.value?.currentPage,
  async(value) => {
    if (value){
      await queryBlog();
    }

    if (searchType.value === "keyword" && lazyText.value.trim().length > 0) {
      await queryBlog();
    }

    if (searchType.value === "tag" && lazyTags.value.length > 0) {
      await queryTags();
    }
  },
);

watch(searchType, (value) => {
  if (value === "keyword") {
    lazyText.value = "";
  }
  if (value === "tag") {
    lazyTags.value = [];
  }
});
</script>
<template>
  <div class="radio-selector">
    <section class="keyword mt-2" v-if="searchType === 'keyword'">
      <BInputGroup>
        <BFormInput type="text" placeholder="请输入文本🤖" v-model="lazyText" />
        <BButton
          @click.stop="query_blog()"
          variant="outline-success"
          class="d-flex align-items-center gap-1"
        >
          <i-bi-search /> 搜索</BButton
        >
      </BInputGroup>
    </section>

    <section class="tag mt-2" v-if="searchType === 'tag'">
      <BInputGroup>
        <BFormTags
          v-model="lazyTags"
          :limit="5"
          remove-on-delete
          add-button-text="Add"
          limit-tags-text="最多只能设置5个标签噢"
          input-id="tags-basic"
          placeholder="添加标签(使用回车确定标签)"
        />
        <BButton
          @click.stop="query_tags()"
          variant="outline-success"
          class="d-flex align-items-center gap-1"
        >
          <i-bi-search /> 搜索
        </BButton>
      </BInputGroup>
    </section>

    <BFormRadioGroup
      class="mt-3"
      v-model="searchType"
      :options="options"
      name="search-type"
    />
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";
.radio-selector {
  padding: 1rem;
  @extend %reks-card-box;
}
</style>
