<script setup lang="ts">
import Recommand from '../Layouts/Recommand.vue';
import Caro from '../UI/Caro.vue';
import ProfileCard from '../UI/ProfileCard.vue';



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
      "caro profilecard";
    grid-template-columns: 3fr 1fr;
    gap: 20px;

    .activities-caro {
      grid-area: caro;
    }

    .profilecard {
      grid-area: profilecard;
    }
  }
}
</style>