<template>
  <div class="content-wrap other-form m-30">
    <a-space style="margin-bottom: 40px;flex-wrap: wrap;">
      <div class="flex-items font-md white-nowrap">
        <span class="mcolor-1">所属赛事：</span>
        <div class="blue-1 ml-30" style="min-width: 227px;margin-right: 80px;font-weight: bold;">{{ '赛事名称18个字' }}</div>
      </div>
      <div>
        <a-input :style="{width:'355px'}" placeholder="输入赛点名称"/>
        <a-button class="active" style="width: 80px; height: 36px; margin-left: 12px;"><div style="font-size: 16px;font-weight: bold;line-height: 36px;">查询</div></a-button>
      </div>
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
            title="申请人"
            data-index="applicant"
          />
          <a-table-column
            title="赛点名称"
            data-index="name"
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
              <div v-else-if="record.status === 1" style="color: #FFA925;">已拒绝</div>
              <div v-else-if="record.status === 2" style="color: #4458FE;">待开始</div>
              <div v-else-if="record.status === 3" style="color: #FF2855;">进行中</div>
              <div v-else style="color: #3A3F63;">已结束</div>
            </template>
          </a-table-column>
          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-space style="display: flex; flex-direction: column;">
                <a-button class="active noboxshadow" style="width: 103px; height: 32px;" :disabled="record.status === -1 ? false : true"  @click="sureHandler(record,1)"><div style="font-size: 14px;line-height: 32px;">同意</div></a-button>
                <a-button class="default" style="width: 103px; height: 32px; margin-top: 10px;"  :disabled="record.status === -1 ? false : true"  @click="sureHandler(record,0)"><div style="width: 100px;font-size: 14px;line-height: 29px;">拒绝</div></a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
  <ReviewMessage :showbol="sureDialog" :actiontype="actionType" :sureid="sureNum" @cloosehandler="clooseSurehandler"/>
  <RefuseMessage :showbol="refuseDialog" :actiontype="actionType" :refuseid="refuseid" @cloosehandler="clooseRefusehandler"/>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue"
import useLoading from '@/hooks/loading'
import { useRouter } from 'vue-router'
import ReviewMessage from '@/components/little-com/review-message/sure.vue'
import RefuseMessage from '@/components/little-com/review-message/refuse.vue'

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

// pagination
const onPageChange = async (current: number) => {
  pagination.current = current;
};

let sureNum: number = $ref()
let sureDialog: boolean = $ref(false)
let actionType: string = $ref('')
let refuseid: number = $ref()
let refuseDialog: boolean = $ref(false)
const sureHandler = (record: any,type: number) => {
  if( record.status !== -1 ) return
  if( type === 1 ){ // 同意
    actionType = '赛事'
    sureNum = record.id
    sureDialog = true
  }else if ( type === 0 ){ // 拒绝
    actionType = '赛事'
    refuseid = record.id
    refuseDialog = true
  }
}

const clooseSurehandler = (res: boolean ) => {
  actionType = ''
  sureDialog = res
}
const clooseRefusehandler = (res: boolean ) => {
  actionType = ''
  refuseDialog = res
}




const initData = () => {
  setLoading(false)
  useDate = []
  // useDate = reactive(Array(10).fill(null).map((_, index) => ({
  //   id: Number(`1234567${index}`),
  //   applicant: '申请人昵称',
  //   name: '中国-四川-成都',
  //   validtime: '2023-01-3015:30-2023-01-30 16:30',
  //   playerNum: 10,
  //   status: index-1
  // })));
}

onMounted(() => {
  setTimeout(()=>{tableHeight = tableRef.clientHeight - 58},0)
  initData()
})

</script>

<style scoped lang="less">
</style>
