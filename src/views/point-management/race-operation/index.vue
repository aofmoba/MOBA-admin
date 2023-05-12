<template>
  <div class="race-container other-form">
    <Breadcrumb :items="['返回赛事列表','赛点列表','赛程操作']" :path="['event',`pointlist?${path}`]" />
    <RaceOperation />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RaceOperation from './race-operation.vue';

const router = useRouter()
let path: string = $ref('')
onMounted(()=>{
  if( !localStorage.getItem('matchinfo') ){ router.push({path: '/event'}) }
  const queryInfo: any = JSON.parse(localStorage.getItem('matchinfo') || '{}')
  path = `match=${ queryInfo.compName }&compId=${ queryInfo.compId }`
})

</script>

<style lang="less" scoped>
</style>
