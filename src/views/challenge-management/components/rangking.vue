<template>
  <div class="ranking">
    <a-modal 
      v-model:visible="dialogTableVisible" 
      modal-class="ranking-dialog"
      simple
      :unmount-on-close="true"
      :mask-closable="false"
      :hide-cancel="true"
      :hide-ok="true"
    >
      <template #title>
        <div>查看排行榜</div>
        <img src="https://moba-project.s3-accelerate.amazonaws.com/admin/close.svg" alt="" @click="cancelHandle" >
      </template>
      <div class="rewards">
        <div class="title">奖励</div>
        <ul>
          <a-spin class="pre100" :loading="loading1">
            <li v-for="item,i in rewardsInfo?.rewards" :key="i">
              <div v-if="item.propList[0].id === 1" class="mx-auto"><img class="pre100" src="@/assets/images/reward-1.webp" alt=""></div>
              <div v-else-if="item.propList[0].id === 2" class="mx-auto"><img class="pre100" src="@/assets/images/reward-2.webp" alt=""></div>
              <div v-else-if="item.propList[0].id === 3" class="mx-auto"><img class="pre100" src="@/assets/images/reward-3.webp" alt=""></div>
              <div v-else class="mx-auto"><img class="pre100" src="@/assets/images/reward-4.webp" alt=""></div>
              <div>{{ item.name }}</div>
              <div class="texts line-hidden">第{{ item.startRank == item.endRank ? item.startRank : item.startRank - item.endRank }}名</div>
            </li>
          </a-spin>
        </ul>
      </div>
      <div class="ranking-list">
        <div class="title">排行榜</div>
        <ul>
            <a-spin v-show="loading2" class="pre100" style="padding-top: 60px;text-align: center;" :loading="loading2" />
            <li v-for="item,i in rankingList" :key="i">
              <div :class="['num',{'r1':i==0,'r2': i==1,'r3': i==2}]">{{ i > 2 ? item.rank : '' }}</div>
              <img class="userimg" src="@/assets/images/default.webp" alt="">
              <div class="username line-hidden">{{ item.name !== undefined ? item.name : '' }}</div>
              <div class="level">LV{{ item.level !== undefined ? item.level : '' }}</div>
              <div class="data">{{ item.kill !== undefined ? `${item.kill}/${item.dead}/${item.assist}` : '' }}</div>
              <div class="score"><img src="@/assets/images/scores.webp" alt="">{{ item.score }}分</div>
            </li>
            <div v-show="!loading2 && !rankingList.length" class="pre100 flex-center"><img style="width: 140px;" src="@/assets/images/empty.png" alt=""></div>
          </ul>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import useLoading from '@/hooks/loading'
import {  
  ArenaLists,
  queryArenaInfo,
  queryRanks,
  ranksLists,
  queryPlayerInfo
} from '@/api/challenge';

const { loading, setLoading } = useLoading(true);
let loading1: boolean = $ref(true)
let loading2: boolean = $ref(true)
const emit = defineEmits(['change-rang'])
const props = defineProps({
  showbol: {
    type: Boolean,
    default: false
  },
  arenaid: Number
})
const dialogTableVisible = ref(false)
let rankingList: Array<ranksLists> = $ref([])


const cancelHandle = () => {
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('change-rang',false)
}

