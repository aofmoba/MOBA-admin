<template>
  <div class="point-wrap other-form m-30">
    <a-space style="margin-bottom: 40px;flex-wrap: wrap;">
      <div class="flex-items font-md white-nowrap">
        <span class="mcolor-1">所属赛事：</span>
        <div class="blue-1 ml-30" style="min-width: 227px;margin-right: 80px;font-weight: bold;">{{ matchName }}</div>
      </div>
      <div>
        <a-input :style="{width:'355px'}" placeholder="输入赛点名称"/>
        <a-button class="active" style="width: 80px; height: 36px; margin-left: 12px;"><div style="font-size: 16px;font-weight: bold;line-height: 36px;">查询</div></a-button>
      </div>
    </a-space>
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
            title="赛点ID"
            data-index="id"
            :width="124"
          />
          <a-table-column
            title="赛点名称"
            data-index="name"
            :width="211"
          />
          <a-table-column
            title="时间"
            data-index="validtime"
            :width="220"
          />
          <a-table-column
            title="报名人数"
            :width="129"
            >
            <template #cell="{ record }">{{ record.joinNum === 1 ?  '--' : record.joinNum }}</template>
          </a-table-column>
          <a-table-column
            title="参赛人数"
            :width="117"
            >
            <template #cell="{ record }">{{ record.status === 1 ?  '--' : record.signNum }}</template>
          </a-table-column>
          <a-table-column title="状态" :width="114">
            <template #cell="{ record }">
              <div v-if="record.status == 1" style="color: #4458FE;">未开始</div>
              <div v-else-if="record.status == 2" style="color: #FF2855;">进行中</div>
              <div v-else style="color: #3A3F63;">已结束</div>
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="191">
            <template #cell="{ record }">
              <a-space style="display: flex; flex-direction: column;">
                <a-button class="active noboxshadow" style="width: 103px; height: 32px;" :disabled="![1,2].includes(record.status)" @click="toRaceOperation(record)"><div style="font-size: 14px;line-height: 32px;">赛程操作</div></a-button>
                <a-button class="default" style="width: 103px; height: 32px; margin-top: 10px;" @click="exportXLSX(record)"><div style="width: 100px;font-size: 14px;line-height: 28px;" >导出报名</div></a-button>
                <a-button class="default" :disabled="record.status == 1 ? false : true" style="width: 103.5px; height: 32.5px; margin-top: 10px;" @click="deletePointFun(record)"><div style="width: 100px;font-size: 14px;line-height: 28px;">删除</div></a-button>
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
</template>

<script lang="ts" setup>
import { onActivated, onMounted, computed, ComputedRef } from "vue"
import useLoading from '@/hooks/loading'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store';
import { vertTime } from '@/utils/computed'
import { queryCompetitionPointList } from '@/api/competition';
import type { comPointListRes, competitionPointInfo } from '@/api/competition';
import { RoleType } from "@/store/modules/user/types";
import * as XLSX from "xlsx"

const router = useRouter()
const userStore = useUserStore();
const permissions: ComputedRef<RoleType[]> = computed(() => userStore.$state.permissions );
const { loading, setLoading } = useLoading(true);
const tableRef: any = $ref(null)
let tableHeight: number = $ref(0)
let useData:any = $ref([]);
let matchName: string = $ref('')
let compId: string = $ref('')
const pagination: any = $ref({
  type: 'pagination',
  total: 1,
  current: 1,
  pageSize: 10,
})
interface allPointLists extends competitionPointInfo {
  validtime: string
  status: number,
}
const exportXLSX = (teamdata: any) => {
  // const data = XLSX.utils.json_to_sheet(useData)
  // const wb = XLSX.utils.book_new()
  // XLSX.utils.book_append_sheet(wb, data, teamdata.name) // test-data 为自定义的sheet表名
  // XLSX.writeFile(wb,`${teamdata.id }.xlsx`) // test.xlsx 为自定义的文件名
}

// eslint-disable-next-line consistent-return
const computedStatus = (start: number,end: number) => {
  const now = Math.floor(new Date().getTime() / 1000)
  if( !start && !end ) return -1
  if( now < start ) return 1
  if( now >= start && now < end ) return 2
  if( now >= end ) return 0
}

// eslint-disable-next-line consistent-return
const getData = async () => {
  // 权限处理：钱包登录用户仅查看自己列表
  const result: comPointListRes | any = await queryCompetitionPointList({pageno: pagination.current,pagesize: pagination.pageSize,compId}).catch(()=>setLoading(false))
  if( result.data.list ){
    pagination.total = result.data.total
    const temp: allPointLists[] = result.data.list.map((item: any) => ({
      ...item,
      validtime: `${vertTime(item.signTime)}-${vertTime(item.fightFinTime)}`,
      status: computedStatus(item.signTime,item.fightFinTime)
    }))
    return {total: result.data.total,list: temp}
  }
}

// pagination
const onPageChange = async (current: number) => {
  pagination.current = current;
  setLoading(true)
  // eslint-disable-next-line no-nested-ternary
  const tempData: comPointListRes = await getData() || {total: 0,list:[]}
  useData = tempData.list
  pagination.total = tempData.total
  setLoading(false)
};


const initData = async() => {
  pagination.current = 1
  pagination.pageSize = 10
  const tempData:comPointListRes = await getData() || {total: 0,list:[]}
  useData = tempData.list
  pagination.total = tempData.total
  setLoading(false)
}
const toRaceOperation = (record: allPointLists) => {
  router.push({path: '/operation'})
  localStorage.setItem('matchinfo',JSON.stringify({
    id: record.id,
    match: record.name,
    compName: matchName,
    compId,
    fightRound: record.fightRound,
    start: record.checkInTime,
    end: record.checkInFinTime,
    checkInTime: record.checkInTime,
    fightTime: record.fightTime
  }))
}


let sureDelete: boolean = $ref(false)
let delNum: number = $ref()
const deletePointFun = (record: allPointLists) => {
  if( record.status === 1 ){
    delNum = record.id
    sureDelete = true
  }
}
const delLoading: boolean = $ref(false)
const deleteHandler = () => {
  // delLoading = true
  // deleteArena(delNum).then((res:any)=>{
  //   if( res.error_code === 0) {
  //     onPageChange(1)
  //     sureDelete = false
  //     Message.success('success')
  //   }
  // }).finally(()=>{delLoading = false})
}
onActivated(()=>{
  if( !loading.value ){
    matchName = String(router.currentRoute.value.query.match)
    compId = String(router.currentRoute.value.query.compId)
    initData()
  }
})


onMounted(() => {
  setTimeout(()=>{tableHeight = tableRef.clientHeight - 58},0)
  matchName = String(router.currentRoute.value.query.match)
  compId = String(router.currentRoute.value.query.compId)
  initData()
})
</script>

<style scoped lang="less">

</style>
