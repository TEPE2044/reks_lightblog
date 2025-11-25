<script setup lang="ts">

</script>

<template>
  <BContainer class="recommand">
    <BCard no-body>
      <BCardHeader header-tag="nav">
        <BNav card-header tabs>
          <BNavItem
              to="/news/"
              exact
              exact-active-class="active"
          >个性化推荐
          </BNavItem>
          <BNavItem
              to="/subscribe/"
              exact
              exact-active-class="active"
          >我的订阅
          </BNavItem>
        </BNav>
      </BCardHeader>

      <BCardBody>
        <RouterView/>
      </BCardBody>
    </BCard>
  </BContainer>
</template>

<style lang="scss" scoped>

</style>