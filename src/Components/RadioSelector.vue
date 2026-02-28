<script setup lang="ts">
import { ref } from "vue";
const searchType = ref('keyword');
const lazyTags = ref([]);
const lazyText = ref("");
const options = [
  { text: "内容搜索", value: "keyword" },
  { text: "标签搜索", value: "tag" },
];
</script>
<template>
  <div class="radio-selector">
    <BFormRadioGroup
      class="mb-2"
      v-model="searchType"
      :options="options"
      name="search-type"
    />

    <section class="keyword mt-3" v-if="searchType === 'keyword'">
      <BInputGroup>
        <BFormInput type="text" v-model="lazyText" />
        <BButton
          variant="outline-success"
          class="d-flex align-items-center gap-1"
        >
          <i-bi-search /> 搜索</BButton
        >
      </BInputGroup>
    </section>

    <section class="tag mt-3" v-if="searchType === 'tag'">
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
      </BInputGroup>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";
.radio-selector{
  padding: 1rem;
  @extend %reks-card-box;
}
</style>
