<template>
  <div class="content-wrap other-form m-30">
    <a-space style="margin-bottom: 40px;">
      <a-input :style="{width:'355px'}" placeholder="输入擂台名称" />
      <a-button class="active" style="width: 80px; height: 36px; margin-left: 12px;"><div style="font-size: 16px;font-weight: bold;line-height: 36px;">查询</div></a-button>
    </a-space>
    <div ref="tableRef" class="content-table">
      <a-table
        column-resizable
        :bordered="{ cell: false }"
        :scroll="{y:tableHeight}"
        :data="useData"
        :loading="loading"
        :pagination="pagination" 
        @page-change="onPageChange"
      >
        <template #empty>
          <div style="margin-top: 75px;"><img v-if="!loading" style="width: 194px;" src="https://moba-project.s3-accelerate.amazonaws.com/admin/empty.png" alt=""></div>
        </template>
        <template #pagination-left>
          <div class="left-icon flex-center" style="pointer-events: none;margin-right: -32px;"><icon-arrow-left /></div>
        </template>
        <template #pagination-right>
          <div class="right-icon flex-center" style="pointer-events: none;margin-left: -44px;"><icon-arrow-right /></div>
        </template>
        <template #columns>
          <a-table-column
            title="擂台ID"
            data-index="arenaId"
            :width="118"
          />
          <a-table-column
            title="申请人"
            data-index="address"
          />
          <a-table-column
            title="夺旗所在地点"
            data-index="name"
          />
          <a-table-column
            title="有效期"
            data-index="validtime"
            :width="220"
          />
          <a-table-column
            title="参与人数"
            :width="167"
            >
            <template #cell="{ record }">{{ [-1,1,2].includes(record.status) ?  '--' : record.playerNum }}</template>
          </a-table-column>
          <a-table-column title="状态" :width="104">
            <template #cell="{ record }">
              <div v-if="record.status === -1" style="color: #858EBD;">审核中</div>
              <div v-else-if="record.status === 1" class="flex-center" style="color: #FFA925;">
                已拒绝
                <img class="cursor-pointer refuse-img" src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/question.svg" alt="" @click="sureHandler(record, -1)">
              </div>
              <div v-else-if="record.status === 2" style="color: #4458FE;">待开始</div>
              <div v-else-if="record.status === 3" style="color: #FF2855;">进行中</div>
              <div v-else style="color: #3A3F63;">已结束</div>
            </template>
          </a-table-column>
          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-space v-if="record.status === -1" style="display: flex; flex-direction: column;">
                <a-button class="active noboxshadow" style="width: 103px; height: 32px;" @click="sureHandler(record,1)"><div style="font-size: 14px;line-height: 32px;">同意</div></a-button>
                <a-button class="default" style="width: 103px; height: 32px; margin-top: 10px;" @click="sureHandler(record,0)"><div style="width: 100px;font-size: 14px;line-height: 29px;">拒绝</div></a-button>
              </a-space>
              <a-space v-if="![-1,1,2].includes(record.status)" style="display: flex; flex-direction: column;">
                <a-button class="active noboxshadow" style="width: 103px; height: 32px;" @click="showRangking(record)"><div style="font-size: 14px;line-height: 32px;">查看排行榜</div></a-button>
                <a-button v-if="record.status === 3" class="default" style="width: 103px; height: 32px; margin-top: 10px;" @click="sureHandler(record,2)"><div style="width: 100px;font-size: 14px;line-height: 29px;">结束比赛</div></a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
  <Ranking :showbol="visible" :arenaid="ranksID" :rewards="ranksRewards" @change-rang="changeRang" />
  <ReviewMessage :showbol="sureDialog" :actiontype="actionType" :sureid="sureNum" @cloosehandler="clooseSurehandler"/>
  <RefuseMessage :showbol="refuseDialog" :actiontype="actionType" :refuseid="refuseid" :title="rejectReason?'拒绝原因':'拒绝信息'" :reason="rejectReason" @cloosehandler="clooseRefusehandler"/>
