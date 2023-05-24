<template>
  <div class="challenge-wrap other-form m-30">
    <div class="groups flex-items between">
      <div class="tabs flex">
        <div :class="{'active': activeIndex == 0}" @click="changeTable(0)">城市擂台</div>
        <div :class="{'active': activeIndex == 1}" @click="changeTable(1)">地点擂台</div>
        <div :class="{'active': activeIndex == 2}" @click="changeTable(2)">地标擂台</div>
      </div>
      <a-space>
        <a-input :style="{width:'355px'}" placeholder="输入擂台名称" />
        <a-button class="active" style="width: 80px; height: 36px; margin-left: 12px;"><div style="font-size: 16px;font-weight: bold;line-height: 36px;">查询</div></a-button>
      </a-space>
    </div>
    <div ref="tableRef" class="event-table">
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
            title="擂台所在城市"
            data-index="name"
          />
          <a-table-column
            v-if="activeIndex !== 0"
            title="擂台所在地点"
            data-index="arenaName"
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
                <img class="cursor-pointer refuse-img" src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/question.svg" alt="" @click="sureHandler(record.reject_reason)">
              </div>
              <div v-else-if="record.status === 2" style="color: #4458FE;">未开始</div>
              <div v-else-if="record.status === 3" style="color: #FF2855;">进行中</div>
              <div v-else style="color: #3A3F63;">已结束</div>
            </template>
          </a-table-column>
          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-space style="display: flex; flex-direction: column;">
                <a-button v-if="record" class="active noboxshadow" :disabled="record.status === 1" style="width: 103px; height: 32px;" @click="showRangking(record)">
                  <div style="font-size: 14px;line-height: 32px;">{{ [-1,1,2].includes(record.status) ? '编辑':'查看排行榜' }}</div>
                </a-button>
                <a-button class="default" :disabled="[-1,1,2].includes(record.status) ? false : true" style="width: 103px; height: 32px; margin-top: 10px;" @click="deleteArenaFun(record)"><div style="width: 98.5px;font-size: 14px;line-height: 27.5px;">删除</div></a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
  <a-modal 
    v-model:visible="sureDelete" 
    modal-class="del-lots"
  >
    <template #title>
      <div style="font-size: 20px;line-height: 28px;color: #3A3F63;font-weight: bold;">确认信息</div>
      <img class="close-btn" style="width: 32px;height: 32px;" src="https://moba-project.s3-accelerate.amazonaws.com/admin/close.svg" alt="" @click="sureDelete = false">
    </template>
    <div class="flex-center font-md mcolor-1">
      <div>您确定要删除此擂台吗？</div>
    </div>
    <template #footer>
      <a-space>
        <a-button class="active noboxshadow " :disabled="delLoading" style="width:128px; height: 40px;" @click="deleteHandler">
          <div style="font-size: 16px;line-height: 40px;font-weight: bold;"><a-spin v-if="delLoading"/> 确认</div>
        </a-button>
      </a-space>
      <div class="cancel blue-1 cursor-pointer" @click="sureDelete = false">取消</div>
    </template>
  </a-modal>
  <Ranking :showbol="visible" :arenaid="ranksID" :rewards="ranksRewards" @change-rang="changeRang" />
  <RefuseMessage :showbol="refuseDialog" title="拒绝原因" :reason="rejectReason" @cloosehandler="clooseRefusehandler"/>
</template>

<script lang="ts" setup>
import { onActivated, onMounted, computed, ComputedRef } from "vue"
import useLoading from '@/hooks/loading'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store';
import { vertTime } from '@/utils/computed'
import { Message } from '@arco-design/web-vue';
import { queryArenaList, deleteArena } from '@/api/challenge';
import type { ArenaLists, ArenaListsRes } from '@/api/challenge';
import { RoleType } from "@/store/modules/user/types";
import RefuseMessage from '@/components/little-com/review-message/refuse.vue'
import Ranking from './rangking.vue'

const router = useRouter()
const userStore = useUserStore();
const permissions: ComputedRef<RoleType[]> = computed(() => userStore.$state.permissions );
const { loading, setLoading } = useLoading(true);
const tableRef: any = $ref(null)
let activeIndex: number = $ref(0)
let visible: boolean = $ref(false)
let tableHeight: number = $ref(0)
let useData: ArenaLists[] = $ref([]);
interface allDataTypeRes {
  total: number;
  data: ArenaLists[];
}
interface allDataType {
  cityData: allDataTypeRes,
  placeData: allDataTypeRes,
  markData: allDataTypeRes,
}
let allData: allDataType = $ref({
  cityData: {total: 0, data:[]},
  placeData: {total: 0, data:[]},
  markData: {total: 0, data:[]},
})
const pagination: any = $ref({
  type: 'pagination',
  total: 1,
  current: 1,
  pageSize: 10,
})


// eslint-disable-next-line consistent-return
const computedStatus = (start: number,end: number,rstatus: number) => {
  if( Number(rstatus) === 0 ) return -1
  if( Number(rstatus) === 2 ) return 1
  const now = Math.floor(new Date().getTime() / 1000)
  if( now < start ) return 2
  if( now >= start && now < end ) return 3
  if( now >= end ) return 0
}


