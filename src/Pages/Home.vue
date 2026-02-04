<script setup lang="ts">




</script>

<template>
  <div class="home">
    <BContainer class="home-header">
      <div class="activities-caro">
        <Caro />
      </div>

      <div class="profilecard">
        <FastLogin />
      </div>
    </BContainer>
    <BContainer class="home-content mt-4">
        <ShowCase/>
        <ShowCase/>
      <div class="recommand">
         <Recommand />
      </div>
     
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
    @media (max-width: 1000px) {
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