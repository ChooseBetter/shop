<template>
  <div class="detail-action">
    <div class="state">
      <span
        class="iconfont"
        :class="[`icon-order-${orderStatus[order.orderState].name}`]"
      ></span>
      <p>{{ orderStatus[order.orderState].label }}</p>
    </div>
    <div class="info">
      <p>订单编号：{{ order.id }}</p>
      <p>下单时间：{{ order.createTime }}</p>
    </div>
    <div class="btn">
      <!-- 待付款 -->
      <template v-if="order.orderState === 1">
        <XtxButton
          @click="$router.push('/member/pay?id=' + order.id)"
          type="primary"
          size="small"
        >
          立即付款
        </XtxButton>
        <XtxButton @click="handlerCancel(order)" type="gray" size="small">
          取消订单
        </XtxButton>
      </template>
      <!-- 待发货 -->
      <template v-if="order.orderState === 2">
        <XtxButton
          @click="$router.push(`/member/checkout?orderId=${order.id}`)"
          type="primary"
          size="small"
        >
          再次购买
        </XtxButton>
      </template>
      <!-- 待收货 -->
      <template v-if="order.orderState === 3">
        <XtxButton @click="handlerConfirm(order)" type="primary" size="small">
          确认收货
        </XtxButton>
        <XtxButton
          @click="$router.push(`/member/checkout?orderId=${order.id}`)"
          type="plain"
          size="small"
        >
          再次购买
        </XtxButton>
      </template>
      <!-- 待评价 -->
      <template v-if="order.orderState === 4">
        <XtxButton
          @click="$router.push(`/member/checkout?orderId=${order.id}`)"
          type="primary"
          size="small"
        >
          再次购买
        </XtxButton>
        <XtxButton type="plain" size="small">评价商品</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 已完成 -->
      <template v-if="order.orderState === 5">
        <XtxButton
          @click="$router.push(`/member/checkout?orderId=${order.id}`)"
          type="primary"
          size="small"
        >
          再次购买
        </XtxButton>
        <XtxButton type="plain" size="small">查看评价</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 已取消 -->
    </div>
    <!-- 取消订单组件 -->
    <Teleport to="#model">
      <OrderCancel ref="logisticsOrderCom" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref} from "vue";
import {orderStatus} from "@/api/constants";
import OrderCancel from "../../components/order-cancel";
import Confirm from "@/components/library/Confirm";
import Message from "@/components/library/Message";
import {orderType} from "@/views/member/order/types";
import {confirmOrder} from "@/api/order";
const props = defineProps({
  order: {
    type: Object,
    default: () => ({}),
  },
});

// 取消订单
const logisticsOrderCom: any = ref(null);
const handlerCancel = (order: orderType) => {
  logisticsOrderCom.value.open(order);
};

// 确认收货
const handlerConfirm = (order: orderType) => {
  Confirm({text: "请在确保商品无误后，点击收货!"}).then(() => {
    confirmOrder(order.id).then(() => {
      Message({type: "success", text: "确认收货成功"});
      // 待收货->待评价
      order.orderState = 4;
    });
  });
};
</script>

<style scoped lang="less">
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .xtx-button {
      margin-left: 20px;
    }
  }
}
</style>
