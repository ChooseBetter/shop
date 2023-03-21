<template>
  <div class="container">
    <MemberAside />
    <article class="article">
      <RouterView />
    </article>
  </div>
</template>

<script setup lang="ts">
import MemberAside from "@/components/member-aside";
</script>

<style scoped lang="less">
.container {
  display: flex;
  padding-top: 20px;
  .article {
    width: 1000px;
  }
}
</style>
