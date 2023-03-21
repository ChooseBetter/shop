<template>
  <div class="xtx-pagination">
    <a
      @click="changePager(currentPage - 1)"
      :class="{disabled: currentPage <= 1}"
      href="javascript:;"
      >上一页</a
    >
    <span v-if="pager.start > 1">...</span>
    <a
      v-for="item in pager.btnArr"
      :key="item"
      :class="{active: currentPage === item}"
      @click="changePager(item)"
      href="javascript:;"
      >{{ item }}</a
    >
    <span v-if="pager.end < pager.pageCount">...</span>
    <a
      @click="changePager(currentPage + 1)"
      :class="{disabled: currentPage >= pager.pageCount}"
      href="javascript:;"
      >下一页</a
    >
  </div>
</template>

<script setup lang="ts">
import {ref, defineProps, computed, watch, defineEmits} from "vue";

const props = defineProps({
  total: {
    type: Number,
    default: 10,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
});
const emits = defineEmits(["current-change"]);

const count = 5; // 按钮个数
const currentPage = ref(4); // 当前显示的页码
const total = ref(100); // 数据总条数
const pageSize = ref(10); // 每页条数
// 总页数，起始，结束
const pager = computed(() => {
  const pageCount = Math.ceil(total.value / pageSize.value);
  const offset = Math.floor(count / 2);
  let start = currentPage.value - offset;
  let end = start + count - 1;

  if (start < 1) {
    start = 1;
    end = start + count - 1 > pageCount ? pageCount : start + count - 1;
  }
  if (end > pageCount) {
    end = pageCount;
    start = end - count + 1 < 1 ? 1 : end - count + 1;
  }
  //展示的页数组
  const btnArr = [];
  for (let i = start; i <= end; i++) {
    btnArr.push(i);
  }
  return {pageCount, offset, start, end, btnArr};
});

watch(
  props,
  () => {
    total.value = props.total;
    pageSize.value = props.pageSize;
    currentPage.value = props.currentPage;
  },
  {immediate: true}
);
// 切换分页
const changePager = (page: number) => {
  currentPage.value = page;
  emits("current-change", page);
};
</script>

<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
