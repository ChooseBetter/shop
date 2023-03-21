<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem v-if="category.top" :to="`/category/${category.top.id}`">{{
      category.top.name
    }}</XtxBreadItem>
    <Transition name="fade-right" mode="out-in">
      <XtxBreadItem v-if="category.sub" :key="category.sub.id">{{
        category.sub.name
      }}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>
<script setup lang="ts">
import useStore from "@/store";
import {computed} from "@vue/runtime-core";
import {useRoute} from "vue-router";

const route = useRoute();
const {categoryStore} = useStore();
const category = computed(() => {
  const cate: any = {};
  categoryStore.list.forEach((top: any) => {
    if (top.children) {
      const sub = top.children.find((sub: any) => sub.id === route.params.id);
      if (sub) {
        cate.top = {id: top.id, name: top.name};
        cate.sub = {id: sub.id, name: sub.name};
      }
    }
  });
  return cate;
});
</script>

<style scoped></style>
