<template>
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          :class="{active: filterData.selectedBrand === brand.id}"
          v-for="brand in filterData.brands"
          :key="brand.id"
          @click="changeBrand(brand.id)"
          >{{ brand.name }}</a
        >
      </div>
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <div class="head">{{ item.name }}：</div>
      <div class="body">
        <a
          :class="{active: item.selectedProp === prop.id}"
          v-for="prop in item.properties"
          :key="prop.id"
          @click="changeProp(item, prop.id)"
          >{{ prop.name }}</a
        >
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>

<script setup lang="ts">
import {findSubCategoryFilter} from "@/api/category";
import {ref, watch, defineEmits} from "vue";
import {useRoute} from "vue-router";
import {filterParamsType} from "../../types";

const route = useRoute();
const emits = defineEmits(["filter-change"]);
const filterData: any = ref(null);
const filterLoading = ref(false);

watch(
  () => route.params.id,
  (newValue) => {
    //判断是否为二级类目
    if (newValue && `/category/sub/${newValue}` === route.path) {
      filterLoading.value = true;
      findSubCategoryFilter(route.params.id).then((data) => {
        // 整理数据，在数据第一位添加‘全部’
        // 给数据添加选中的id
        data.result.selectedBrand = null;
        data.result.brands.unshift({id: null, name: "全部"});
        data.result.saleProperties.forEach((item: any) => {
          item.selectedProp = null;
          item.properties.unshift({id: null, name: "全部"});
        });
        filterData.value = data.result;
        filterLoading.value = false;
      });
    }
  },
  {immediate: true}
);

//获取筛选参数
const getFilterParams = () => {
  const obj: filterParamsType = {brandId: null, attrs: []};
  obj.brandId = filterData.value.selectedBrand;
  filterData.value.saleProperties.forEach((item: any) => {
    if (item.selectedProp) {
      const prop: any = item.properties.find(
        (prop: any) => prop.id === item.selectedProp
      );
      obj.attrs.push({groupName: item.name, propertyName: prop.name});
    }
  });
  if (obj.attrs.length === 0) obj.attrs = null;
  return obj;
};

//当前选择的品牌
const changeBrand = (brandId: string | string[]) => {
  if (filterData.value.selectedBrand === brandId) return;
  filterData.value.selectedBrand = brandId;
  emits("filter-change", getFilterParams());
};
//当前选择的销售属性
const changeProp = (item: any, propId: string | string[]) => {
  if (item.selectedProp === propId) return;
  item.selectedProp = propId;
  emits("filter-change", getFilterParams());
};
</script>

<style scoped lang="less">
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
.xtx-skeleton {
  padding: 10px 0;
}
</style>
