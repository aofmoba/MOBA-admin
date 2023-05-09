<template>
  <div class="step1 wrapbg mt-20" style="padding: 22px 30px;">
    <a-space class="flex justify-end">
      <a-button class="active noboxshadow" style="width: 145px; height: 36px;"><div style="font-size: 16px;line-height: 36px;">全部确认到场</div></a-button>
      <a-button class="default" style="width: 145px; height: 36px;"><div style="width: 143px;font-size: 16px;line-height: 33px;margin-top: 1px;">全部取消到场</div></a-button>
      <a-input :style="{width:'180px'}" placeholder="玩家昵称">
        <template #append>
          <img style="width: 24px;height: 24px;" src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/search.svg" alt="">
        </template>
      </a-input>
      <a-input :style="{width:'240px'}" placeholder="输入赛点名称">
        <template #append>
          <img style="width: 24px;height: 24px;" src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/search.svg" alt="">
        </template>
      </a-input>
    </a-space>
    <div ref="tableRef" class="race-table" style="margin: 22px 0 68px;">
      <a-table
        column-resizable
        :bordered="{ cell: false }"
        :data="useData"
        :loading="loading"
        row-key="teamId"
        :expanded-keys="expands"
        :pagination="false"
      >
        <template #empty>
          <div style="margin-top: 75px;"><img v-if="!loading" style="width: 194px;" src="https://moba-project.s3-accelerate.amazonaws.com/admin/empty.png" alt=""></div>
        </template>
        <template #expand-row>
            <a-table class="expand-table" :loading="inloading" :data="expandData" :pagination="false">
              <template #empty>
                <div style="margin-top: 75px;"><img v-if="!inloading" style="width: 194px;" src="https://moba-project.s3-accelerate.amazonaws.com/admin/empty.png" alt=""></div>
              </template>
              <template #columns>
                <a-table-column
                  title="选手ID"
                  data-index="id"
                  :width="133"
                />
                <a-table-column
                  title="选手昵称"
                  :width="325"
                >
                <template #cell="{ record }">
                  {{ record.name ? record.name : '--' }}
                </template>
                </a-table-column>
                <a-table-column
                  title="主玩位置"
                  :width="102"
                >
                  <template #cell="{ record }">
                    {{ getPlayerMainPos(record.mainPos) }}
                  </template>
                </a-table-column>
                <a-table-column title="" />
              </template>
            </a-table>
        </template>
        <template #pagination-left>
          <div class="left-icon flex-center" style="pointer-events: none;margin-right: -32px;"><icon-arrow-left /></div>
        </template>
        <template #pagination-right>
          <div class="right-icon flex-center" style="pointer-events: none;margin-left: -44px;"><icon-arrow-right /></div>
        </template>
        <template #columns>
          <a-table-column
            title="队伍编号"
            data-index="teamId"
            :width="133"
          />
          <a-table-column
            title="队伍名称"
            data-index="name"
            :width="325"
          />
          <a-table-column
            title="人数"
            data-index="person"
            :width="102"
          />
          <a-table-column title="操作" :width="378">
            <template #cell="{ record }">
              <a-space class="flex-content" style="padding-left: 106px;">
                <a-button class="active noboxshadow" style="width: 103px; height: 32px;" :disabled="celSignloading" @click="cancelSign(record.teamId)"><div style="font-size: 14px;line-height: 32px;"><a-spin v-if="celSignloading"/>取消报名</div></a-button>
                <a-button class="default signbtn" style="width: 103px; height: 32px;margin-left: 10px;" :disabled="noCheckFilter(record.teamId)" @click="teamCheckin(record.teamId)"><div style="width: 100px;font-size: 14px;line-height: 28px;"><a-spin v-if="signloading"/>签到</div></a-button>
              </a-space>
            </template>
          </a-table-column>
          <a-table-column
            type="expend"
            title=""
          >
            <template #cell="{ record }">
              <div class="o-expend white-nowrap" @click="expandRow(record)">
                <span class="expend-btn" style="color: #858EBD;">展开</span>
                <icon-down v-if="expands.indexOf(String(record.teamId)) < 0" class="iconStyle" />
                <icon-up v-else class="iconStyle" />
              </div>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
    <div class="flex-items between">
        <div>
          <span class="font-md mcolor-1">已确认签到：{{ checkinsData.length }} / {{ useData.length }}</span>
          <span class="font-md ml-30" style="color: rgba(90,96,127,0.64);">满{{ queryData?.fightRound || 0 }}人且可签到的队伍数{{ canCheck }}支</span>
        </div>
        <a-space>
          <a-button class="active submit" style="width: 284px; height: 54px;" :disabled="noFinishFilter()" @click="nextStep"><div style="font-size: 18px;line-height: 54px;font-weight: bold;"><a-spin v-if="finloading"/>完成，下一步</div></a-button>
        </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onActivated, computed } from "vue"
import useLoading from '@/hooks/loading'
import { useRouter } from 'vue-router'
import { getPlayerMainPos } from '@/utils/filterData'
import { Message, TableData } from "@arco-design/web-vue"
import {  
  queryComPointCheckinList,
  queryPointTeamInfo,
  queryPlayerInfo,
  queryPointTeamCheckin,
  finishCheckStep,
} from '@/api/competition';
import type { comPointCheckinListRes } from '@/api/competition';

const emit = defineEmits(['on-next','getchecknum'])
const router = useRouter()
const { loading, setLoading } = useLoading(true);
const { loading: inloading, setLoading: inSetLoading } = useLoading(false);
const tableRef: any = $ref(null)
let queryData: any = $ref()
let useData: TableData[] = $ref([])
let checkinsData: any = $ref([])
let signloading: boolean = $ref(false)
const canCheck = computed(()=> useData.filter((item: any) => item?.person >= queryData?.fightRound).length)

