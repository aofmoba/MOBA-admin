<template>
  <div class="other-form" style="padding: 10px 30px 22px;">
    <div ref="tableRef" class="race-table">
      <a-table
        column-resizable
        :bordered="{ cell: false }"
        :data="useDate"
        :loading="loading"
        row-key="id"
        :expanded-keys="expands"
        :pagination="false"
      >
        <template #expand-row>
            <a-table class="expand-table" :data="expandData" :pagination="false">
              <template #columns>
                <a-table-column
                  title="选手ID"
                  data-index="playerID"
                  :width="133"
                />
                <a-table-column
                  title="选手昵称"
                  data-index="playerNickname"
                  :width="325"
                />
                <a-table-column
                  title="主玩位置"
                  data-index="mainPlay"
                  :width="102"
                />
                <a-table-column title="" />
              </template>
            </a-table>
        </template>
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
            title="名次"
            data-index="id"
            :width="104"
          />
          <a-table-column
            title="队伍编号"
            data-index="name"
            :width="211"
          />
          <a-table-column
            title="队伍名称"
            data-index="person"
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
                <a-button class="active noboxshadow" style="width: 103px; height: 32px;" @click="cancelRank(record)"><div style="font-size: 14px;line-height: 32px;">取消名次</div></a-button>
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
      <a-button class="active" style="width: 180px; height: 54px;" @click="router.push({path:'/pointlist'})"><div style="font-size: 18px;line-height: 54px;font-weight: bold;">保存</div></a-button>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import { TableData } from "@arco-design/web-vue";
import { onMounted, reactive } from "vue"
import { useRouter } from 'vue-router'
import useLoading from '@/hooks/loading'

const emit = defineEmits(['on-next','on-prev'])
const router = useRouter()
const { loading, setLoading } = useLoading(true);
const tableRef: any = $ref(null)
let useDate: TableData[] = $ref([]);
let expandData: any = $ref([]);
const data: TableData[] = reactive([{
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

let expands:any = $ref([])
const expandRow = (id: any) => {
    if (expands.indexOf(id) < 0) {
        expands = []
        expands.push(id)
        expandData = data.filter((item: TableData)=> item.id === id)[0].info
    } else {
        expands = [];
    }
}

const initData = () => {
    setLoading(false)
    useDate = data
}

const cancelRank = (record: any) => {

}

const prevStep = () => {
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('on-prev')
}

onMounted(() => {
  initData()
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
:deep(.arco-table){
  tbody>.arco-table-tr{
    height: 72px !important;
  }
  .arco-table-tr-expand
  .expand-table{
    .arco-table-container{border: 1px solid rgba(133, 142, 189, 0.2);border-bottom: none;}
    thead>.arco-table-tr{
      height: 46px;
      .arco-table-th{
        background: rgba(218, 224, 242, .4);
        .arco-table-th-title{
          font-size: 14px;
          color: #858EBD;
        }
      }
    }
    tbody>.arco-table-tr{
      height: 44px !important;
      &:hover{
        .arco-table-cell,.arco-table-td{
          background-color: rgba(218, 224, 242, .1) !important;
        }
      }
      .arco-table-cell,.arco-table-td{
        font-size: 14px;
        color: #858EBD;
        background-color: #FBFBFD !important;
      }
    }
  }
}
</style>
  