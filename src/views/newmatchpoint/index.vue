<template>
  <div class="newpoint-container">
    <Breadcrumb :items="['返回赛点列表','添加赛点']" :path="['event']" />
    <div class="newpoint-wrap wrapbg">
      <Mtitle title="添加赛点" />
      <FormGroup :key="pointKey" @refresh="refresh"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import FormGroup from './components/form-group.vue';

let pointKey: number = $ref(0)
const refresh = (key: number) => {
  pointKey = key
}
</script>

<style lang="less" scoped>
</style>
