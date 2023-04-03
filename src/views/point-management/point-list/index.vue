<template>
  <div class="point-container other-form">
    <Breadcrumb :items="['返回赛事列表','赛点列表']" :path="['event']" />
    <div class="point-wrap other-form wrapbg">
      <Mtitle title="赛点列表" />
      <PointList />
    </div>
  </div>
</template>

<script lang="ts" setup>
import PointList from './point-list.vue';
</script>

<style lang="less" scoped>
</style>
