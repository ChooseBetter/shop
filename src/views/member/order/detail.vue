<template>
  <div class="order-detail-page" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order" />
    <!-- 步骤条-->
    <DetailStep :order="order" />
    <!-- 物流栏 -->
    <suspense>
      <template #default>
        <DetailLogistics
          v-if="[3, 4, 5].includes(order.orderState)"
          :order="order"
        />
      </template>
      <template #fallback>
        <div class="loading">loading</div>
      </template>
    </suspense>
    <!-- 订单商品信息 -->
    <DetailInfo :order="order" />
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRoute} from "vue-router";
import {findOrderDetail} from "@/api/order";
import DetailAction from "./components/detail-action";
import DetailStep from "./components/detail-step";
import DetailLogistics from "./components/detail-logistics";
import DetailInfo from "./components/detail-info";

const route: any = useRoute();
const order = ref(null);
findOrderDetail(route.params.id).then((data) => {
  order.value = data.result;
});
</script>

<style scoped lang="less">
.order-detail-page {
  background: #fff;
  height: 100%;
}
.loading {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
</style>
