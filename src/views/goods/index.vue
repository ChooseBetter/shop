<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">
          {{ goods.categories[1].name }}
        </XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">
          {{ goods.categories[0].name }}
        </XtxBreadItem>
        <XtxBreadItem>
          {{ goods.name }}
        </XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>
        <div class="spec">
          <!-- 名字区组件 -->
          <GoodsName :goods="goods" />
          <!-- 规格组件 -->
          <GoodsSku :goods="goods" @change="changeSku" />
          <!-- 数量选择 -->
          <XtxNumbox label="数量" v-model="num" :max="goods.inventory" />
          <XtxButton
            @click="insertCart"
            type="primary"
            style="margin-top: 20px"
          >
            加入购物车
          </XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :goodsId="goods.id" :type="1" />
          <GoodsHot :goodsId="goods.id" :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {nextTick, ref, watch, provide} from "vue";
import {useRoute} from "vue-router";
import {findGoods} from "@/api/goods";
import useStore from "@/store";
import GoodsRelevant from "./components/goods-relevant";
import GoodsImage from "./components/goods-image";
import GoodsSales from "./components/goods-sales";
import GoodsName from "./components/goods-name";
import GoodsSku from "./components/goods-sku";
import GoodsTabs from "./components/goods-tabs";
import GoodsHot from "./components/goods-hot";
import GoodsWarn from "./components/goods-warn";
import Message from "@/components/library/Message";

const goods: any = ref(null);
const route = useRoute();
const {cartStore} = useStore();
provide("goods", goods);
watch(
  () => route.params.id,
  (newValue) => {
    if (newValue && `/product/${newValue}` === route.path) {
      findGoods(route.params.id).then((data) => {
        // 让v-if组件能重新创建
        goods.value = null;
        nextTick(() => {
          goods.value = data.result;
        });
      });
    }
  },
  {immediate: true}
);

const currSku: any = ref(null);
const changeSku = (sku: any) => {
  if (sku.skuId) {
    goods.value.price = sku.price;
    goods.value.oldPrice = sku.oldPrice;
    goods.value.inventory = sku.inventory;
  }
  // 记录选择的sku
  currSku.value = sku;
};

const num = ref(1);
// 加入购物车
const insertCart = () => {
  //id skuId name attrsText picture price nowPrice selected stock count isEffective
  if (currSku.value && currSku.value.skuId) {
    const {skuId, specsText, inventory} = currSku.value;
    const {id, name, price, mainPictures} = goods.value;
    cartStore
      .useCart({
        skuId,
        attrsText: specsText,
        stock: inventory,
        id,
        name,
        price,
        nowPrice: price,
        picture: mainPictures[0],
        count: num.value,
        selected: true,
        isEffective: true,
      })
      .then(() => {
        Message({type: "success", text: "添加购物车成功"});
      });
  } else {
    Message({text: "请选择完整规格"});
  }
};
</script>

<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
