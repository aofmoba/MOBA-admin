<template>
  <div class="event-wrap other-form m-30">
    <a-space style="margin-bottom: 40px;">
      <a-input :style="{width:'355px'}" placeholder="输入赛事或赛点名称" />
      <a-button class="active" style="width: 80px; height: 36px; margin-left: 12px;"><div style="font-size: 16px;font-weight: bold;line-height: 36px;">查询</div></a-button>
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
            title="赛事ID"
            data-index="id"
            :width="124"
          />
          <a-table-column
            title="赛事名称"
            data-index="name"
            :width="211"
          />
          <a-table-column
            title="时间"
            data-index="validtime"
            :width="220"
          />
          <a-table-column
            title="赛点数量"
            data-index="pointNum"
            :width="129"
          />
          <a-table-column
            title="报名队伍"
            data-index="signNum"
            :width="117"
          />
          <a-table-column title="状态" :width="114">
            <template #cell="{ record }">
              <div v-if="Math.abs(record.status) == 1" style="color: #4458FE;">未开始</div>
              <div v-else-if="record.status == 2" style="color: #FF2855;">进行中</div>
              <div v-else style="color: #3A3F63;">已结束</div>
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="191">
            <template #cell="{ record }">
              <a-space style="display: flex; flex-direction: column;">
                <a-button class="active noboxshadow" style="width: 103px; height: 32px;" @click="toPointList(record)"><div style="font-size: 14px;line-height: 32px;">赛点列表</div></a-button>
                <a-button class="default" style="width: 103px; height: 32px; margin-top: 10px;" @click="toPoint(record)"><div style="width: 100px;font-size: 14px;line-height: 29px;">添加赛点</div></a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onActivated } from "vue"
import useLoading from '@/hooks/loading'
import { useRouter } from 'vue-router'
import { vertTime } from '@/utils/computed'
import { queryCompetitionList } from '@/api/competition';
import type { comListRes, competitionInfo } from '@/api/competition';

const router = useRouter()
const { loading, setLoading } = useLoading(true);
const tableRef: any = $ref(null)
let tableHeight: number = $ref(0)
let useData:any = $ref([]);
const pagination: any = $ref({
  type: 'pagination',
  total: 1,
  current: 1,
  pageSize: 10,
})

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
  const result: comListRes | any = await queryCompetitionList({pageno: pagination.current,pagesize: pagination.pageSize}).catch(()=>setLoading(false))
  if( result.data.list ){
    pagination.total = result.data.total
    const temp: competitionInfo[] = result.data.list.map((item: any) => ({
      ...item,
      validtime: (item.startTime && item.finishTime) ? `${vertTime(item.startTime)}-${vertTime(item.finishTime)}` : '--',
      status: computedStatus(item.startTime,item.finishTime)
    }))
    return {total: result.data.total,list: temp}
  }
}
// pagination
const onPageChange = async (current: number) => {
  pagination.current = current;
  setLoading(true)
  // eslint-disable-next-line no-nested-ternary
  const tempData: comListRes = await getData() || {total: 0,list:[]}
  useData = tempData.list
  pagination.total = tempData.total
  setLoading(false)
};
const initData = async () => {
  pagination.current = 1
  pagination.pageSize = 10
  const tempData:comListRes = await getData() || {total: 0,list:[]}
  useData = tempData.list
  pagination.total = tempData.total
  setLoading(false)
}
const toPointList = (record: any) => {
  router.push({path: '/pointlist',query:{ match: record.name,compId: record.id }})
}

const toPoint = (record: any) => {
  if( record.id ){
    router.push({ path: '/newpoint', query: { compId: record.id,name: record.name,url:record.detailInfo.banner } });
  }
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
