<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a
        @click="toggle(-1)"
        href="javascript:;"
        class="iconfont icon-angle-left prev"
        :class="{disabled: index == 0}"
      ></a>
      <a
        @click="toggle(1)"
        href="javascript:;"
        class="iconfont icon-angle-right next"
        :class="{disabled: index == 1}"
      ></a>
    </template>
    <div ref="target" class="box">
      <transition>
        <ul
          v-if="brands.length"
          class="list"
          :style="{transform: `translateX(${-index * 1240}px)`}"
        >
          <li v-for="item in brands" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" alt="" />
            </RouterLink>
          </li>
        </ul>
        <div v-else class="skeleton">
          <XtxSkeleton
            class="item"
            v-for="i in 5"
            :key="i"
            animated
            bg="#e4e4e4"
            width="240px"
            height="305px"
          />
        </div>
      </transition>
    </div>
  </HomePanel>
</template>
<script setup lang="ts">
import {ref} from "vue";

import HomePanel from "../home-panel";

import {findBrand} from "@/api/home";
import {useLazyData} from "@/hooks";

//获取品牌数据
let brands = ref([]);
const {result, target} = useLazyData(() => findBrand(10));
brands = result;

//切换效果,前提只有0 1 两页
const index = ref(0);
const toggle = (step: number) => {
  const newIndex = index.value + step;
  if (newIndex < 0 || newIndex > 1) return;
  index.value = newIndex;
};
</script>

<style scoped lang="less">
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
.skeleton {
  width: 100%;
  display: flex;
  .item {
    margin-right: 10px;
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}
</style>
