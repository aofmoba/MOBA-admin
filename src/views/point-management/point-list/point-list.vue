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
        :data="useDate"
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
            data-index="datetime"
            :width="210"
          />
          <a-table-column
            title="报名人数"
            data-index="signNumber"
            :width="129"
          />
          <a-table-column
            title="参赛人数"
            data-index="intoNumber"
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
import * as XLSX from "xlsx"

const router = useRouter()
const { loading, setLoading } = useLoading(true);
const tableRef: any = $ref(null)
let tableHeight: number = $ref(0)
let useDate:any = $ref([]);
const pagination: any = $ref({
  type: 'pagination',
  page: 1,
  current: 1,
  pageSize: 10,
})
const exportXLSX = (teamdata: any) => {
  const data = XLSX.utils.json_to_sheet(useDate)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, data, teamdata.name) // test-data 为自定义的sheet表名
  XLSX.writeFile(wb,`${teamdata.id }.xlsx`) // test.xlsx 为自定义的文件名
}

// pagination
const onPageChange = async (current: number) => {
  pagination.current = current;
};
const initData = () => {
  setLoading(false)
  setTimeout(()=>{
    useDate = reactive(Array(10).fill(null).map((_, index) => ({
      id: String(1234578+index),
      name: '赛事名称最多18个字',
      datetime: '2023.1.02-2023.4.02',
      intoNumber: 10,
      signNumber: 10,
      status: String(index+1),
    })));
  },10)
}
const toRaceOperation = (name: string) => {
  router.push({path: '/operation',query:{ match: name }})
}

let matchName: string = $ref('')
onMounted(() => {
  setTimeout(()=>{tableHeight = tableRef.clientHeight - 58},0)
  matchName = String(router.currentRoute.value.query.match)
  initData()
})
</script>

<style scoped lang="less">

</style>
