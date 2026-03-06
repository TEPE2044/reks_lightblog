<script setup lang="ts">
import router from '../Router';

const handleSearch = () => {
  try{
    router.push({ name: 'search'});
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
      readonly
      @click="handleSearch"
      class="search-input position-absolute"
      placeholder="索引万物"
    />
    <div class="search-icon">
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