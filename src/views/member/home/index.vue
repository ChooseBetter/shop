<template>
  <div class="member-home">
    <!-- 概览 -->
    <HomeOverview />
    <!-- 收藏 -->
    <HomePanel title="我的收藏">
      <GoodsItem v-for="item in collectGoods" :key="item.id" :goods="item" />
    </HomePanel>
    <!-- 足迹 -->
    <HomePanel title="我的足迹">
      <GoodsItem v-for="item in collectGoods" :key="item.id" :goods="item" />
    </HomePanel>
    <!-- 猜你 -->
    <GoodsRelevant />
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import HomeOverview from "./components/home-overview";
import HomePanel from "./components/home-panel";
import GoodsRelevant from "@/views/goods/components/goods-relevant";
import GoodsItem from "@/views/category/components/goods-item";
import {findCollect} from "@/api/member";

// 调用模拟接口
const collectGoods = ref([]);
findCollect({page: 1, pageSize: 4}).then((data) => {
  collectGoods.value = data.result.items;
});
</script>

<style scoped lang="less">
:deep(.xtx-carousel) .carousel-btn.prev {
  left: 5px;
}
:deep(.xtx-carousel) .carousel-btn.next {
  right: 5px;
}
</style>
