<template>
  <div class="detail-steps" style="padding: 20px" v-if="order">
    <XtxSteps :active="order.orderState === 6 ? 1 : order.orderState">
      <XtxStepsItem
        v-for="(item, index) in orderProgress"
        :key="item"
        :index="index"
        :title="item"
        :desc="order.createTime"
      />
    </XtxSteps>
  </div>
</template>

<script setup lang="ts">
import {defineProps} from "vue";
import {orderProgress} from "@/api/constants";
const props = defineProps({
  order: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style scoped lang="less">
.detail-step {
  padding: 20px;
}
</style>
