<script lang="ts" setup>

</script>

<template>
    <div class="navbar">
        <BContainer>
            <BNavbarNav class="main-nav flex-row gap-4 align-items-center">
                <BNavItem class="section" id="home-item" to="/home">
                    <BLink to="/home">首页</BLink>
                </BNavItem>
                <BNavItem class="section" id="community-item" to="/hub">
                      <BLink to="/hub">社区</BLink>
                </BNavItem>
            </BNavbarNav>
        </BContainer>
    </div>
</template>

<style lang="scss" scoped>
.navbar {
    background: rgba(245, 222, 179, 0.3);

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