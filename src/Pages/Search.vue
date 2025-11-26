<script setup lang="ts">
import { ref } from "vue";

const lazyText = ref("");

// const toLowerCaseFormatter = (value: string) => value.toLowerCase();
</script>

<template>
  <div class="search d-flex flex-column align-items-center">
    <div class="search-input mt-5 w-50">
      <BInputGroup>
        <BFormInput type="text" v-model="lazyText" />
        <BButton variant="outline-success">Button</BButton>
      </BInputGroup>
    </div>

    <div class="result mt-5 w-75">
      <!-- TODO: 搜索结果展示,要进行分类 -->
      <BCard class="result-nav" title="Card Title" no-body>
        <BCardHeader class="result-nav-header" header-tag="result-header-nav">
          <BNav card-header tabs>
            <BNavItem  exact exact-active-class="active">Active</BNavItem>
            <BNavItem  exact exact-active-class="active">Foo</BNavItem>
            <BNavItem to="/some/route/bar" exact exact-active-class="active">Bar</BNavItem>
          </BNav>
        </BCardHeader>

        <BCardBody class="result-body">
          <!-- <RouterView /> -->
        </BCardBody>
      </BCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.result-header-nav{
  background-color: rgba($color: #ffffff, $alpha: 0.2);
}
</style>
