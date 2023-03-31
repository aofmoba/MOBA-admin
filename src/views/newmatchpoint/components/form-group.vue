<template>
  <div class="form-group m-30">
    <a-form :model="formPoint" @submit="handleSubmit">
      <a-form-item field="match" label="所属赛事：">
        <div class="blue-1" style="font-weight: bold;">{{ router.currentRoute.value.query.name }}</div>
      </a-form-item>
      <a-form-item
        field="name" label="赛点名称："
        :rules="[{ required: true,},{maxLength:10,message:'最多可填写10个字'}]"
        :validate-trigger="['blur']"
      >
        <a-input v-model="formPoint.name" placeholder="请输入您的赛点名称" />
      </a-form-item>
      <div class="item-group group1 flex">
        <a-form-item field="banner" label="赛点banner：">
          <div class="flex-col">
            <Mupload ref="uploadBannerRef" :width="335" :height="120" :uwidth="670" :uheight="240" @change-banner="changeBanner" />
            <div class="mt-10 mtext-gray font-sm">尺寸（670*240px），仅限JPG和PNG格式</div>
          </div>
        </a-form-item>
        <a-form-item field="logo" label="赛点logo：">
          <div class="flex-col">
              <Mupload ref="uploadLogoRef" :width="120" :height="120" :uwidth="160" :uheight="160" @change-banner="changeLogo" />
              <div class="mt-10 mtext-gray font-sm">尺寸（160*160px），仅限JPG和PNG格式</div>
          </div>
        </a-form-item>
      </div>
      <a-form-item field="victoryMode" label="对战方式：">
        <Mradio :radioarr="fightNumList" :defaultvalue="fightNumList[formPoint.fightNum]" :types="0" @change-radio="changeRadio" />
      </a-form-item>
      <a-form-item field="matchMode" label="比赛模式：">
        <Mradio :radioarr="fightModeList" :defaultvalue="fightModeList[formPoint.fightMode]" :types="1" @change-radio="changeRadio" />
      </a-form-item>
      <a-form-item field="winMode" label="获胜方式：">
        <Mradio :radioarr="fightRoundList" :defaultvalue="fightRoundList[formPoint.fightRound]" :types="2" @change-radio="changeRadio" />
      </a-form-item>
      <a-form-item field="signupDate" label="报名时间：">
        <DatePicker :starttime="formPoint.signTime" :finishtime="formPoint.signFinTime" :types="0" @change-date="changeDate"/>
      </a-form-item>
      <a-form-item field="signinDate" label="签到时间：">
        <DatePicker :starttime="formPoint.checkInTime" :finishtime="formPoint.checkInFinTime" :types="1" @change-date="changeDate"/>
      </a-form-item>
      <a-form-item field="matchDate" label="比赛时间：">
        <DatePicker :starttime="formPoint.fightTime" :finishtime="formPoint.fightFinTime" :types="2" @change-date="changeDate"/>
      </a-form-item>
      <div v-if="showMore" class="item-group group2 flex">
        <a-form-item field="teamNum" label="报名队伍数量限制：">
          <a-input-number v-model="formPoint.teamNumLimit" :hide-button="true" :min="1" style="width: 188px;height: 40px;" placeholder="默认不限" />
        </a-form-item>
        <a-form-item field="teanMemNum" label="队伍人数上线：" :rules="[{type:'number', max:7,message:'战队人数不能超过7人'}]">
          <a-input-number 
            v-model="formPoint.teamMemberLimit" 
            :hide-button="true" 
            :min="1" 
            :max="7" 
            style="width: 188px; height: 40px;" 
            placeholder="默认7人" 
          />
        </a-form-item>
      </div>
      <a-form-item v-if="showMore" field="matchStage" label="赛事阶段：">
        <div>
          <MatchStage @change-stage="changeStage"/>
          <div class="mtext-gray font-sm" style="margin-top: 3px;">（默认报名、签到和比赛阶段）</div>
        </div>
      </a-form-item>
      <div v-if="!showMore" class="flex-content mb-30" style="padding-right: 95px;">
        <div class="flex-items font-md mtext-1 cursor-pointer" @click="showMoreFun">更多设置<icon-down style="font-size: 24px;margin-left: 10px;"/></div>
      </div>
      <a-form-item>
        <div class="flex-center" style="width: 758px;margin-bottom: 20px;">
          <a-button class="active btn-loading" :disabled="loading" html-type="submit"><div><a-spin v-if="loading" />保存并确认</div></a-button>
          <a-button class="default" style="margin-left: 64px;" @click="createAnotherPoint"><div>添加赛点</div></a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { watch, reactive, onMounted, getCurrentInstance } from 'vue'
