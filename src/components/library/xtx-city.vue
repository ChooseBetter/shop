<template>
  <div ref="target" class="xtx-city">
    <div class="select" @click="toggleDialog" :class="{active}">
      <span v-if="!fullLocation" class="placeholder">{{ placeholder }}</span>
      <span v-else class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="active">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span
          class="ellipsis"
          @click="changeAddress(item)"
          v-for="item in currList"
          :key="item.code"
        >
          {{ item.name }}
        </span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, defineProps, reactive, defineEmits, toRefs} from "vue";
import {onClickOutside} from "@vueuse/core";
import axios from "axios";
import {AddressResultType} from "./types";

const props = defineProps({
  fullLocation: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "请选择配送地址",
  },
});
const emits = defineEmits(["changeAddress"]);
const active = ref(false);
const allCityData: any = ref([]);
const loading = ref(false);
const openDialog = () => {
  active.value = true;
  loading.value = true;
  getCityData().then((data) => {
    allCityData.value = data;
    loading.value = false;
  });
  //清空先前选择
  for (const key in changeAddressResult) {
    changeAddressResult[key] = "";
  }
};

const closeDialog = () => {
  active.value = false;
};
// 切换展开收起
const toggleDialog = () => {
  active.value ? closeDialog() : openDialog();
};
// 点击其他位置隐藏
const target = ref(null);
onClickOutside(target, () => {
  closeDialog();
});

//获取省市区数据函数
const getCityData = () => {
  return new Promise((resolve, reject) => {
    const _window = window as any;
    if (_window.cityData) {
      resolve(_window.cityData);
    } else {
      const url =
        "https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json";
      axios.get(url).then((res) => {
        _window.cityData = res.data;
        resolve(res.data);
      });
    }
  });
};

//当前显示的地区数据
const currList = computed(() => {
  // 省份
  let list = allCityData.value;
  // 城市
  if (changeAddressResult.provinceCode && changeAddressResult.provinceName) {
    list = list.find(
      (p: any) => p.code === changeAddressResult.provinceCode
    ).areaList;
  }
  // 地区
  if (changeAddressResult.cityCode) {
    list = list.find(
      (c: any) => c.code === changeAddressResult.cityCode
    ).areaList;
  }
  return list;
});

//选择的地区
let changeAddressResult: any = reactive({
  provinceCode: "",
  provinceName: "",
  cityCode: "",
  cityName: "",
  countyCode: "",
  countyName: "",
  fullLocation: "",
});

//点击地址，选择地址
const changeAddress = (item: any) => {
  if (item.level === 0) {
    changeAddressResult.provinceCode = item.code;
    changeAddressResult.provinceName = item.name;
  } else if (item.level === 1) {
    changeAddressResult.cityCode = item.code;
    changeAddressResult.cityName = item.name;
  } else if (item.level === 2) {
    changeAddressResult.countyCode = item.code;
    changeAddressResult.countyName = item.name;
    changeAddressResult.fullLocation = `${changeAddressResult.provinceName} ${changeAddressResult.cityName} ${changeAddressResult.countyName}`;
    //关闭对话框
    closeDialog();
    emits("changeAddress", changeAddressResult);
  }
};
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
