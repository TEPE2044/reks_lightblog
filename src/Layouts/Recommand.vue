<script setup lang="ts">
</script>

<template>
  <div class="recommand py-3">
    <div class="recommand-tab mb-4">
      <div class="recommand-nav-wrap">
        <BNav align="center" pills class="recommand-nav">
          <BNavItem to="/hub/main" exact exact-active-class="active">内容推荐
          </BNavItem>
          <!-- <BNavItem to="/hub/subscribe" exact exact-active-class="active">订阅
          </BNavItem> -->
        </BNav>
      </div>


      <div class="content">
        <RouterView />
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
  --recommand-sticky-top: 6.2rem;

  border-radius: 12px;
  @extend %reks-card-box;
  // background-color: rgba(255, 255, 255, 0.591);

  .label-word {
    color: #660909;
  }

  min-height: 300px;

  .recommand-tab {
    position: relative;
    isolation: isolate;

    .recommand-nav-wrap {
      position: sticky;
      top: var(--recommand-sticky-top);
      z-index: 30;
      background-color: #fafafa;
      padding: 0.25rem 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    }

    /* 保证内容区高度一致，避免切换时父容器高度跳动 */
    .content {
      min-height: 520px;
      max-height: calc(100vh - var(--recommand-sticky-top) - 5.5rem);
      overflow-y: auto;
      position: relative;
      z-index: 1;
      background-color: #fafafa;
      /* 为绝对定位的进入元素提供上下文 */
    }
  }
}

@media (max-width: 768px) {
  .recommand {
    --recommand-sticky-top: 6.2rem;

    .recommand-tab {
      .content {
        max-height: calc(100vh - var(--recommand-sticky-top) - 5rem);
      }
    }
  }
}
</style>
