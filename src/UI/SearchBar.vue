<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from 'vue';
import router from '../Router';

const searchContent = ref("");

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
  <div class="search-bar position-relative d-flex align-items-center">
    <input type="text" @keydown.enter="handleSearch" class="search-input position-absolute" v-model="searchContent" placeholder="索引万物" />
    <div class="search-icon" @click="handleSearch">
      <Icon icon="bi:search" />
    </div>
  </div>

</template>

<style lang="scss" scoped>
//TODO: 使搜索栏宽度可变，而且需要向左延展
$flexible-width:10rem;
$expanded-width:$flexible-width + 0.4rem;
.search-bar {
  width: $flexible-width;
  height: 30px;
  background: white;
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
    transform: translateX(830%) translateY(-3.5%);
    cursor: pointer;
  }
}
</style>