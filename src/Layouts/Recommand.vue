<script setup lang="ts">
//TODO:重构
</script>

<template>
  <BContainer class="recommand mb-4">
    <figure class="mt-3">
      <blockquote class="blockquote">
        <p class="label-word">ReKindle Everything</p>
      </blockquote>
    </figure>

    <BCard class="recommand-tab mt-2 mb-4" no-body>
      <BCardHeader header-tag="nav">
        <BNav card-header tabs>
          <BNavItem to="/news/" exact exact-active-class="active"
            >个性化推荐
          </BNavItem>
          <BNavItem to="/subscribe/" exact exact-active-class="active"
            >我的订阅
          </BNavItem>
        </BNav>
      </BCardHeader>

      <BCardBody class="content">
        <RouterView />
      </BCardBody>
    </BCard>
  </BContainer>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

:deep(.nav-link){
  color: black !important;
}
:deep(.nav-link.active){
  color: firebrick !important;
}
:deep(.card-header){
  background-color: rgba(255, 236, 201, 0.219) !important;
}


.recommand {
  .label-word {
   color: #660909;
  }

  min-height: 400px;
  @extend %reks-card-box;

  .recommand-tab {
    /* 保证内容区高度一致，避免切换时父容器高度跳动 */
    .content {
      min-height: 300px;
      position: relative; /* 为绝对定位的进入元素提供上下文 */
    }

    /* 如果你使用 <transition> 包裹 RouterView，可以让进入的组件绝对定位 */
    .recommand-content {
      position: absolute;
      inset: 0; /* top:0; right:0; bottom:0; left:0 */
    }
  }
}

.b-card-body {
  min-height: 300px; // 保证内容区高度一致
}
</style>
