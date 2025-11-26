<script setup lang="ts">
import { ref } from "vue";

const lazyText = ref("");

const toLowerCaseFormatter = (value: string) => value.toLowerCase();
</script>

<template>
  <div class="search">
    <div class="search-input">
      <!-- BUG 无法调整布局 -->
      <BFormInput 
        class="mt-5"
        id="input-lazy"
        v-model="lazyText"
        placeholder="Enter your name"
        lazy-formatter
        :formatter="toLowerCaseFormatter"
      />
    </div>

    <div class="result">
      <!-- TODO: 搜索结果展示,要进行分类 -->
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste excepturi
        enim laboriosam aspernatur eligendi consequuntur vitae assumenda
        repellat. Culpa nemo pariatur nam impedit, soluta illo ipsa nisi sequi
        quos in?
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
