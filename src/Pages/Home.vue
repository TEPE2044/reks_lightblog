<script setup lang="ts">
import Recommand from "../UI/Recommand.vue";
import Caro from "../UI/Caro.vue";
import Aside from "../Components/Aside.vue";
</script>

<template>
    <BContainer class="home">
        <div class="home-main mt-5">
            <div class="news-caro mt-3">
                <Caro></Caro>
            </div>

            <div class="news-recommand mt-5">
                <div class="mt-5">
                    <Recommand />
                </div>

            </div>
        </div>

        <div class="home-aside mt-5">
            <Aside />
        </div>


    </BContainer>
</template>

<style lang="scss" scoped>
%decoration-card {
  background-color: #ffffffdb;
  border-radius: .5rem;
  box-shadow: 0 4px 10px #0000001a;
  padding: 2rem;
}

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
    //decoration
    @extend %decoration-card;
  }
  .home-aside {
    width: 351px;
    @extend %decoration-card;
  }
}
</style>