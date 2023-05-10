<template>
  <div class="form-group m-30">
    <a-form :model="form">
      <a-form-item field="radio" label="赛事类型：">
        <!-- <Mradio :radioarr="permissions[0] === 'admin' ? createType: ['擂台']" :defaultvalue="form.type" @change-radio="changeRadio" /> -->
        <Mradio :radioarr="createType" :defaultvalue="form.type" @change-radio="changeRadio" />
      </a-form-item>
    </a-form>
    <!-- <NewPoint v-if="form.type !== '擂台' && permissions[0] === 'admin'" :type="form.type" /> -->
    <NewPoint v-if="form.type !== '擂台'" :type="form.type" />
    <NewCity v-else :type="form.type"/>
</div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, computed, watch, ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store';
import { RoleType } from '@/store/modules/user/types';
import NewPoint from './new-point.vue';
import NewCity from './new-city.vue';

const userStore = useUserStore();
const router = useRouter()
const createType = ['主题赛','俱乐部联赛(仅限俱乐部参与)','擂台']
const form:any = reactive({
    type: '主题赛',
});
const permissions: ComputedRef<RoleType[]> = computed(() => userStore.$state.permissions );
watch(()=>permissions,(newV,oldV)=>{
  // if( newV.value[0] !== 'admin' ) form.type = '擂台'
},{immediate: true,deep: true})
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
