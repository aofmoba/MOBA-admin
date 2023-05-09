<template>
  <div class="other-form" style="padding: 10px 30px 22px;">
    <div ref="tableRef" class="race-table">
      <a-table
        column-resizable
        :bordered="{ cell: false }"
        :data="useData"
        :loading="loading"
        row-key="teamId"
        :expanded-keys="expands"
        :pagination="false"
      >
        <template #expand-row>
            <a-table class="expand-table" :loading="inloading" :data="expandData" :pagination="false">
              <template #empty>
                <div style="margin-top: 75px;"><img v-if="!inloading" style="width: 194px;" src="https://moba-project.s3-accelerate.amazonaws.com/admin/empty.png" alt=""></div>
              </template>
              <template #columns>
                <a-table-column
                  title="选手ID"
                  data-index="id"
                  :width="133"
                />
                <a-table-column
                  title="选手昵称"
                  :width="325"
                >
                  <template #cell="{ record }">
                    {{ record.name ? record.name : '--' }}
                  </template>
                </a-table-column>
                <a-table-column
                  title="主玩位置"
                  :width="102"
                >
                  <template #cell="{ record }">
                    {{ getPlayerMainPos(record.mainPos) }}
                  </template>
                </a-table-column>
                <a-table-column title="" />
              </template>
            </a-table>
        </template>
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
            title="名次"
            data-index="rank"
            :width="104"
          />
          <a-table-column
            title="队伍编号"
            data-index="id"
            :width="211"
          />
          <a-table-column
            title="队伍名称"
            data-index="name"
            :width="251"
          />
          <a-table-column
            title="人数"
            data-index="person"
            :width="180"
          />
          <a-table-column title="操作" :width="216">
            <template #cell="{ record }">
              <a-space class="flex-content">
                <a-button class="active noboxshadow" style="width: 103px; height: 32px;" :disabled="celloading" @click="cancelRank(record)"><div style="font-size: 14px;line-height: 32px;"><a-spin v-if="celloading"/>取消名次</div></a-button>
              </a-space>
            </template>
          </a-table-column>
          <a-table-column
            type="expend"
            title=""
          >
            <template #cell="{ record }">
              <div class="o-expend white-nowrap" @click="expandRow(record.id)">
                <span class="expend-btn" style="color: #858EBD;">展开</span>
                <icon-down v-if="expands.indexOf(record.id) < 0" class="iconStyle" />
                <icon-up v-else class="iconStyle" />
              </div>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
    <a-space class="flex justify-end items-end" style="margin-top: 30px;">
      <a-button class="default" style="width:180px; height: 54px;" @click="prevStep"><div style="font-size: 18px;line-height: 50px;font-weight: bold;">返回上一步</div></a-button>
      <a-button class="active" style="width: 180px; height: 54px;" @click="saveRank"><div style="font-size: 18px;line-height: 54px;font-weight: bold;">保存</div></a-button>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import { TableData } from "@arco-design/web-vue";
import { onMounted, reactive, onActivated } from "vue"
import { useRouter } from 'vue-router'
import { getPlayerMainPos } from '@/utils/filterData'
import useLoading from '@/hooks/loading'
import {  
  queryComPointCheckinList,
  queryPointTeamInfo,
  queryPlayerInfo,
} from '@/api/competition';

const emit = defineEmits(['on-next','on-prev'])
const router = useRouter()
const { loading, setLoading } = useLoading(true);
const { loading: inloading, setLoading: inSetLoading } = useLoading(false);
const tableRef: any = $ref(null)
let queryData: any = $ref()
const useData: TableData[] = $ref([]);
const datas: TableData[] = reactive([{
    id: 12345,
    rank: 1,
    name: '超级无敌战队',
    person: 5,
    info:[{
        playerID: 12345678,
        playerNickname: '嘻嘻哈哈嘻皮狗',
        mainPlay: '发育路'
    },{
        playerID: 12345679,
        playerNickname: '嘻嘻哈哈嘻皮狗',
        mainPlay: '发育路'
    }]
    }, {
    id: 12346,
    rank: 2,
    name: '超级无敌战队',
    person: 5,
    info:[{
        playerID: 1223344,
        playerNickname: '嘻嘻哈哈嘻皮狗',
        mainPlay: '发育路'
    },{
        playerID: 1223345,
        playerNickname: '嘻嘻哈哈嘻皮狗',
        mainPlay: '发育路'
    }]
}])

const allExpandData: any = $ref([]) // 保存查看的所有队伍成员
let expandData: any = $ref([]) // 队伍选手
let expands:any = $ref([]) // 队伍id
const expandRow = (record: any) => {
  if (expands.indexOf(String(record.teamId)) < 0) {
    expands = []
    expands.push(String(record.teamId))
    const temp = allExpandData.findIndex((ele: any) => ele[0].teamId === record.teamId)
    if( temp > -1 ){ expandData = allExpandData[temp] }
    else{
      inSetLoading(true)
      record.members.forEach((item: any,i: number) => {
        queryPlayerInfo(item.id).then((res: any) => {
          if( res.error_code === 0 ){
            expandData[i] = {...res.data.comp,name: res.data.name,teamId:record.teamId }
          }
        }).finally(()=>{inSetLoading(false)})
      })
      allExpandData.push(expandData)
    }
  } else {
      expands = [];
  }
}

const querySingalTeam = (data: object[]) =>{
  data.forEach((item: any )=>{
    queryPointTeamInfo(item.teamId).then((res: any)=>{
      if( res.error_code === 0 ){
        const temp = useData.findIndex((ele: any) => ele.teamId === res.data.teamId)
        if( temp > -1 ) {
          const olddata = useData[temp]
          useData[temp] = {
            ...olddata,
            ...res.data,
            person: res.data.members.length,
          }
        }
      }
    }).finally(()=>{setLoading(false)})
  })
}

const initData = (id: string) => {
  setLoading(false)
  // useData = data
  // queryComPointCheckinList(id).then((res: any) => {
  //   if( res.error_code === 0 ) {
  //     useData = res.data
  //     if( !useData.length ) { setLoading(false); return}
  //     useData = useData.map((item: any,i: number)=>({teamId:item,indexId: i+1}))
  //     // eslint-disable-next-line no-use-before-define
  //     querySingalTeam( useData )
  //   }
  // }).catch(()=>{setLoading(false)})
}

const celloading: boolean = $ref(false)
const cancelRank = (record: any) => {}

const saveRank = () => {
  router.push({path:'/pointlist',query:{ match: queryData.compName,compId: queryData.compId }})
}

const prevStep = () => {
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('on-prev')
}


onActivated(()=>{
  if( !loading.value ){
    queryData = JSON.parse(localStorage.getItem('matchinfo') || '')
    initData(queryData.id)
  }
})

onMounted(() => {
  queryData = JSON.parse(localStorage.getItem('matchinfo') || '')
  initData(queryData.id)
})

</script>
  
<style scoped lang="less">
.iconStyle{
  font-size: 16px;
  margin-left: 16px;
  color: #858EBD;
}
.o-expend{
  font-weight: 500;
  .expend-btn,.iconStyle{cursor: pointer;}
  &:hover{
    .expend-btn,.iconStyle{
      color: #4458FE !important;
    }
  }
}

:deep(.race-table){
    &>.arco-table,&>.arco-table>.arco-spin{
        min-height: 324px;
    }
    &>.arco-table{
      tbody>.arco-table-tr:not(.arco-table-tr-expand .arco-table-tr){
        height: 72px !important;
      }
    }
  }
</style>
  