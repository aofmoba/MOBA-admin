<template>
  <div class="form-group m-30">
    <a-form :model="form">
      <a-form-item field="radio" label="赛事类型：">
        <Mradio :radioarr="['主题赛','俱乐部联赛(仅限俱乐部参与)','擂台']" :defaultvalue="form.type" @change-radio="changeRadio" />
      </a-form-item>
    </a-form>
    <NewPoint v-if="form.type !== '擂台'" :type="form.type" />
    <NewCity v-else :type="form.type"/>
</div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NewPoint from './new-point.vue';
import NewCity from './new-city.vue';

const router = useRouter()
const form:any = reactive({
    type: '主题赛',
});
const changeRadio = (file: any) => {
  form.type = file
}
onMounted(()=>{
  if( Number(router.currentRoute.value.query.type) === 2 ) form.type = '擂台'
})
</script>

<style lang="less" scoped>
.arco-form{
  .arco-row{
    margin-bottom: 15px;
  }
}
</style>
