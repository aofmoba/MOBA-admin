<template>
  <div class="content-wrap other-form m-30">
    <a-space style="margin-bottom: 40px;">
      <a-input :style="{width:'355px'}" placeholder="输入赛事或赛点名称" />
      <a-button class="active" style="width: 80px; height: 36px; margin-left: 12px;"><div style="font-size: 16px;font-weight: bold;line-height: 36px;">查询</div></a-button>
    </a-space>
    <div ref="tableRef" class="content-table">
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
            title="顺序"
            data-index="order"
            :width="104"
          />
          <a-table-column
            title="类型"
            data-index="type"
            :width="80"
          />
          <a-table-column
            title="标题"
            data-index="title"
            :width="230"
          />
          <a-table-column
            title="小图"
            data-index="image"
            :width="244"
          >
            <template #cell="{ record }">
              <div class="flex-center">
                <img :src="record.image" style="width: 224px;height: 80px;" alt="">
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="时间段"
            data-index="duration"
            :width="270"
          />
          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-space style="display: flex; flex-direction: column;">
                <a-button class="active noboxshadow" style="width: 103px; height: 32px;" @click="toPointList(record.name)"><div style="font-size: 14px;line-height: 32px;">编辑</div></a-button>
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
  page: 1,
  current: 1,
  pageSize: 10,
})

const toPointList = (data: any) => {

}


// pagination
const onPageChange = async (current: number) => {
  pagination.current = current;
};
const initData = () => {
  setLoading(false)
  useDate = []
  // useDate = reactive(Array(10).fill(null).map((_, index) => ({
  //   order: String(index+1),
  //   type: '图文',
  //   title: '社区内容管理标题在这社区内容管理标题在这',
  //   image: 'https://moba-project.s3-accelerate.amazonaws.com/admin/demo.jpg',
  //   duration: '2023-01-30 15:30-2023-01-30 16:30',
  // })));
}

onMounted(() => {
  setTimeout(()=>{tableHeight = tableRef.clientHeight - 102.4},0)
  initData()
})

</script>

<style scoped lang="less">
</style>
