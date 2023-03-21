<template>
  <div class="home-hot">
    <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
      <div ref="target" style="position: relative; height: 406px">
        <transition name="fade">
          <ul v-if="list.length" ref="pannel" class="goods-list">
            <li v-for="item in list" :key="item.id">
              <RouterLink to="/">
                <img :src="item.picture" alt="" />
                <p class="name">{{ item.title }}</p>
                <p class="desc">{{ item.alt }}</p>
              </RouterLink>
            </li>
          </ul>
          <HomeSkeleton bg="#f0f9f4" v-else />
        </transition>
      </div>
    </HomePanel>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

import {findHot} from "@/api/home";
import {useLazyData} from "@/hooks";

import HomePanel from "../home-panel";
import HomeSkeleton from "../home-skeleton";

let list = ref([]);
const {result, target} = useLazyData(findHot);
list = result;
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
