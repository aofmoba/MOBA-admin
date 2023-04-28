<template>
  <div ref="bannerTableRef" class="banner-table m-30">
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
        <div class="left-icon flex-center" style="pointer-events: none;margin-right: -32px;"><icon-arrow-left /></div>
      </template>
      <template #pagination-right>
        <div class="right-icon flex-center" style="pointer-events: none;margin-left: -44px;"><icon-arrow-right /></div>
      </template>
      <template #columns>
        <a-table-column
          title="顺序"
          data-index="order"
          :width="104"
        />
        <a-table-column
          title="Banner"
          data-index="banner"
          :width="275"
        >
          <template #cell="{ record }">
            <div class="flex-center">
              <img :src="record.banner" style="width: 224px;height: 80px;" alt="">
            </div>
          </template>
        </a-table-column>
        <a-table-column
          title="跳转路径"
          data-index="target"
          :width="297"
        />
        <a-table-column
          title="时间段"
          data-index="duration"
          :width="234"
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
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue"
import useLoading from '@/hooks/loading'
import { useRouter } from 'vue-router'

const router = useRouter()
const { loading, setLoading } = useLoading(true);
const bannerTableRef: any = $ref(null)
let tableHeight: number = $ref(0)
let useDate:any = $ref([]);
const pagination: any = $ref({
  type: 'pagination',
  page: 1,
  current: 1,
  pageSize: 10,
})

// pagination
const onPageChange = async (current: number) => {
  pagination.current = current;
};
const toPointList = (data: any) => {

}

const initData = () => {
  setLoading(false)
  useDate = []
  // useDate = reactive(Array(10).fill(null).map((_, index) => ({
  //   order: String(index+1),
  //   banner: 'https://moba-project.s3-accelerate.amazonaws.com/admin/demo.jpg',
  //   target: 'https://pvp.qq.com',
  //   duration: '2023-01-30 15:30-2023-01-30 16:30',
  // })));
}
onMounted(() => {
  setTimeout(()=>{tableHeight = bannerTableRef.clientHeight - 58},0)
  initData()
})

</script>

<style scoped lang="less">
</style>
