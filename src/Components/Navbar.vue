<script lang="ts" setup>

</script>

<template>
    <div class="navbar">
        <BContainer>
            <BNavbarNav class="main-nav flex-row gap-4 align-items-center">
                <BNavItem class="section" id="home-item">
                    <BLink to="/home">首页</BLink>
                </BNavItem>
                <BNavItem class="section" id="community-item">
                    <BLink to="/hub">社区</BLink>
                </BNavItem>
            </BNavbarNav>
        </BContainer>
    </div>
</template>

<style lang="scss" scoped>
.navbar {
    background: rgba(255, 254, 254, 0.779);

    .main-nav {
        .section {
            // 默认样式
            border-bottom: 2px solid transparent;
            transition: border-color 0.2s;

            .router-link-active {
                border-bottom: 2.5px solid firebrick;
                color: firebrick !important;
            }
        }
    }
}
</style>