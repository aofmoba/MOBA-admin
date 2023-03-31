<template>
  <div class="race-container other-form">
    <Breadcrumb :items="['返回赛事列表','赛点列表','赛程操作']" :path="['event','pointlist']" />
    <RaceOperation />
  </div>
</template>

<script lang="ts" setup>
import RaceOperation from './race-operation.vue';
</script>

<style lang="less" scoped>
</style>