import { FileItem, Message, ValidatedError } from '@arco-design/web-vue';
import { LoginData } from '@/api/user';
import { useRouter } from 'vue-router';
import useLoading from '@/hooks/loading'
import type { dateType } from '@/types/global'
import { 
  createCompetitionPoint,
  createCompetitionPointData,
  stepsData
} from '@/api/competition'

const { proxy } = getCurrentInstance() as any
const router = useRouter();
const { loading, setLoading } = useLoading(false);
const fightNumList = ['5 V 5','3 V 3','1 V 1']
const fightModeList = ['淘汰赛','循环积分赛(暂未开放)']
const fightRoundList = ['BO1(一局胜负)','BO3(三局两胜)','BO5(五局三胜)','BO7(七局四胜)']
let showMore: boolean = $ref(false)
let banneFile: FileItem | any = $ref()
let logoFile: FileItem | any = $ref()
const emit = defineEmits(['refresh'])
const formPoint:createCompetitionPointData | any = $ref({
    compId: '',
    name: '',
    detail:{
      banner: '',
      logo: '',
      steps: []
    },
    fightNum: 0,
    fightMode: 0,
    fightRound: -1,
    signTime: 0,
    signFinTime: 0, 
    checkInTime: 0,
    checkInFinTime: 0,
    fightTime: 0,
    fightFinTime: 0,
    teamNumLimit: null, // 报名队伍数
    teamMemberLimit: null, // 队伍人数
});

watch(()=>formPoint.fightNum,(newN,oldN)=>{
  if( newN === 0 ) formPoint.teamMemberLimit = 5
  else if( newN === 1 ) formPoint.teamMemberLimit = 3
  else if( newN === 2 ) formPoint.teamMemberLimit = 1
  else formPoint.teamMemberLimit = 7
},{immediate:true,deep:true})


const changeBanner = (file: any) => {
  // eslint-disable-next-line no-multi-assign
  formPoint.detail.banner = banneFile = file
}
const changeLogo = (file: any) => {
  // eslint-disable-next-line no-multi-assign
  formPoint.detail.logo = logoFile = file
}
const changeRadio = (radio: string, types: number) => {
  if( types === 0 ) formPoint.fightNum = fightNumList.findIndex(item=> item === radio)
  if( types === 1 ) formPoint.fightMode = fightModeList.findIndex(item=> item === radio)
  if( types === 2 ) formPoint.fightRound = fightRoundList.findIndex(item=> item === radio)
}

const changeDate = (date: dateType, types: number) => {
  if( types === 0 ) {
    formPoint.signTime = Math.floor(Number(date.start) / 1000)
    formPoint.signFinTime = Math.floor(Number(date.end) / 1000)
  }
  if( types === 1 ) {
    formPoint.checkInTime = Math.floor(Number(date.start) / 1000)
    formPoint.checkInFinTime = Math.floor(Number(date.end) / 1000)
  }
  if( types === 2 ) {
    formPoint.fightTime = Math.floor(Number(date.start) / 1000)
    formPoint.fightFinTime = Math.floor(Number(date.end) / 1000)
  }
}

const changeStage = (data: stepsData[]) => {
  formPoint.detail.steps = data
}

const axiosCreate = () => {
  createCompetitionPoint(formPoint).then(({data}) => {
    formPoint.compId = data
    Message.success('success')
  }).finally(()=>{setLoading(false)})
}