// eslint-disable-next-line consistent-return
const getData = async (index: number) => { // api arena_type: 1-城市 0-地点 2-地标
  let arenatype = 1 // 默认1为城市擂台
  // eslint-disable-next-line no-nested-ternary
  arenatype = index === 2 ? 2 : (index === 0 ? 1:0) // index为按钮下标，按钮1（城市）下标0，按钮2（地点）下标1，按钮3（地标）下标2
  const result: ArenaListsRes | any = await queryArenaList({arena_type: arenatype,pageno: pagination.current,pagesize: pagination.pageSize}).catch(()=>setLoading(false))
  if( result.data.list ){
    pagination.total = result.data.total
    const temp: ArenaLists[] = result.data.list.map((item: any) => ({
      ...item,
      validtime: `${vertTime(item.startTime)}-${vertTime(item.finTime)}`,
      status: computedStatus(item.startTime,item.finTime,item.review_status)
    }))
    return {total: result.data.total,data: temp}
  }
}


// pagination
const onPageChange = async (current: number) => {
  pagination.current = current;
  setLoading(true)
  // eslint-disable-next-line no-nested-ternary
  const tempData: allDataTypeRes = await getData(activeIndex) || {total: 0,data:[]}
  useData = tempData.data
  pagination.total = tempData.total
  setLoading(false)
};

const initData = async() => {
  activeIndex = 0
  pagination.current = 1
  pagination.pageSize = 10
  const tempData = await getData(0) || {total: 0,data:[]}
  allData.cityData = tempData
  useData = allData.cityData.data
  pagination.total = allData.cityData.total
  setLoading(false)
}
const changeTable = async (index: number) => {
  activeIndex = index
  pagination.current = 1
  setLoading(true)
  // 直接使用保存的擂台第一页数据
  // if( index === 0 && allData.cityData.data.length ) {useData = allData.cityData.data;pagination.total = allData.cityData.total }
  // else if( index === 1 && allData.placeData.data.length ) {useData = allData.placeData.data;pagination.total = allData.placeData.total }
  // else if( index === 2 && allData.markData.data.length ) {useData = allData.markData.data;pagination.total = allData.markData.total }
  // else{
  //    代码同下
  // }
  // eslint-disable-next-line no-nested-ternary
  const tempData: allDataTypeRes = await getData(index) || {total: 0,data:[]}
  // eslint-disable-next-line no-multi-assign
  if( index === 1 ) {allData.placeData = tempData;}
  // eslint-disable-next-line no-multi-assign
  else if( index === 2 ) {allData.markData = tempData;}
  // eslint-disable-next-line no-multi-assign
  else {allData.cityData = tempData;}
  useData = tempData.data
  pagination.total = tempData.total
  setLoading(false)
}


let sureDelete: boolean = $ref(false)
let delNum: number = $ref()
const deleteArenaFun = (record: any) => {
  if( [-1,1,2].includes(record.status) ){
    delNum = record.arenaId
    sureDelete = true
  }
}

let delLoading: boolean = $ref(false)
const deleteHandler = () => {
  delLoading = true
  deleteArena(delNum).then((res:any)=>{
    if( res.error_code === 0) {
      onPageChange(1)
      sureDelete = false
      Message.success('success')
    }
  }).finally(()=>{delLoading = false})
}


let ranksID: number = $ref()
let ranksRewards: any = $ref([])
const showRangking = (data: any) => {
  // eslint-disable-next-line no-useless-return 
  if( ![-1,1,2].includes(data.status) ){ // 查看排行榜 
    visible = true
    ranksID = data.arenaId
    ranksRewards = data.rewards
  }else{ // 编辑信息
    localStorage.setItem('view_arena', JSON.stringify(data))
    router.push({path: '/newmatch',query:{type: 2,arenaId: data.arenaId}})
  }
}
const changeRang = (data: boolean) => {
  visible = data
}


let rejectReason: string = $ref('')
let refuseDialog: boolean = $ref(false)
const sureHandler = (reason: string) => {
  rejectReason = reason
  refuseDialog = true
}
const clooseRefusehandler = () => {
  rejectReason = ''
  refuseDialog = false
}


onActivated(()=>{
  if( !loading.value ){
    allData = {
      cityData: {total: 0, data:[]},
      placeData: {total: 0, data:[]},
      markData: {total: 0, data:[]},
    }
    initData()
  }
})

onMounted(() => {
  setTimeout(()=>{tableHeight = tableRef.clientHeight - 58},0)
  initData()
})

</script>

<style scoped lang="less">
.groups{
  margin-bottom: 40px;
  .tabs{
    height: 40px;
    border-radius: 4px;
    border: 1px solid #DAE0F2;
    text-align: center;
    font-size: 16px;
    font-weight: normal;
    color: #3A3F63;
    div{
      width: 123px;
      line-height: 40px;
      cursor: pointer;
      &.active{
        color: #fff;
        background: #4458FE;
        box-shadow: 0px 4px 16px 0px #B3C0E7;
        border-radius: 4px;
      }
    }
  }
}
</style>
