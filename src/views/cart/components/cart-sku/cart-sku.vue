<template>
  <div ref="target" class="cart-sku">
    <div class="attrs" @click="toggle">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <div v-if="loading" class="loading"></div>
      <GoodsSku @change="changeSku" v-else :skuId="skuId" :goods="goods" />
      <XtxButton
        v-if="!loading"
        @click="submit"
        type="primary"
        size="mini"
        style="margin-left: 60px"
      >
        确认
      </XtxButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, defineProps, defineEmits} from "vue";
import {onClickOutside} from "@vueuse/core";
import {getSpecsAndSkus} from "@/api/cart";
import GoodsSku from "@/views/goods/components/goods-sku";
const props = defineProps({
  attrsText: {
    type: String,
    default: "",
  },
  skuId: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["change"]);
const visible = ref(false);
const loading = ref(true);
const goods = ref(null);

// const result: any = ref({
//   specs: [
//     {
//       name: "尺码",
//       values: [
//         {
//           name: "43",
//           valueName: "43",
//           picutre: null,
//           available: null,
//           desc: "男鞋-销售属性尺码-43-规格",
//         },
//         {
//           name: "42",
//           valueName: "42",
//           picutre: null,
//           available: null,
//           desc: "男鞋-销售属性尺码-43-规格",
//         },
//       ],
//     },
//   ],
//   skus: [
//     {
//       id: "300485524",
//       skuCode: "109311007",
//       price: 271.0,
//       oldPrice: 339.0,
//       inventory: 243,
//       specs: [
//         {
//           name: "尺码",
//           valueName: "43",
//         },
//       ],
//     },
//     {
//       id: "109311008",
//       skuCode: "109311008",
//       price: 271.0,
//       oldPrice: 339.0,
//       inventory: 243,
//       specs: [
//         {
//           name: "尺码",
//           valueName: "42",
//         },
//       ],
//     },
//   ],
// });
// goods.value = result.value;

const open = async () => {
  await getSpecsAndSkus(props.skuId).then((data) => {
    goods.value = data.result;
    loading.value = false;
  });
  visible.value = true;
};
const close = () => {
  visible.value = false;
};
const toggle = () => {
  visible.value ? close() : open();
};
const target = ref(null);
onClickOutside(target, () => {
  close();
});

// 监听sku
const currSku: any = ref(null);
const changeSku = (sku: object) => {
  currSku.value = sku;
};
// 提交sku
const submit = () => {
  if (
    currSku.value &&
    currSku.value.skuId &&
    currSku.value.skuId !== props.skuId
  ) {
    emits("change", currSku.value);
    close();
  }
};
</script>

<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
