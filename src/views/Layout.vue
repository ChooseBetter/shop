<template>
  <NavBar />
  <Header />
  <HeaderSticky />
  <div class="main">
    <router-view />
  </div>
  <Footer />
</template>

<script setup lang="ts">
import NavBar from "@/components/navbar";
import HeaderSticky from "@/components/header-sticky";
import Header from "@/components/header";
import Footer from "@/components/footer";

import useStore from "@/store/index";

const {categoryStore} = useStore();
categoryStore.getCategory();
</script>

<style scoped></style>
