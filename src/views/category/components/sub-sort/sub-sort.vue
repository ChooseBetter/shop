<template>
  <div class="sub-sort">
    <div class="sort">
      <a
        href="javascript:;"
        :class="{active: sortParams.sortField === null}"
        @click="changeSort(null)"
      >
        默认排序
      </a>
      <a
        href="javascript:;"
        :class="{active: sortParams.sortField === 'publishTime'}"
        @click="changeSort('publishTime')"
        >最新商品</a
      >
      <a
        href="javascript:;"
        :class="{active: sortParams.sortField === 'orderNum'}"
        @click="changeSort('orderNum')"
        >最高人气</a
      >
      <a
        href="javascript:;"
        :class="{active: sortParams.sortField === 'evaluateNum'}"
        @click="changeSort('evaluateNum')"
        >评论最多</a
      >
      <a href="javascript:;" @click="changeSort('price')">
        价格排序
        <i
          class="arrow up"
          :class="{
            active:
              sortParams.sortField === 'price' &&
              sortParams.sortMethod === 'asc',
          }"
        />
        <i
          class="arrow down"
          :class="{
            active:
              sortParams.sortField === 'price' &&
              sortParams.sortMethod === 'desc',
          }"
        />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox @change="changeCheck" v-model="sortParams.inventory"
        >仅显示有货商品</XtxCheckbox
      >
      <XtxCheckbox @change="changeCheck" v-model="sortParams.onlyDiscount">
        仅显示特惠商品
      </XtxCheckbox>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, defineEmits} from "vue";
import {sortParamsType} from "../../types";

const emits = defineEmits(["sort-change"]);
const sortParams: sortParamsType = reactive({
  inventory: false, //库存
  onlyDiscount: false,
  sortField: null, //排序类型:publishTime,orderNum,price,evaluateNum
  sortMethod: null, //排序方式:asc为正序 desc为倒序
});

//排序改变
const changeSort = (sortField: string | null) => {
  if (sortField === "price") {
    sortParams.sortField = sortField;
    if (sortParams.sortMethod === null) {
      sortParams.sortMethod = "desc";
    } else {
      sortParams.sortMethod = sortParams.sortMethod === "desc" ? "asc" : "desc";
    }
  } else {
    if (sortParams.sortField === sortField) return;
    sortParams.sortField = sortField;
    sortParams.sortMethod = null;
  }
  emits("sort-change", sortParams);
};

//复选框改变
const changeCheck = () => {
  emits("sort-change", sortParams);
};
</script>

<style scoped lang="less">
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
