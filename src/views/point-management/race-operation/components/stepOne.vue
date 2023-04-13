<template>
  <div class="step1 wrapbg mt-20" style="padding: 22px 30px;">
    <a-space class="flex justify-end">
      <a-button class="active noboxshadow" style="width: 145px; height: 36px;"><div style="font-size: 16px;line-height: 36px;">全部确认到场</div></a-button>
      <a-button class="default" style="width: 145px; height: 36px;"><div style="width: 143px;font-size: 16px;line-height: 33px;margin-top: 1px;">全部取消到场</div></a-button>
      <a-input :style="{width:'180px'}" placeholder="玩家昵称">
        <template #append>
          <img style="width: 24px;height: 24px;" :src="searchImg" alt="">
        </template>
      </a-input>
      <a-input :style="{width:'240px'}" placeholder="输入赛点名称">
        <template #append>
          <img style="width: 24px;height: 24px;" :src="searchImg" alt="">
        </template>
      </a-input>
    </a-space>
    <div ref="tableRef" class="race-table" style="margin: 22px 0 68px;">
      <a-table
        column-resizable
        :bordered="{ cell: false }"
        :data="useData"
        :loading="loading"
        row-key="id"
        :expanded-keys="expands"
        :pagination="false"
      >
        <template #empty>
          <div style="margin-top: 75px;"><img v-if="!loading" style="width: 194px;" src="@/assets/images/empty.png" alt=""></div>
        </template>
        <template #expand-row>
            <a-table class="expand-table" :data="expandData" :pagination="false">
              <template #columns>
                <a-table-column
                  title="选手ID"
                  data-index="playerID"
                  :width="133"
                />
                <a-table-column
                  title="选手昵称"
                  data-index="playerNickname"
                  :width="325"
                />
                <a-table-column
                  title="主玩位置"
                  data-index="mainPlay"
                  :width="102"
                />
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
            data-index="id"
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
                <a-button class="active noboxshadow" style="width: 103px; height: 32px;" @click="cancelSign(record.id)"><div style="font-size: 14px;line-height: 32px;">取消报名</div></a-button>
                <a-button class="default btn-loading" style="width: 103px; height: 32px;margin-left: 10px;" :disabled="signloading" @click="teamCheckin(record.id)"><div style="width: 100px;font-size: 14px;line-height: 29px;"><a-spin v-if="signloading"/>签到</div></a-button>
              </a-space>
            </template>
          </a-table-column>
          <a-table-column
            type="expend"
            title=""
          >
            <template #cell="{ record }">
              <div class="o-expend white-nowrap" @click="expandRow(record.id)">
                <span class="expend-btn" style="color: #858EBD;">展开</span>
                <icon-down v-if="expands.indexOf(record.id) < 0" class="iconStyle" />
                <icon-up v-else class="iconStyle" />
              </div>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
    <div class="flex-items between">
        <div>
          <span class="font-md mcolor-1">已确认签到：0 / {{ totalTeam }}</span>
          <span class="font-md ml-30" style="color: rgba(90,96,127,0.64);">满{{ queryData?.fightRound || 0 }}人且可签到的队伍数 5支</span>
        </div>
        <a-space>
          <a-button class="active submit" style="width: 284px; height: 54px;" @click="nextStep"><div style="font-size: 18px;line-height: 54px;font-weight: bold;">完成，下一步</div></a-button>
        </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue"
import useLoading from '@/hooks/loading'
import { useRouter } from 'vue-router'
import { Message, TableData } from "@arco-design/web-vue"
import {  
  queryComPointCheckinList,
  queryPointTeamInfo,
  queryPointTeamCheckin
} from '@/api/competition';
import type { comPointCheckinListRes } from '@/api/competition';

const searchImg = new URL('../../../../assets/images/icons/search.svg', import.meta.url).href
const emit = defineEmits(['on-next'])
const router = useRouter()
const { loading, setLoading } = useLoading(true);
const tableRef: any = $ref(null)
let queryData: any = $ref()
let useData: TableData[] = $ref([])

let expandData: any = $ref([]) // 队伍选手
let expands:any = $ref([]) // 队伍id
const expandRow = (id: any) => {
    if (expands.indexOf(id) < 0) {
        expands = []
        expands.push(id)
        expandData = useData.filter((item: TableData)=> item.id === id)[0].info
    } else {
        expands = [];
    }
}

const querySingalTeam = (date: object[]) =>{
  date.forEach((item: any )=>{
    queryPointTeamInfo(item.id).then((res: any)=>{
      setLoading(false)
      if( res.error_code === 0 ){
        const temp = useData.findIndex((ele: any) => ele.id === res.data.id)
        if( temp > -1 ){
          useData[temp] = {
            ...item,
            id: item.id,
            name: item.name,
            person: item.person,
            info: item.info
          }
        }
      }
    })
  })
}

let totalTeam: number = $ref(0)
const initData = async (id: string) => {
    queryComPointCheckinList(id).then((res: any) => {
      if( res.error_code === 0 ) {
        if( !res.data.checkins.length ) setLoading(false)
        totalTeam = res?.checkins.length + res?.noncheckins.length
        const allTeamData = [...res.checkins.length,...res.noncheckins.length]
        useData = res.data.checkins
        // eslint-disable-next-line no-use-before-define
        querySingalTeam( res.data.checkins )
      }
    }).catch(()=>{setLoading(false)})
}

let signloading: boolean = $ref(false)
const teamCheckin = async (teamId: string) => {
  signloading = true
  await queryPointTeamCheckin(teamId).finally(()=>{signloading = false})
  Message.success('Successfully signed in!')
}


const cancelSign = (id: number) => {
}

const nextStep = () => {
  // 完成签到过程，同时签到结束时间修改为点击【完成下一步】按钮的时间
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('on-next')
}

onMounted(() => {
    const queryInfo: any = router.currentRoute.value.query.matchinfo
    queryData = JSON.parse(queryInfo)
    initData(queryData.id)
})

</script>
  
  <style scoped lang="less">
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
  :deep(.arco-table){
    thead .arco-table-th:nth-child(4){padding-left: 106px;}
    tbody>.arco-table-tr{
      height: 72px !important;
    }
    .arco-table-tr-expand
    .expand-table{
      .arco-table-container{border: 1px solid rgba(133, 142, 189, 0.2);border-bottom: none;}
      thead>.arco-table-tr{
        height: 46px;
        .arco-table-th{
          background: rgba(218, 224, 242, .4);
          .arco-table-th-title{
            font-size: 14px;
            color: #858EBD;
          }
        }
      }
      tbody>.arco-table-tr{
        height: 44px !important;
        &:hover{
          .arco-table-cell,.arco-table-td{
            background-color: rgba(218, 224, 242, .1) !important;
          }
        }
        .arco-table-cell,.arco-table-td{
          font-size: 14px;
          color: #858EBD;
          background-color: #FBFBFD !important;
        }
      }
    }
  }
  </style>
  