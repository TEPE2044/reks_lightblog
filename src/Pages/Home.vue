<script setup lang="ts">
import Recommand from "../UI/Recommand.vue";
import Caro from "../UI/Caro.vue";
import Aside from "../Components/Aside.vue";
</script>

<template>
  <BContainer class="home">
    <div class="home-main mt-2">
      <div class="home-caro mt-4">
        <Caro/>

         <figure class="text-center mt-3">
          <blockquote class="blockquote">
            <p style="color: #660909">ReKindle Everything</p>
          </blockquote>
        </figure>
        <div class="d-flex gap-2 align-items-center flex-column mb-3">
          <h2 class="text-center" style="font-family: Alibaba-PuHuiTi-Bold,sans-serif">
            欢迎来到ReKindlers!</h2>
        </div>


      </div>

      <div class="home-recommand mt-4">
        <Recommand />
      </div>
    </div>

    <div class="home-aside">
      <Aside />
    </div>


  </BContainer>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.home {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;

  .home-main {
    //sizes
    width: 847px;
    //layout
    display: flex;
    flex-direction: column;
    justify-content: center;

    .home-caro {
      @extend %reks-card-box;
    }

    .home-recommand {
      @extend %reks-card-box;
    }

  }

  .home-aside {
    width: 351px;
  }
}
</style>