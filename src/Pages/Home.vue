<script setup lang="ts">
import Recommand from '../Layouts/Recommand.vue';
import Caro from '../UI/Caro.vue';
import ProfileCard from '../UI/ProfileCard.vue';
import ShowCase from '../UI/ShowCase.vue';



</script>

<template>
  <div class="home">
    <BContainer class="home-header">
      <div class="activities-caro">
        <Caro />
      </div>

      <div class="profilecard">
        <ProfileCard />
      </div>
    </BContainer>
    <BContainer class="home-content mt-4">
      <ShowCase/>
      <!-- TODO:横向滚动盒子 -->
      <Recommand />
    </BContainer>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.home {
  .home-header {
    margin-top: 7.3rem;
    display: grid;
    grid-template-areas:
      "profilecard caro";
    grid-template-columns: 1fr 4fr;
    gap: 20px;
    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
    }
    .activities-caro {
      grid-area: caro;
    }

    .profilecard {
      grid-area: profilecard;
    }
  }
}
</style>