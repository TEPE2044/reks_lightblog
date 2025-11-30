<script setup lang="ts">
import Recommand from '../Layouts/Recommand.vue';
import Caro from '../UI/Caro.vue';
import ProfileCard from '../UI/ProfileCard.vue';



</script>

<template>
  <div class="home">
    <BContainer class="home-header mt-2">
      <div class="activities-caro">
        <Caro />
      </div>

      <div class="profilecard">
        <ProfileCard />
      </div>
    </BContainer>

    <BContainer class="home-content mt-4">
      <Recommand />
    </BContainer>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.home {
  .home-header {
    display: grid;
    grid-template-areas:
      "caro profilecard aside";
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    padding: 0;

    .activities-caro {
      grid-area: caro;
       height: 100%;
    }

    .profilecard {
      grid-area: profilecard;
       height: 100%;
    }
  }
}
</style>