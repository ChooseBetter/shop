<template>
  <div class="xtx-tabs">
    <nav>
      <a
        v-for="(item, index) in tabPanel"
        :key="item.name"
        @click="tabClick(item.name, index)"
        :class="{active: item.name === activeName}"
        href="javascript:;"
      >
        {{ item.label }}
      </a>
    </nav>
    <slot />
  </div>
</template>

<script setup lang="ts">
import {ref, defineProps, defineEmits, provide} from "vue";
import {useVModel} from "@vueuse/core";
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  tabPanel: {
    type: Array,
    default: () => [],
  },
});
const emits = defineEmits(["update:modelValue", "tab-click"]);
const activeName = useVModel(props, "modelValue", emits);
// 给xtx-tabs-panel传值
provide("activeName", activeName);
// 切换tabs
const tabClick = (name: string, index: number) => {
  activeName.value = name;
  emits("tab-click", {name, index});
};
</script>

<style lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
