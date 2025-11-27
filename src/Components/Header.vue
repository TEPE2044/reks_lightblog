<script setup lang="ts">
import SearchBar from "../UI/SearchBar.vue";
import SignIn from "../UI/SignIn.vue";

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
          <div class="label d-flex flex-row align-items-center gap-2">
            <div class="icon">
              <img src="/reks.svg" alt="profile" class="rounded-circle" width="38" height="38" />
            </div>
            <h4 class="logo mt-2">
              <router-link to="/home">ReKindlers</router-link>
            </h4>
          </div>

        </div>
        <!--      右侧Header-->
        <div class="header-right d-flex flex-row align-items-center gap-4">
          <div class="search-bar offset-1">
            <SearchBar />
          </div>
          <div class="signIn-btn">
            <SignIn />
          </div>
        </div>
      </BContainer>
    </div>
  </div>

   <div class="home-navbar">
      <Navbar></Navbar>
    </div>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 60px;
  /* bg-image-layer */
  background-image: url("/melo.webp");
  background-size: fill;
  background-position: center;

  .bg-color-layer {
    width: 100%;
    height: 100%;
    background-color: rgba(240, 216, 171, 0.84);
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
