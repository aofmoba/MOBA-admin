<template>
  <div class="privilege-wrap other-form m-30">
    <a-space style="margin-bottom: 40px;">
      <a-input :style="{width:'355px'}" placeholder="输入权限备注或游戏ID" />
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
            title="权限类型"
            data-index="type"
            :width="131"
          />
          <a-table-column
            title="权限备注"
            data-index="remarks"
            :width="183"
          />
          <a-table-column
            title="游戏ID"
            data-index="gameID"
            :width="168"
          />
          <a-table-column
            title="国家-省份-城市"
            data-index="place"
            :width="147"
          />
          <a-table-column
            title="有效期"
            data-index="validtime"
            :width="326"
          />
          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-space style="display: flex; flex-direction: column;">
                <a-button class="active noboxshadow" style="width: 103px; height: 32px;" @click="editInfo(record)"><div style="font-size: 14px;line-height: 32px;">编辑</div></a-button>
                <a-button class="default" style="width: 103px; height: 32px; margin-top: 10px;"><div style="width: 100px;font-size: 14px;line-height: 29px;">删除</div></a-button>
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
  useDate = []
  // useDate = reactive(Array(10).fill(null).map((_, index) => ({
  //   type: '地区推广商',
  //   remarks: '超级无敌备注',
  //   gameID: String(1234578+index),
  //   place: '中国-四川-成都',
  //   validtime: '2023-01-30 15:30-2023-01-30 16:30',
  // })));
}
const editInfo = (record: any) => {
}
onMounted(() => {
  setTimeout(()=>{tableHeight = tableRef.clientHeight - 58},0)
  initData()
})

</script>

<style scoped lang="less">
</style>
