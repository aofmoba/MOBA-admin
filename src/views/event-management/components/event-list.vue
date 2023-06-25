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
          <div class="left-icon flex-center"><icon-arrow-left /></div>
        </template>
        <template #pagination-right>
          <div class="right-icon flex-center"><icon-arrow-right /></div>
        </template>
        <template #columns>
          <a-table-column
            title="赛事ID"
            data-index="warId"
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
            :width="200"
          />
          <a-table-column
            title="对战方式"
            data-index="fightNumText"
            :width="117"
          />
          <a-table-column
            title="报名队伍"
            data-index="troopListNum"
            :width="117"
          />
          <a-table-column title="状态" :width="114">
            <template #cell="{ record }">
              <div v-if="record.status == 0" style="color: #4458FE;">未开始</div>
              <div v-else-if="record.status == 1" style="color: #FF2855;">进行中</div>
              <div v-else style="color: #3A3F63;">已结束</div>
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="191">
            <template #cell="{ record }">
              <a-space style="display: flex; flex-direction: column;">
                <a-button v-if="record.status != 0" class="active noboxshadow" style="width: 103px; height: 32px;" @click="showRangking(record)"><div style="font-size: 14px;line-height: 32px;">查看排行榜</div></a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
  <Ranking :showbol="visible" :rankList="rankList" @change-rang="changeRang" />
</template>

<script lang="ts" setup>
import { onMounted, onActivated } from "vue"
import useLoading from '@/hooks/loading'
import { useRouter } from 'vue-router'
import { vertTime } from '@/utils/computed'
import { queryCompetitionList } from '@/api/competition';
import type { newcomListRes, newcompetitionInfo } from '@/api/competition';
import Ranking from './rangking.vue'

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
const getData = async () => {
  const result: newcomListRes | any = await queryCompetitionList({pageno: pagination.current,pagesize: pagination.pageSize}).catch(()=>setLoading(false))
  if( result.data.list ){
    pagination.total = result.data.total
    const temp: newcompetitionInfo[] = result.data.list.map((item: any) => ({
      ...item,
      validtime: (item.startTime && item.finishTime) ? `${vertTime(item.startTime)}-${vertTime(item.finishTime)}` : '--',
      troopListNum: item.troopList?.length || 0,
      fightNumText: `${item.fightNum  }V${  item.fightNum}`
    }))
    return {total: result.data.total,list: temp}
  }
}
// pagination
const onPageChange = async (current: number) => {
  pagination.current = current;
  setLoading(true)
  // eslint-disable-next-line no-nested-ternary
  const tempData: newcomListRes = await getData() || {total: 0,list:[]}
  useData = tempData.list
  pagination.total = tempData.total
  setLoading(false)
};
const initData = async () => {
  pagination.current = 1
  pagination.pageSize = 10
  const tempData: newcomListRes = await getData() || {total: 0,list:[]}
  useData = tempData.list
  pagination.total = tempData.total
  setLoading(false)
}

let visible: boolean = $ref(false)
let rankList: Array<number> = $ref([])
const showRangking = (data: any) => {
  if( ![0].includes(data.status) ){ // 查看排行榜 
    visible = true
    rankList = data.rankList
  }
}
const changeRang = (data: boolean) => {
  visible = data
}

onActivated(()=>{
  if( !loading.value ){
    initData()
  }
})

onMounted(() => {
  setTimeout(()=>{tableHeight = tableRef.clientHeight - 102.4},0)
  initData()
})

</script>

<style scoped lang="less">
</style>
