<template>
  <div class="point-wrap other-form m-30">
    <a-space style="margin-bottom: 40px;flex-wrap: wrap;">
      <div class="flex-items font-md white-nowrap">
        <span class="mcolor-1">所属赛事：</span>
        <div class="blue-1 ml-30" style="margin-right: 80px;font-weight: bold;">{{ matchName }}</div>
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
          <div style="margin-top: 75px;"><img v-if="!loading" style="width: 194px;" src="@/assets/images/empty.png" alt=""></div>
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
            :width="118"
          />
          <a-table-column
            title="赛点名称"
            data-index="name"
            :width="211"
          />
          <a-table-column
            title="时间"
            data-index="validtime"
            :width="210"
          />
          <a-table-column
            title="报名人数"
            data-index="joinNum"
            :width="129"
          />
          <a-table-column
            title="参赛人数"
            data-index="signNum"
            :width="117"
          />
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
                <a-button class="active noboxshadow" style="width: 103px; height: 32px;" @click="toRaceOperation(record.name)"><div style="font-size: 14px;line-height: 32px;">赛程操作</div></a-button>
                <a-button class="default" style="width: 103px; height: 32px; margin-top: 10px;" @click="exportXLSX(record)"><div style="width: 100px;font-size: 14px;line-height: 28px;" >导出报名</div></a-button>
                <a-button class="default" :disabled="record.status == 1 ? false : true" style="width: 103.5px; height: 32.5px; margin-top: 10px;"><div style="width: 100px;font-size: 14px;line-height: 28px;">删除</div></a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue"
import useLoading from '@/hooks/loading'
import { useRouter } from 'vue-router'
import { vertTime } from '@/utils/computed'
import * as XLSX from "xlsx"
import {  
  queryCompetitionPointList,
  comPointListRes,
  competitionPointInfo
} from '@/api/competition';

const router = useRouter()
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
const exportXLSX = (teamdata: any) => {
  const data = XLSX.utils.json_to_sheet(useData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, data, teamdata.name) // test-data 为自定义的sheet表名
  XLSX.writeFile(wb,`${teamdata.id }.xlsx`) // test.xlsx 为自定义的文件名
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
  const result = await queryCompetitionPointList({pageno: pagination.current,pagesize: pagination.pageSize,compId})
  if( result.data.list ){
    pagination.total = result.data.total
    const temp: competitionPointInfo[] = result.data.list.map((item: any) => ({
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
const toRaceOperation = (name: string) => {
  router.push({path: '/operation',query:{ match: name }})
}


onMounted(() => {
  setTimeout(()=>{tableHeight = tableRef.clientHeight - 58},0)
  matchName = String(router.currentRoute.value.query.match)
  compId = String(router.currentRoute.value.query.compId)
  initData()
})
</script>

<style scoped lang="less">

</style>
