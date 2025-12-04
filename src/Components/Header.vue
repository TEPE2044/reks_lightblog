<script setup lang="ts">
import SearchBar from "../UI/SearchBar.vue";

// interface ToolItem {
//     content: string;
//     classname: string;
// }

// const toolList: ToolItem[] = [
//     {
//         content: "投稿",
//         classname: 'contribute'
//     },
//     {
//         content: "消息",
//         classname: 'message'
//     },
//     {
//         content: "帮助",
//         classname: 'question'
//     }
// ]
</script>

<template>
  <div class="header bg-image-layer">
    <div class="bg-color-layer">
      <BContainer class="header-content d-flex flex-row align-items-center gap-5">
        <!--      左侧Header-->
        <div class="header-left d-flex flex-row align-items-center gap-4">
          <!--        Logo部分-->
          <div class="label d-flex flex-row align-items-center">
            <div class="icon">
              <img src="/reks.svg" alt="profile" class="rounded-circle" width="35" height="auto" />
            </div>
            <div class="logo">
              <router-link class="logo-font" to="/home">ReKindlers</router-link>
            </div>
          </div>

        </div>
        <!--      右侧Header-->
        <div class="header-right d-flex flex-row align-items-center gap-4">
          <div class="search-bar offset-1">
            <SearchBar />
          </div>
          <!-- <div class="signIn-btn">
            <BAvatar size="3rem" class="avatar" variant="light" />
          </div> -->
        </div>
      </BContainer>
    </div>
  </div>

  <div class="home-navbar">
    <Navbar></Navbar>
  </div>
</template>

<style scoped lang="scss">
@use "../Asset/CustomStyle/open-font.scss";

.logo-font {
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
  font-style: oblique;
  font-size: x-large;
  display: inline-block;
  font-display: swap;
}

.header {
  width: 100%;
  height: 60px;
  /* bg-image-layer */
  background-image: url("/melo.webp");
  background-position: center 115rem;

  .bg-color-layer {
    width: 100%;
    height: 100%;
    background-color: #f9ebd1c5;
  }

  .header-content {
    border-bottom: 1px solid rgba(15, 15, 15, 0.144);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    .header-right {
      //float在flex中无效，使用margin-left自动撑开
      margin-left: auto;
      //微调方式
      margin-right: 4rem;

      .avatar {
        border: 0.3px solid rgba(128, 128, 128, 0.21);
      }
    }

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
</style>
