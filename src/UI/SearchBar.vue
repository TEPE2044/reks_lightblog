<script setup lang="ts">

</script>

<template>
  <BInputGroup class="btn-search">
    <BFormInput autofocus class="search-input" placeholder="索引万物"/>
    <BButton variant="outline-dark">
      <i class="bi bi-search"></i>
    </BButton>
  </BInputGroup>

</template>

<style lang="scss" scoped>
.btn-search {
  width: 25rem;
  .search-input{
    border: 1px solid rgba(0, 0, 0, 0.49);
  }
}
</style>