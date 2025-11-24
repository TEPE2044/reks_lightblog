<script setup lang="ts">
import SearchBar from "../UI/SearchBar.vue";
import ProfileCard from "../UI/ProfileCard.vue";

interface ToolItem {
    content: string;
    classname: string;
}


const toolList: ToolItem[] = [
    {
        content: "投稿",
        classname: 'contribute'
    },
    {
        content: "消息",
        classname: 'message'
    },
    {
        content: "帮助",
        classname: 'question'
    }
]
</script>

<template>
    <div class="header">
        <!-- 图片层 -->
        <div class="header-img-wrapper">
            <BImg class="header-img" src="/melo.webp"></BImg>
        </div>

        <!--    内容层-->
        <BContainer class="header-content d-flex flex-row gap-5 align-items-center">
            <!--      左半部分-->
            <div class="left d-flex flex-row gap-4">
                <!--        Logo部分-->
                <div class="label d-flex flex-row gap-2">
                    <div class="icon">
                        <img src="/reks.svg" alt="profile" class="rounded-circle" width="38" height="38" />
                    </div>
                    <h4 class="logo mt-2">
                        <router-link to="/home">ReKindlers</router-link>
                    </h4>
                </div>
                <!--        主导航栏-->
                <BNavbarNav class="main-nav flex-row gap-4 align-items-center">
                    <BNavItem id="home-item">
                        <router-link to="/home">首页</router-link>
                    </BNavItem>
                    <BNavItem id="community-item">
                        <router-link to="/hub">社区</router-link>
                    </BNavItem>
                    <BNavItemDropdown id="more-dropdown" no-caret>
                        <template #button-content>
                            更多
                        </template>
                        <BDropdownItem>熵减阁</BDropdownItem>
                        <BDropdownItem>敬请期待！</BDropdownItem>
                    </BNavItemDropdown>
                </BNavbarNav>
            </div>
            <!--      中间部分-->
            <div class="search-bar offset-1">
                <SearchBar />
            </div>
            <!--      右边部分-->
            <!-- TODO 即将移除 转移到左下方-->
            <BNavbarNav class="tool-lists flex-row gap-4 align-items-center">
                <BNavItem :class="item.classname" class="d-flex flex-column tool-item align-items-center"
                    v-for="item in toolList" :key="item.classname">
                    <div class="content">{{ item.content }}</div>
                </BNavItem>
            </BNavbarNav>
            <div class="profile mx-4 mb-1 float-end position-absolute end-0 bottom-2">
                <ProfileCard />
            </div>
        </BContainer>
    </div>
</template>

<style scoped lang="scss">
.header {
    padding: 0;
    margin: 0;
    position: relative;
    height: 70px;
    overflow: visible; // 保持visible，防止dropdown被裁剪
    // fix：剪裁图片
    .header-img-wrapper {
        position: absolute;
        width: 100%;
        height: 70px; 
        overflow: hidden; // 只裁剪图片
        z-index: 1;
    }

    .header-img {
        position: absolute;
        object-position: 4rem -18rem;
        object-fit: cover;
    }

    .header-content {
        position: relative;
        z-index: 3;
        padding-top: 0.75rem;

        .nav-item {
            cursor: pointer;

            &:hover {
                color: firebrick;
            }
        }

        .tool-item {
            cursor: pointer;

            &:hover {
                color: firebrick;
            }
        }
    }
}

.header::before {
    content: "";
    position: absolute;
    inset: 0;
    background: #f9ebd1;
    opacity: 0.8;
    z-index: 3;
}

.dropdown-menu,
.b-dropdown .dropdown-menu {
    z-index: 2000;
}
</style>