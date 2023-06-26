<template>
    <div class="form-group">
        <a-form :model="form" @submit="handleSubmit">
            <a-form-item
              field="name" label="赛事名称："
              :rules="[{ required: true, message:'name is required' },{maxLength:100,message:'最多可填写100个字'}]"
              :validate-trigger="['blur']"
            >
              <a-input v-model="form.name" placeholder="请输入您的赛事名称" />
            </a-form-item>
            <a-form-item field="victoryMode" label="对战方式：">
              <Mradio :radioarr="['1V1','5V5']" defaultvalue="5V5" @change-radio="changeRadio"/>
            </a-form-item>
            <a-form-item :key="form.startTime" field="viewTime" label="赛事时间：">
                <DatePicker :starttime="form.startTime" :finishtime="form.finishTime" @change-date="changeDate"/>
            </a-form-item>
            <a-form-item field="rankNum" label="队伍排名数量：" :rules="[{type:'number', min: 1,max:1,message:'目前仅支持数量1(选出冠亚军)'}]">
              <a-input-number 
                v-model="form.rankNum" 
                :hide-button="true" 
                :min="1" 
                :max="1" 
                style="height: 40px;" 
                placeholder="目前仅支持数量1(选出冠亚军)"
              />
            </a-form-item>
            <a-form-item field="teamNum" label="报名队伍数量限制：" :rules="[{type:'number', min:8,max:8,message:'目前仅支持8个队伍报名'}]">
              <a-input-number 
                v-model="form.maxTroopNum" 
                :hide-button="true" 
                :min="8" 
                :max="8" 
                style="height: 40px;" 
                placeholder="目前仅支持8个队伍报名"
              />
            </a-form-item>
            <a-form-item>
              <div class="flex-center" style="width: 758px;margin-bottom: 20px;">
                <a-button class="active " html-type="submit" :disabled="loading"><div><a-spin v-if="loading"/> 保存并确认</div></a-button>
                <a-button class="default" style="margin-left: 64px;" :disabled="true" @click="toPoint"><div>添加赛点</div></a-button>
              </div>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from 'vue'
import { FileItem, Message, ValidatedError } from '@arco-design/web-vue';
import { LoginData } from '@/api/user';
import { useRouter } from 'vue-router';
import useLoading from '@/hooks/loading'
import { createCompetition , queryCompetitionList} from '@/api/competition';
import type { newcomListRes } from '@/api/competition';
import type { dateType } from '@/types/global'

const router = useRouter();
const { loading, setLoading } = useLoading(false);
const props = defineProps({
    type: {
        type: String,
        default: '主题赛'
    }
})
const form:any = reactive({
    name: '',
    fightNum: 5, // 目前只能填1-1V1,5-5V5
    startTime: 0,
    finishTime: 0,
    rankNum: 1, // 目前只能填1: 选出冠亚军
    maxTroopNum: 8, // 最大报名队伍数，目前只能为8
});
let creatType = 0
watch(()=>props.type,(newV: any, oldV: any) => {
  if( newV === '主题赛' ) creatType = 0
  if( newV === '俱乐部联赛(仅限俱乐部参与)' ) creatType = 1
},{immediate: true})

const getNameLeng = (str: string) => {
  return str.replace(/[\u0391-\uFFE5]/g, 'aa').length;
}

const changeDate = (date: dateType) => {
    form.startTime = Math.floor(Number(date.start) / 1000)
    form.finishTime = Math.floor(Number(date.end) / 1000)
}

const changeRadio = (radio: string) => {
  console.log(radio)
  form.fightNum = radio === '1V1' ? 1 : 5
}


// let compId: string = $ref('')

const queryAllreadyCom = async () => {
  let result: newcomListRes | any = await queryCompetitionList({pageno: 1,pagesize: 100}).catch(()=>setLoading(false))
  if( result.data?.total > 100 ){
    result = await queryCompetitionList({pageno: Math.floor(result.data.total / 100) + 1 ,pagesize: 100}).catch(()=>setLoading(false))
  }
  if( result.data?.list.length && result.data?.list[result.data?.total - 1].status !== 2 ) {
    Message.error('当前存在未结束的赛事，不允许再新建赛事')
    return true
  }
  return false
}

const handleSubmit = async ({errors, values}: {
    values: Record<string, LoginData>,
    errors: Record<string, ValidatedError> | undefined
  }) => {
    if( await queryAllreadyCom() ) return
    // console.log('values:', values, '\nerrors:', errors)
    const nameLen = getNameLeng(form.name)
    if( form.rankNum !== 1 ) form.rankNum = 1
    if( form.maxTroopNum !== 8 ) form.maxTroopNum = 8
    if( !errors && nameLen >= 4 && nameLen <= 100 && form.startTime && form.finishTime ){
      setLoading(true)
      try {
          createCompetition(form).then(({data}) => {
              Message.success('success')
          }).finally(()=>setLoading(false))
        } catch (error) {
          setLoading(false)
        }
    }else{
      if( !form.name ) {Message.error('赛事名称不能为空'); return}
      if( nameLen < 4 || nameLen > 100 ) {Message.error('赛事名称最少填写2个字，最多可填写100个字');return}
      if( !form.startTime ) {Message.error('赛事开始时间不能为空');return}
      if( !form.finishTime ) {Message.error('赛事结束时间不能为空');}
    }
}


const toPoint = () => {
  // if( compId ){
  //   router.push({ path: '/newpoint', query: { compId,name: form.name,url:form.banner } });
  // }else{
  //   Message.info('请先创建赛事')
  // }
}

onMounted(() => {
})
</script>

<style lang="less" scoped>
  .form-group {
    :deep(.arco-form){
      .arco-row:nth-child(2)>.arco-form-item-label-col{
        height: 40px;
        line-height: 40px;
      }
      .text-rule>div:last-child{
        &:hover{
          background-color: transparent;
        }
        .arco-textarea{
          padding: 9px 20px;
          color: #3A3F63;
          resize: none;
          border-radius: 4px;
          border: 1px solid #DAE0F2;
        }
      }
    }
  }
</style>
