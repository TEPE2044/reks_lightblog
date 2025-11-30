<script setup lang="ts">

</script>

<template>
  <BContainer class="recommand">
     <figure class="mt-3">
          <blockquote class="blockquote">
            <p style="color: #660909">ReKindle Everything</p>
          </blockquote>
      </figure>

    <BCard class="news-content mt-2" no-body>
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
@use "../Asset/CustomStyle/global.scss";
.recommand {
  min-height: 400px;
  @extend %reks-card-box; 
}


.b-card-body {
  min-height: 300px; // 保证内容区高度一致
}
</style>