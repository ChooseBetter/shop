<template>
  <XtxDialog
    :title="`${formData.id ? '修改' : '添加'}收货地址`"
    v-model:visible="visibleDialog"
  >
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input
              v-model="formData.receiver"
              class="input"
              placeholder="请输入收货人"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input
              v-model="formData.contact"
              class="input"
              placeholder="请输入手机号"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity
              :fullLocation="formData.fullLocation"
              @changeAddress="changeAddress"
              placeholder="请选择所在地区"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input
              v-model="formData.address"
              class="input"
              placeholder="请输入详细地址"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input
              v-model="formData.postalCode"
              class="input"
              placeholder="请输入邮政编码"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input
              v-model="formData.addressTags"
              class="input"
              placeholder="请输入地址标签，逗号分隔"
            />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <XtxButton
        @click="visibleDialog = false"
        type="gray"
        style="margin-right: 20px"
        >取消</XtxButton
      >
      <XtxButton @click="submit" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script setup lang="ts">
import {ref, defineExpose, reactive, defineEmits} from "vue";
import {addAddress, editAddress} from "@/api/order";
import Message from "@/components/library/Message";
import {addressType} from "@/views/member/pay/types";

const emits = defineEmits(["on-success"]);

const visibleDialog = ref(false);
const open = (address: any) => {
  visibleDialog.value = true;
  if (address.id) {
    for (const key in formData) {
      formData[key] = address[key];
    }
  } else {
    for (const key in formData) {
      if (key == "isDefault") {
        formData[key] = 1;
      } else {
        formData[key] = null;
      }
    }
  }
};
const formData: any = reactive({
  id: null,
  receiver: null,
  contact: null,
  provinceCode: null,
  cityCode: null,
  countyCode: null,
  address: null,
  postalCode: null,
  addressTags: null,
  isDefault: 1,
  fullLocation: null,
});

// 城市选择
const changeAddress = (result: any) => {
  formData.provinceCode = result.provinceCode;
  formData.cityCode = result.cityCode;
  formData.countyCode = result.countyCode;
  formData.fullLocation = result.fullLocation;
};

// 提交
const submit = () => {
  if (formData.id) {
    editAddress(formData).then((data) => {
      Message({text: "修改收货地址成功", type: "success"});
      visibleDialog.value = false;
      emits("on-success", formData);
    });
  } else {
    addAddress(formData).then((data) => {
      formData.id = data.result.id;
      Message({text: "添加收货地址成功", type: "success"});
      visibleDialog.value = false;
      emits("on-success", formData);
    });
  }
};

defineExpose({
  visibleDialog,
  open,
});
</script>

<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
