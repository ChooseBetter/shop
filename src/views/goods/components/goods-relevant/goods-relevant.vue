<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon" />
      <span class="title">{{ goodsId ? "同类商品推荐" : "猜你喜欢" }}</span>
    </div>
    <!-- 此处使用改造后的xtx-carousel.vue -->
    <XtxCarousel :sliders="sliders" style="height: 380px" auto-play>
      <template #default="{item}">
        <div class="slider">
          <RouterLink
            v-for="goods in item"
            :key="goods.id"
            :to="`/product/${goods.id}`"
          >
            <img :src="goods.picture" alt="" />
            <p class="name ellipsis">{{ goods.name }}</p>
            <p class="price">&yen;{{ goods.price }}</p>
          </RouterLink>
        </div>
      </template>
    </XtxCarousel>
  </div>
</template>
<script setup lang="ts">
import {ref, defineProps} from "vue";
import {findrelevantGoods} from "@/api/goods";
const props = defineProps({
  goodsId: {
    type: String,
    default: "",
  },
});
const sliders: any = ref([]);
findrelevantGoods({id: props.goodsId}).then((data: any) => {
  const pageSize = 4;
  const pageCount = Math.ceil(data.result.length / pageSize);
  for (let i = 0; i < pageCount; i++) {
    sliders.value.push(data.result.slice(pageSize * i, pageSize * (i + 1)));
  }
});
</script>

<style scoped lang="less">
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      font-size: 20px;
      padding-left: 10px;
    }
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @xtxColor;
      border-right: 4px solid @xtxColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@xtxColor, 40%);
      }
    }
  }
}
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    img {
      padding: 20px;
      width: 230px !important;
      height: 230px !important;
    }
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
:deep(.xtx-carousel) {
  height: 380px;
  .carousel {
    &-indicator {
      bottom: 30px;
      span {
        &.active {
          background: @xtxColor;
        }
      }
    }
    &-btn {
      top: 110px;
      opacity: 1;
      background: rgba(0, 0, 0, 0);
      color: #ddd;
      i {
        font-size: 30px;
      }
    }
  }
}
</style>