const allExpandData: any = $ref([]) // 保存查看的所有队伍成员
let expandData: any = $ref([]) // 队伍选手
let expands:any = $ref([]) // 队伍id
const expandRow = (record: any) => {
  if (expands.indexOf(String(record.teamId)) < 0) {
    expands = []
    expands.push(String(record.teamId))
    const temp = allExpandData.findIndex((ele: any) => ele[0].teamId === record.teamId)
    if( temp > -1 ){ expandData = allExpandData[temp] }
    else{
      inSetLoading(true)
      record.members.forEach((item: any,i: number) => {
        queryPlayerInfo(item.id).then((res: any) => {
          if( res.error_code === 0 ){
            expandData[i] = {...res.data.comp,name: res.data.name,teamId:record.teamId }
          }
        }).finally(()=>{inSetLoading(false)})
      })
      allExpandData.push(expandData)
    }
  } else {
      expands = [];
  }
}

const noCheckFilter = (id: string) => {
  const nowTime = new Date().getTime()
  let timeBol: boolean = $ref(false)
  if( nowTime < queryData.start*1000 || nowTime > queryData.end*1000 ) timeBol = true
  return signloading || checkinsData.includes(id) || timeBol
}

const querySingalTeam = (data: object[]) =>{
  data.forEach((item: any )=>{
    queryPointTeamInfo(item.teamId).then((res: any)=>{
      if( res.error_code === 0 ){
        const temp = useData.findIndex((ele: any) => ele.teamId === res.data.teamId)
        if( temp > -1 ) {
          const olddata = useData[temp]
          useData[temp] = {
            ...olddata,
            ...res.data,
            person: res.data.members.length,
          }
        }
      }
    }).finally(()=>{setLoading(false)})
  })
}

const initData = async (id: string) => {
    queryComPointCheckinList(id).then((res: any) => {
      if( res.error_code === 0 ) {
        if( !res.data.checkins ) res.data.checkins = []        
        if( !res.data.noncheckins ) res.data.noncheckins = []        
        useData = [...res.data.checkins,...res.data.noncheckins]
        if( !useData.length ) { setLoading(false); return}
        checkinsData = res.data.checkins
        useData = useData.map((item: any,i: number)=>({teamId:item,indexId: i+1}))
        // eslint-disable-next-line no-use-before-define
        querySingalTeam( useData )
      }
    }).catch(()=>{setLoading(false)})
}

const teamCheckin = async (teamId: string) => {
  signloading = true
  try {
    await queryPointTeamCheckin(teamId,queryData?.id).finally(()=>{signloading = false})
    initData(queryData.id)
    Message.success('Successfully signed in!')
  } catch (error) {console.log(error)}
}

const celSignloading: boolean = $ref(false)
const cancelSign = (id: number) => {
  // celSignloading = true
}


let finloading: boolean = $ref(false)
const noFinishFilter = (): boolean => {
  const nowTime = new Date().getTime()
  let canBol: boolean = $ref(false)
  if( nowTime <= queryData?.start*1000  ) canBol = true // 签到还未开始 不能结束
  if( nowTime >= queryData?.fightTime*1000 ) canBol = false // 战斗已经开始 直接进入下一步
  return finloading || checkinsData.length <= 1 || canBol
}


const nextStep = async () => {
  // 完成签到过程，同时签到结束时间修改为点击【完成下一步】按钮的时间，-重新进入需判断是否已结束签到
  const nowTime = new Date().getTime()
  if( nowTime >= queryData.fightTime*1000 ){ // 战斗已经开始或已过签到结束时间 直接进入下一步
    // eslint-disable-next-line vue/custom-event-name-casing
    emit('on-next')
    return
  }
  finloading = true
  await finishCheckStep(queryData?.id).finally(()=>{finloading = false})
  emit('getchecknum',checkinsData.length)
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('on-next')
}

onActivated(()=>{
  if( !loading.value ){
    queryData = JSON.parse(localStorage.getItem('matchinfo') || '{}')
    initData(queryData.id)
  }
})

onMounted(() => {
    queryData = JSON.parse(localStorage.getItem('matchinfo') || '{}')
    initData(queryData.id)
})

</script>
  
  <style scoped lang="less">
  :deep(.signbtn .arco-spin-icon){
    color: #4458FE !important;
  }
  .iconStyle{
    font-size: 16px;
    margin-left: 16px;
    color: #858EBD;
  }
  .o-expend{
    font-weight: 500;
    .expend-btn,.iconStyle{cursor: pointer;}
    &:hover{
      .expend-btn,.iconStyle{
        color: #4458FE !important;
      }
    }
  }
  :deep(.arco-space){
    .arco-space-item{
      margin-right: 20px !important;
      &:last-child{margin: 0 !important;}
      .arco-input-outer{position: relative;.arco-input-wrapper{padding-right: 36px;}}
      .arco-input-append{
        position: absolute;
        right: 12px;
        top: 50%;
        padding: 0;
        margin-top: -12px;
        border: none;
        background-color: transparent;
      }
    }
    .arco-btn:not(.submit){
      border-radius: 18px;
      div{
        border-radius: 18px;
      }
      &::before,&::after{
        border-radius: 18px;
      }
    }
  }
  :deep(.race-table){
    &>.arco-table,&>.arco-table>.arco-spin{
        min-height: 324px;
    }
    &>.arco-table{
      thead .arco-table-th:nth-child(4){padding-left: 106px;}
      tbody>.arco-table-tr:not(.arco-table-tr-expand .arco-table-tr){
        height: 72px !important;
      }
    }
  }
  </style>
  