const uploadBannerRef: any = $ref()
const uploadLogoRef: any = $ref()
let countUpload: number = $ref(0)
const handleSubmit = async ({errors, values,}: {
    values: Record<string, LoginData>,
    errors: Record<string, ValidatedError> | undefined
  }) => {
    countUpload = 0
    // 默认数据处理
    if( !formPoint.detail.banner ){ formPoint.detail.banner = '默认banner链接' }
    if( !formPoint.detail.logo ){ formPoint.detail.logo = '默认游戏logo链接' }
    if( !formPoint.fightFinTime ) formPoint.fightFinTime = formPoint.fightTime + 86400 // 比赛结束时间默认为开始时间24小时后
    if( !formPoint.detail.steps.length ){ // 默认报名、签到、比赛阶段
      formPoint.detail.steps = [
        {name: '报名阶段',startTime: formPoint.signTime },
        {name: '签到阶段',startTime: formPoint.checkInTime },
        {name: '比赛阶段',startTime: formPoint.fightTime },
      ]
    }
    
    console.log('values:', values, '\nerrors:', errors)
    if( !errors && formPoint.fightRound >= 0 && formPoint.signTime && formPoint.signFinTime && formPoint.checkInTime && formPoint.checkInFinTime && formPoint.fightTime ){
      if( formPoint.checkInTime <= formPoint.signTime || formPoint.checkInTime >= formPoint.fightTime ){
        Message.error({
          content: '开始时间不能早于报名时间的开始时间，不能晚于比赛开始时间',
          duration: 5000
        })
        return
      }
      if( formPoint.checkInFinTime <= formPoint.checkInTime || formPoint.checkInFinTime >= formPoint.fightTime ){ // 默认签到开始时间 小于签到结束时间
        Message.error({
          content: '签到结束时间不能早于签到开始时间，不能晚于比赛开始时间',
          duration: 5000
        })
        return
      }
      if( formPoint.fightTime <= formPoint.signFinTime ){ // 默认比赛开始时间 小于比赛结束时间
        Message.error({
          content: '比赛开始时间不能早于报名结束时间，不能晚于比赛结束时间',
          duration: 5000
        })
        return
      }
      setLoading(true)
      if( formPoint.detail.banner ) uploadBannerRef.uploadRequest(banneFile.file).then((result: any) => { // banner图片上传之后
        formPoint.detail.banner = result;
        countUpload +=1
        if( countUpload === 2 ) {
          axiosCreate()
        }
      }).catch((err: any)=>{ Message.error('图片上传失败,请重试');setLoading(false)})

      if( formPoint.detail.logo ) uploadLogoRef.uploadRequest(logoFile.file).then((result: any) => { // logo图片上传之后
        formPoint.detail.logo = result;
        countUpload +=1
        if( countUpload === 2 ){
          axiosCreate()
        }
      }).catch((err: any)=>{ Message.error('图片上传失败,请重试');setLoading(false)})

      if( !formPoint.detail.logo && !formPoint.detail.logo ) axiosCreate()
      
    }else{
      let message = ''
      if( !formPoint.fightTime ) message = '比赛开始时间'
      if( !formPoint.checkInTime || !formPoint.checkInFinTime ) message = '签到时间'
      if( !formPoint.signTime || !formPoint.signFinTime ) message = '报名时间'
      if( formPoint.fightRound < 0 ) message = '获胜方式'
      if( formPoint.name.length > 10 ) message = '赛点名称最多可填写10个字'
      if( !formPoint.name ) message = '赛点名称'
      if( formPoint.name.length <= 10 ){message += '不能为空'}
      Message.error(message)
    }
}

const createAnotherPoint = () => {
  emit('refresh',new Date().getTime())
}

const showMoreFun = () => {
  showMore = true
}
onMounted(() => {
  formPoint.compId = String(router.currentRoute.value.query.compId)
})
</script>

<style lang="less" scoped>
  .form-group {
    :deep(.arco-form){
      .arco-row:nth-child(11)>.arco-form-item-label-col{
        margin-top: 9px;
      }
      .item-group{
        &.group1 .arco-row{
          width: 520px;
          flex-wrap: nowrap;
        }
        &.group2 .arco-row{
          width: 400px;
          flex-wrap: nowrap;
          .arco-form-item-label-col{
            margin-left: -18px;
            margin-right: 18px;
          }
        }
        &.group1 .arco-row:nth-child(1)>.arco-form-item-label-col,
        &.group1 .arco-row:nth-child(2)>.arco-form-item-label-col{
          margin-top: 9px;
        }
      }
    }
  }
</style>
