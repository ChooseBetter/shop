<template>
  <div class="container">
    <!-- 首页入口 -->
    <div class="home-entry">
      <!-- 左侧分类 -->
      <HomeCategory />
      <!-- 轮播图 -->
      <HomeBanner />
      <!-- 新鲜好物 -->
      <HomeNew />
      <!-- 人气推荐 -->
      <HomeHot />
      <!-- 热门品牌 -->
      <HomeBrand />
      <!-- 商品区域 -->
      <HomeProduct />
      <!-- 最新专题 -->
      <HomeSpecial />
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeCategory from "./components/home-category";
import HomeBanner from "./components/home-banner";
import HomeNew from "./components/home-new";
import HomeHot from "./components/home-hot";
import HomeBrand from "./components/home-brand";
import HomeProduct from "./components/home-product";
import HomeSpecial from "./components/home-special";
</script>

<style scoped lang="less"></style>
