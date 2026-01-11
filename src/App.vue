<script setup lang="ts">
import { BApp } from "bootstrap-vue-next";
import Header from "./Components/Header.vue";
import MainLayout from "./Layouts/MainLayout.vue";
import Footer from "./Components/Footer.vue";
import Auth from "./Widgets/Auth.vue";
import MusicPlayer from "./Widgets/MusicPlayer.vue";

</script>
<!-- App.vue -->
<template>
  <BApp>
    <header>
      <Header/>
    </header>
    <main>
      <MainLayout />
    </main>
    <footer>
      <Footer />
      <MusicPlayer />
    </footer>
    <Teleport to="body">
      <Auth :show-trigger="false" />
    </Teleport>

  </BApp>
</template>



<style lang="scss" scoped>
header {
  /* layout */
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

main {
  flex: 1 0 auto;
  background-color: rgb(254, 249, 239);
  background-image: linear-gradient(62deg,
      rgba(245, 222, 179, 0.43) 0%,
      rgba(245, 222, 179, 0.31) 100%);
}
</style>