</template>

<script lang="ts" setup>
import { onMounted, onActivated } from "vue"
import useLoading from '@/hooks/loading'
import { useRouter } from 'vue-router'
import { vertTime } from '@/utils/computed'
import { queryArenaList } from '@/api/challenge';
import type { ArenaLists, ArenaListsRes } from '@/api/challenge';
import Ranking from '@/views/challenge-management/components/rangking.vue'
import ReviewMessage from '@/components/little-com/review-message/sure.vue'
import RefuseMessage from '@/components/little-com/review-message/refuse.vue'

const router = useRouter()
const { loading, setLoading } = useLoading(true);
const tableRef: any = $ref(null)
let tableHeight: number = $ref(0)
let useData: ArenaLists[] = $ref([]);
const pagination: any = $ref({
  type: 'pagination',
  page: 1,
  current: 1,
  pageSize: 10,
})



// pagination
const onPageChange = async (current: number) => {
  pagination.current = current;
  setLoading(true)
  // eslint-disable-next-line no-use-before-define
  const tempData = await getData() || {total: 0,data:[]}
  useData = tempData.data
  pagination.total = tempData.total
  setLoading(false)
};


let sureDialog: boolean = $ref(false)
let sureNum: number = $ref()
let actionType: string = $ref('')
let refuseid: number = $ref()
let refuseDialog: boolean = $ref(false)
let rejectReason: string = $ref('')
const sureHandler = (record: any,type: number) => {
  if( type === -1 ) { // 拒绝信息提示
    actionType = ''
    rejectReason = record.reject_reason
    refuseDialog = true
    return
  }
  if( record.status === -1 || record.status === 3 ){
    if( type === 0 ){ // 拒绝
      actionType = '擂台'
      refuseid = record.arenaId
      refuseDialog = true
    }else{ // 1：同意 2：结束比赛
      actionType = type === 1 ? '擂台' : '结束比赛'
      sureNum = record.arenaId
      sureDialog = true
    }
  }
}


// eslint-disable-next-line consistent-return
const computedStatus = (rstatus: number,start: number,end: number) => {
  if( Number(rstatus) === 0 ) return -1
  if( Number(rstatus) === 2 ) return 1
  const now = Math.floor(new Date().getTime() / 1000)
  if( now < start ) return 2
  if( now >= start && now < end ) return 3
  if( now >= end ) return 0
}


// eslint-disable-next-line consistent-return
const getData = async () => {
  const result: ArenaListsRes | any = await queryArenaList({pageno: pagination.current,pagesize: pagination.pageSize}).catch(()=>setLoading(false))
  if( result.data.list ){
    pagination.total = result.data.total
    const temp: ArenaLists[] = result.data.list.map((item: any) => ({
      ...item,
      validtime: `${vertTime(item.startTime)}-${vertTime(item.finTime)}`,
      status: computedStatus(item.review_status,item.startTime,item.finTime)
    }))
    return {total: result.data.total,data: temp}
  }
}



const initData = async () => {
  pagination.current = 1
  pagination.pageSize = 10
  const tempData = await getData() || {total: 0,data:[]}
  useData = tempData.data
  pagination.total = tempData.total
  setLoading(false)
}


let visible: boolean = $ref(false)
const changeRang = (data: boolean) => {
  visible = data
}
let ranksID: number = $ref()
let ranksRewards: any = $ref([])
const showRangking = (data: any) => {
    visible = true
    ranksID = data.arenaId
    ranksRewards = data.rewards
}

const clooseSurehandler = (res: boolean ) => {
  actionType = ''
  sureDialog = false
  if( res ) initData()
}
const clooseRefusehandler = (res: boolean ) => {
  actionType = ''
  refuseDialog = false
  if( res ) initData()
}

onActivated(()=>{
  if( !loading.value ){
    initData()
  }
})

onMounted(() => {
  setTimeout(()=>{tableHeight = tableRef.clientHeight - 58},0)
  initData()
})

</script>

<style scoped lang="less">
</style>