let rewardsInfo: ArenaLists | any = $ref()
const getRewards = async() => {
  rankingList = []
  rewardsInfo = {}
  // eslint-disable-next-line no-multi-assign
  loading1 = loading2 = true
  if( props.arenaid ){
    queryArenaInfo(Number(props.arenaid)).then((res: any) => {
      if( res.error_code === 0 ) rewardsInfo = res.data
    }).finally(()=>{loading1=false})
    queryRanks({arena_id: Number(props.arenaid),rank_type: 0}).then((res: any) => {
      if( res.error_code === 0 ) {
        if( !res.data.length ) loading2 = false
        rankingList = res.data
        // eslint-disable-next-line no-use-before-define
        queryPlayer( res.data )
      }
    }).catch(()=>{loading2=false})
  }
}
const queryPlayer = (date: ranksLists[]) =>{
  date.forEach((item: ranksLists )=>{
    queryPlayerInfo({player_id:item.playerId,arena_id:Number(props.arenaid)}).then((res: any)=>{
      loading2 = false
      if( res.error_code === 0 ){
        const temp = rankingList.findIndex((ele: any) => ele.playerId === res.data.playerId)
        if( temp > -1 ){
          rankingList[temp] = {
            ...item,
            head: res.data.head,
            level: res.data.level,
            kill: [undefined,null].includes( res.data.kill )  ? '--' : res.data.kill,
            dead: [undefined,null].includes( res.data.dead )  ? '--' : res.data.dead,
            assist: [undefined,null].includes( res.data.assist )  ? '--' : res.data.assist,
            name:  [undefined,null].includes( res.data.name ) ? 'null' : res.data.name
          }
        }
      }
    })
  })
}

watch(()=>props.showbol, (newV,oldV)=>{
  dialogTableVisible.value = newV
  if( newV ) getRewards()
},{immediate: true})
</script>

<style lang="less" scoped>

</style>

<style lang="less">
.ranking-dialog.arco-modal{
    padding: 18px 20px;
    width: 473px;
    border-radius: 11px;
    .arco-modal-header{
      margin-bottom: 12px;
      .arco-modal-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        div{
          font-size: 16px;
          font-weight: bold;
          color: #3A3F63;
          line-height: 28px;
        }
      }
      img{
        width: 32px;
        height: 32px;
        cursor: pointer;
      }
    }
    .arco-modal-body{
      .rewards,.ranking-list{
        .title{
          height: 28px;
          padding: 4px 10px;
          font-size: 14px;
          font-weight: bold;
          color: #4458FE;
          line-height: 20px;
          background: rgba(68,88,254,0.1);
        }
        ul{
          display: flex;
          flex-wrap: wrap;
          font-size: 14px;
          line-height: 20px;
          font-weight: 500;
          color: #3A3F63;
          background: rgba(68,88,254,0.02);
          overflow-y: scroll;
          &::-webkit-scrollbar{
              display: none;
          }
          .texts{
            width: 88px;
            margin-top: -2.5px;
            font-size: 12.5px;
            font-weight: normal;
            color: #858EBD;
            line-height: 17.5px;
            transform: scale(.8);
            transform-origin: left center;
          }
        }
      }
      .rewards{ 
        ul{ height: 121px;padding: 0 4px;}
        li{
          width: 68px;
          padding: 10px 0 9px;
          margin: 0 16px;
          text-align: center;
          white-space: nowrap;
          div:first-child{width: 68px;height: 68px;margin-bottom: 2px;img{border-radius: 2px;}}
        }
      } 
      .ranking-list{ 
        ul{height: 192px;}
        li{
          width: 100%;
          height: 46px;
          padding: 0 16px 0 14px;
          display: flex;
          align-items: center;
          white-space: nowrap;
          text-align: center;
          border-bottom: 1px solid rgba(68,88,254,0.1);
          .num{
            width: 22px;
            height: 27px;
            line-height: 27px;
            font-weight: 800;
            &.r1{
              background: url('@/assets/images/ranking-1.webp') no-repeat;
              background-size: 100% 100%;
            }
            &.r2{
              background: url('@/assets/images/ranking-2.webp') no-repeat;
              background-size: 100% 100%;
            }
            &.r3{
              background: url('@/assets/images/ranking-3.webp') no-repeat;
              background-size: 100% 100%;
            }
          }
          .userimg{
            width: 26px;
            height: 26px;
            margin: 0 4px 0 14px;
            border-radius: 50%;
          }
          .username{width: 100px;text-align: left;}
          .level{width: 64px;color: #858EBD;}
          .data{width: 87px;}
          .score{
            flex: 1;
            display: flex;
            align-items: center;
            margin-left: 18px;
            img{
              width: 20px;
              height: 20px;
              margin-right: 4px;
              border-radius: 2px;
            }
          }
        }
      }
    }
    .arco-modal-footer{
        display: none;
    }
}
</style>
  