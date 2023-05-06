<template>
  <div class="newpoint-container" style="overflow: hidden;">
    <Breadcrumb :items="['返回赛点列表','添加赛点']" :path="[`pointlist?match=${name}&compId=${compId}`]" />
    <div class="newpoint-wrap wrapbg">
      <Mtitle title="添加赛点" />
      <FormGroup :key="pointKey" @refresh="refresh"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import FormGroup from './components/form-group.vue';

const router = useRouter();
let name: string = $ref('')
let compId: string = $ref('')
let pointKey: number = $ref(0)
const refresh = (key: number) => {
  pointKey = key
}
onMounted(()=>{
  name = String(router.currentRoute.value.query.name)
  compId = String(router.currentRoute.value.query.compId)
})
</script>

<style lang="less" scoped>
</style>
