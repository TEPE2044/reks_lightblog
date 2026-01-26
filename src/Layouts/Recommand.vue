<script setup lang="ts">
</script>

<template>
  <div class="recommand py-4">
    <div class="recommand-tab mb-4">
      <BNav align="center" pills>
        <BNavItem to="/news/" exact exact-active-class="active">推荐
        </BNavItem>
        <BNavItem to="/subscribe/" exact exact-active-class="active">订阅
        </BNavItem>
      </BNav>


      <div class="content">
        <Keep-alive>
          <transition name="fade" mode="out-in">
            <RouterView />
          </transition>
        </Keep-alive>
      </div>
    </div>
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
  @extend %reks-card-box;
  // background-color: rgba(255, 255, 255, 0.591);

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
  }
}
</style>
