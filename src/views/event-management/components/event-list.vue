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
            title="赛事ID"
            data-index="id"
            :width="118"
          />
          <a-table-column
            title="赛事名称"
            data-index="name"
            :width="211"
          />
          <a-table-column
            title="时间"
            data-index="datetime"
            :width="210"
          />
          <a-table-column
            title="赛点数量"
            data-index="pointNumber"
            :width="129"
          />
          <a-table-column
            title="报名人数"
            data-index="signNumber"
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
                <a-button class="active noboxshadow" style="width: 103px; height: 32px;" @click="toPointList(record.name)"><div style="font-size: 14px;line-height: 32px;">赛点列表</div></a-button>
                <a-button class="default" style="width: 103px; height: 32px; margin-top: 10px;"><div style="width: 100px;font-size: 14px;line-height: 29px;">添加赛点</div></a-button>
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

const router = useRouter()
const { loading, setLoading } = useLoading(true);
const tableRef: any = $ref(null)
let tableHeight: number = $ref(0)
let useDate:any = $ref([]);
const pagination: any = $ref({
  type: 'pagination',
  page: 50,
  current: 1,
  pageSize: 4,
})

// pagination
const onPageChange = async (current: number) => {
  pagination.current = current;
};
const initData = () => {
  setLoading(false)
  useDate = reactive(Array(10).fill(null).map((_, index) => ({
    id: String(1234578+index),
    name: '赛事名称最多18个字',
    datetime: '2023.1.02-2023.4.02',
    pointNumber: 10,
    signNumber: 10,
    status: String(index+1),
  })));
}
const toPointList = (name: string) => {
  router.push({path: '/pointlist',query:{ match: name }})
}
onMounted(() => {
  setTimeout(()=>{tableHeight = tableRef.clientHeight - 58},0)
  initData()
})

</script>

<style scoped lang="less">
</style>
