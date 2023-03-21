<template>
  <div class="detail-logistics">
    <p>
      <span>{{ list[0].text }}</span>
      <span>{{ list[0].time }}</span>
    </p>
    <a href="javascript:;">查看物流</a>
  </div>
</template>
<script lang="ts">
import {ref, defineProps} from "vue";
import {logisticsOrder} from "@/api/order";
export default {
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
  },
  async setup(props:any) {
    const data = await logisticsOrder(props.order.id);
    const list = ref(data.result.list);
    return {list};
  },
};
// const props = defineProps({
//   order: {
//     type: Object,
//     default: () => ({}),
//   },
// });
// const data = await logisticsOrder(props.order.id);
</script>

<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
