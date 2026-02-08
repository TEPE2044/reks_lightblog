<script setup lang="ts">

import { ref } from 'vue';
import router from '../Router';

const searchContent = ref("");
const searchReadonly = ref(true);

const handleSearch = () => {
  // TODO:跳转到搜索结果页并且返回搜索内容，携带搜索内容，可使用标签分类
  try{
    router.push({ name: 'search'});
    console.log("Searching for:", searchContent.value);
  }catch(e){
    console.error(e)
  }
};
</script>

<template>
  <form class="search-bar position-relative d-flex align-items-center">
    <input
      type="text"
      autofocus="false"
      autocomplete="off"
      name="search"
      :readonly="searchReadonly"
      @focus="searchReadonly = false"
      @keydown.enter.stop="handleSearch"
      class="search-input position-absolute"
      v-model="searchContent"
      placeholder="索引万物"
    />
    <div class="search-icon" @click="handleSearch">
      <i-bi-search/>
    </div>
  </form>

</template>

<style lang="scss" scoped>
// 使搜索栏宽度可变，而且需要向左延展
$flexible-width:10rem;
$expanded-width:$flexible-width + 0.4rem;
.search-bar {
  width: $flexible-width;
  height: 30px;
  background: rgba(255, 255, 255, 0.650);
  border-radius: 15px;
  transition: width 0.3s ease;
  // fix
  &:focus-within {
    width: $expanded-width;
  }

  .search-input{
    top: 18%;
    left: 8%;
    width: 7rem;
    border: none;
    font-size: small;
    background-color: rgba(0, 0, 0, 0);
    &:focus{
      outline: none;
    }
  }
  .search-icon {
    transform: translateX(690%) translateY(-3.5%);
    cursor: pointer;
  }
}
</style>