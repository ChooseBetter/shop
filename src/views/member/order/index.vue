<template>
  <div class="member-order-page">
    <!-- tab组件 -->
    <XtxTabs :tabPanel="orderStatus" v-model="activeName" @tabClick="tabClick">
      <template v-for="item in orderStatus" :key="item.name">
        <XtxTabsPanel :name="item.name" :label="item.label"> </XtxTabsPanel>
      </template>
    </XtxTabs>
    <!-- 订单列表 -->
    <div class="order-list" v-if="orderList">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem
        @on-cancel="handlerCancel"
        @on-delete="handlerDelete"
        @on-confirm="handlerConfirm"
        @on-logistics="handlerLogistics"
        v-for="item in orderList"
        :key="item.id"
        :order="item"
      />
    </div>
    <!-- 分页组件 -->
    <XtxPagination
      v-if="total > 0"
      :current-page="reqParams.page"
      :page-size="reqParams.pageSize"
      :total="total"
      @current-change="reqParams.page = $event"
    />
    <!-- 取消原因组件 -->
    <Teleport to="#model">
      <OrderCancel ref="orderCancelCom" />
    </Teleport>
    <!-- 查看物流组件 -->
    <OrderLogistics ref="orderLogisticsCom" />
  </div>
</template>

<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {orderStatus} from "@/api/constants";
import OrderItem from "./components/order-item";
import OrderCancel from "./components/order-cancel";
import OrderLogistics from "./components/order-logistics";
import {confirmOrder, delteOrder, findOrderList} from "@/api/order";
import {OrderListType} from "@/api/types";
import {tabClickType, orderType} from "@/views/member/order/types";
import Confirm from "@/components/library/Confirm";
import Message from "@/components/library/Message";

// 选中的tab
const activeName = ref("all");
// 获取数据
const reqParams: OrderListType = reactive({
  page: 1,
  pageSize: 5,
  orderState: 0,
});
const orderList = ref([]);
const loading = ref(false);
const total = ref(0);

const getOrderListFn = () => {
  loading.value = true;
  findOrderList(reqParams).then((data) => {
    orderList.value = data.result.items;
    total.value = data.result.counts;
    loading.value = false;
  });
};
watch(
  reqParams,
  () => {
    getOrderListFn();
  },
  {immediate: true}
);

// tabs修改的回调
const tabClick = ({name, index}: tabClickType) => {
  reqParams.page = 1;
  reqParams.orderState = index;
};

// 取消订单
const orderCancelCom: any = ref(null);
const handlerCancel = (order: orderType) => {
  orderCancelCom.value.open(order);
};

// 删除订单
const handlerDelete = (order: orderType) => {
  Confirm({text: "确认删除该订单吗？"}).then((data) => {
    delteOrder([order.id]).then(() => {
      Message({type: "success", text: "删除订单成功"});
      getOrderListFn();
    });
  });
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

// 查看物流
const orderLogisticsCom: any = ref(null);
const handlerLogistics = (order: orderType) => {
  orderLogisticsCom.value.open(order);
};
</script>

<style scoped lang="less">
.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
}
.loading {
  height: 100%;
  width: 100%;
  min-height: 400px;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
