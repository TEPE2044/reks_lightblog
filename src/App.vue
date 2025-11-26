<!-- App.vue -->
<template>
  <BApp>
    <header>
      <Header/>
    </header>
    <main>
      <MainLayout/>
    </main>
    <footer>
      <Footer/>
    </footer>
  </BApp>
</template>

<script setup lang="ts">
import {BApp} from 'bootstrap-vue-next'
import Header from "./Components/Header.vue";
import MainLayout from "./Layouts/MainLayout.vue";
import Footer from "./Components/Footer.vue";
</script>

<style lang="scss" scoped>
main {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(254, 249, 239);
  background-image: linear-gradient(62deg, rgba(245, 222, 179, 0.43) 0%, rgba(245, 222, 179, 0.31) 100%)
}
</style>
