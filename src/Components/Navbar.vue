<script lang="ts" setup>
import { computed } from "vue";
import { substore } from "../Store/subscribe";

const subscribe = substore();
const hasUnread = computed(() => subscribe.hasUnreadFollowing());
</script>

<template>
    <div class="navbar">
        <BContainer>
            <BNavbarNav class="main-nav flex-row gap-4 align-items-center">
                <BNavItem class="section" id="home-item" to="/">
                    <BLink to="/">首页</BLink>
                </BNavItem>
                <BNavItem class="section" id="community-item" to="/hub">
                    <BLink to="/hub">社区</BLink>
                </BNavItem>
                <BNavItem class="section" id="follow-item" to="/subscribe">
                    <BLink to="/subscribe">订阅</BLink>
                    <div class="isnew position-relative">           
                        <BBadge v-show="hasUnread" dot-indicator variant="danger" class="positon-absolute start" />
                    </div>
                </BNavItem>

            </BNavbarNav>
        </BContainer>
    </div>
</template>

<style lang="scss" scoped>
.navbar {
    padding: 0;
    background: rgba(254, 240, 215, 0.85);

    a {
        font-weight: bold;
    }

    .main-nav {
        .section {
            // 保持与激活态相同的宽度，使用 transparent 避免布局抖动
            border-bottom: 2.5px solid transparent;
            transition: border-color 0.2s;

            .router-link-active {
                border-bottom: 2.5px solid firebrick;
                color: firebrick !important;
            }
        }
    }
}
</style>