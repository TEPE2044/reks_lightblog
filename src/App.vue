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
</style>
