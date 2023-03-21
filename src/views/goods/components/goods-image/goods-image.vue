<template>
  <div class="goods-image">
    <!-- 大图 -->
    <div
      v-show="show"
      class="large"
      :style="[{backgroundImage: `url(${images[currIndex]})`}, largePosition]"
    ></div>
    <!-- 中图 -->
    <div ref="target" class="middle">
      <img :src="images[currIndex]" alt="" />
      <!-- 遮罩色块 -->
      <div v-show="show" class="layer" :style="layerPosition"></div>
    </div>
    <!-- 小图 -->
    <ul class="small">
      <li
        v-for="(img, index) in images"
        :key="img"
        :class="{active: index === currIndex}"
      >
        <img @mouseenter="currIndex = index" :src="img" alt="" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {useMouseInElement} from "@vueuse/core";
import {ref, defineProps, reactive, watch} from "vue";
const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
});
const currIndex = ref(0);

//显示遮罩和大图
const show = ref(false);
//遮罩的坐标
const layerPosition = reactive({
  left: "0px",
  top: "0px",
});
//大图背景定位
const largePosition = reactive({
  backgroundPositionX: "0px",
  backgroundPositionY: "0px",
});

//计算遮罩定位和大图定位
const target = ref(null);
const {elementX, elementY, isOutside} = useMouseInElement(target);
watch([elementX, elementY, isOutside], () => {
  show.value = !isOutside.value;
  const position = {x: 0, y: 0};

  if (elementX.value < 100) position.x = 0;
  else if (elementX.value > 300) position.x = 200;
  else position.x = elementX.value - 100;

  if (elementY.value < 100) position.y = 0;
  else if (elementY.value > 300) position.y = 200;
  else position.y = elementY.value - 100;

  layerPosition.left = position.x + "px";
  layerPosition.top = position.y + "px";
  largePosition.backgroundPositionX = -2 * position.x + "px";
  largePosition.backgroundPositionY = -2 * position.y + "px";
});
</script>

<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
