<script setup lang="ts">
//TODO:重构
</script>

<template>
  <div class="recommand mb-4">
    <BCard class="recommand-tab mb-4" no-body>
      <BCardHeader header-tag="nav">
        <BNav align="center" pills>
          <BNavItem to="/news/" exact exact-active-class="active">推荐
          </BNavItem>
          <BNavItem to="/subscribe/" exact exact-active-class="active">订阅
          </BNavItem>
        </BNav>
      </BCardHeader>

      <BCardBody class="content">
        <RouterView />
      </BCardBody>
    </BCard>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

:deep(.nav-link) {
  color: black !important;
}

:deep(.nav-pills .nav-link.active) {
  background-color: rgba(178, 34, 34, 0.126) !important;
}


.recommand {
  border-radius: 12px;

  .label-word {
    color: #660909;
  }

  min-height: 400px;

  .recommand-tab {

    /* 保证内容区高度一致，避免切换时父容器高度跳动 */
    .content {
      min-height: 300px;
      position: relative;
      /* 为绝对定位的进入元素提供上下文 */
    }

    /* 如果你使用 <transition> 包裹 RouterView，可以让进入的组件绝对定位 */
    .recommand-content {
      position: absolute;
      inset: 0;
      /* top:0; right:0; bottom:0; left:0 */
    }
  }
}

.b-card-body {
  min-height: 300px; // 保证内容区高度一致
}
</style>
