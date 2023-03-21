<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区 -->
      <SubFilter @filter-change="filterChange" />
      <!-- 结果区域 -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort @sort-change="sortChange" />
        <!-- 列表 -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.id">
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <!-- 无线加载组件 -->
        <XtxInfiniteLoading
          :loading="loading"
          :finished="finished"
          @infinite="getData"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {useRoute} from "vue-router";
import {findSubCategoryGoods} from "@/api/category";
import {reqParamsType, sortParamsType, filterParamsType} from "./types";
import SubBread from "./components/sub-bread";
import SubFilter from "./components/sub-filter";
import SubSort from "./components/sub-sort";
import GoodsItem from "./components/goods-item";

const route = useRoute();
const loading = ref(false);
const finished = ref(false);
let goodsList: any = ref([]);
let reqParams: reqParamsType = {
  page: 1,
  pageSize: 20,
  categoryId: "",
};

//获取数据
const getData = () => {
  loading.value = true;
  reqParams.categoryId = route.params.id;
  findSubCategoryGoods(reqParams).then(({result}) => {
    //获取到数据
    if (result.items.length) {
      goodsList.value.push(...result.items);
      reqParams.page++;
    } else {
      //获取不到数据
      finished.value = true;
    }
    loading.value = false;
  });
};
//更改了二级分类时重新加载数据
watch(
  () => route.params.id,
  (newValue) => {
    if (newValue && `/category/sub/${newValue}` === route.path) {
      finished.value = false;
      //列表为空，加载更多组件顶上来，进入可视区，触发infinite
      goodsList.value = [];
      reqParams = {
        page: 1,
        pageSize: 20,
        categoryId: "",
      };
    }
  }
);

//更改排序组件的筛选数据，重新请求
const sortChange = (sortParams: sortParamsType) => {
  afreshRequest(reqParams, sortParams);
};
//更改筛选组件的筛选数据，重新请求
const filterChange = (filterParams: filterParamsType) => {
  afreshRequest(reqParams, filterParams);
};

const afreshRequest = (reqparams: any, params: any) => {
  finished.value = false;
  reqParams = {...reqparams, ...params};
  reqParams.page = 1;
  goodsList.value = [];
};
</script>

<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
