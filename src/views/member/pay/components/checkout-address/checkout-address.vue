<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!checkoutAddress" class="none">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-if="checkoutAddress">
        <li>
          <span>收<i />货<i />人：</span>{{ checkoutAddress.receiver }}
        </li>
        <li>
          <span>联系方式：</span
          >{{
            checkoutAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/, "$1****$2")
          }}
        </li>
        <li>
          <span>收货地址：</span>
          {{ checkoutAddress.fullLocation }}
          {{ checkoutAddress.address }}
        </li>
      </ul>
      <a
        @click="openAddressEdit(checkoutAddress)"
        v-if="checkoutAddress"
        href="javascript:;"
        >修改地址</a
      >
    </div>
    <div class="action">
      <XtxButton @click="openDialog" class="btn">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
    </div>
  </div>
  <!-- 地址切换 -->
  <XtxDialog title="切换收货地址" v-model:visible="visibleDialog">
    <div
      @click="selectedAddress = item"
      :class="{active: selectedAddress && item.id === selectedAddress.id}"
      v-for="item in list"
      :key="item.id"
      class="text item"
    >
      <ul>
        <li>
          <span>收<i />货<i />人：</span>{{ item.receiver }}
        </li>
        <li>
          <span>联系方式：</span
          >{{ item.contact.replace(/^(\d{3})\d{4}(\d{4})/, "$1****$2") }}
        </li>
        <li>
          <span>收货地址：</span
          >{{ item.fullLocation.replace(/ /g, "") + item.address }}
        </li>
      </ul>
    </div>
    <template #footer>
      <XtxButton
        @click="visibleDialog = false"
        type="gray"
        style="margin-right: 20px"
      >
        取消
      </XtxButton>
      <XtxButton @click="confirmAddress" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 添加编辑地址 -->
  <AddressEdit @on-success="successHandler" ref="addressEditCom" />
</template>

<script setup lang="ts">
import {ref, defineProps, defineEmits} from "vue";
import AddressEdit from "../address-edit";
import {addressType} from "@/views/member/pay/types";
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
const emits = defineEmits(["change"]);
const checkoutAddress: any = ref(null);

// 默认地址
const defaultAddress = props.list.find((item: any) => item.isDefault === 0);
if (defaultAddress) {
  checkoutAddress.value = defaultAddress;
} else {
  if (props.list.length) {
    checkoutAddress.value = JSON.parse(JSON.stringify(props.list[0]));
  }
}

// 将地址id传递给父组件
emits("change", checkoutAddress.value?.id);

// 对话框显示隐藏
const visibleDialog = ref(false);
// 当前选中的地址id
const selectedAddress: any = ref(null);
// 切换地址
const confirmAddress = () => {
  checkoutAddress.value = selectedAddress.value;
  visibleDialog.value = false;
  emits("change", selectedAddress.value?.id);
};

const openDialog = () => {
  selectedAddress.value = null;
  visibleDialog.value = true;
};

// 打开添加编辑收货地址
const addressEditCom: any = ref(null);
const openAddressEdit = (address: addressType) => {
  // 添加时空对象，修改时数据
  addressEditCom.value.open(address);
};

// 添加/修改地址成功的回调,修改收货地址的数组
const successHandler = (formData: any) => {
  const address: any = props.list.find((item: any) => item.id === formData.id);
  if (address) {
    for (const key in address) {
      address[key] = formData[key];
    }
    // 修改默认地址
    checkoutAddress.value = address;
  } else {
    const jsonStr = JSON.stringify(formData);
    const userAddresses = props.list;
    userAddresses.unshift(JSON.parse(jsonStr));
    checkoutAddress.value = defaultAddress;
  }
};
</script>

<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
