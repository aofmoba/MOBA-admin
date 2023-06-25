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
      <div class="ranking-list">
        <div class="title">排行榜</div>
        <ul>
            <a-spin v-show="loading" class="pre100" style="padding-top: 60px;text-align: center;" :loading="loading" />
            <li v-for="item,i in rankingList" :key="i">
              <div :class="['num',{'r1':i==0,'r2': i==1,'r3': i==2}]">{{ i > 2 ? i+1 : '' }}</div>
              <img class="userimg" src="https://moba-project.s3-accelerate.amazonaws.com/admin/default.webp" alt="">
              <div class="username line-hidden">{{ item.name !== undefined ? item.name : '' }}</div>
              <!-- <div class="level">LV{{ item.level !== undefined ? item.level : '' }}</div>
              <div class="data">{{ item.kill !== undefined ? `${item.kill}/${item.dead}/${item.assist}` : '' }}</div>
              <div class="score"><img src="https://moba-project.s3-accelerate.amazonaws.com/admin/scores.webp" alt="">{{ item.score }}分</div> -->
            </li>
            <div v-show="!loading && !rankingList?.length" class="pre100 flex-center"><img style="width: 140px;" src="https://moba-project.s3-accelerate.amazonaws.com/admin/empty.png" alt=""></div>
          </ul>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import useLoading from '@/hooks/loading'
import {  
  queryPointTeamInfo
} from '@/api/competition';

const { loading, setLoading } = useLoading(true);
const emit = defineEmits(['change-rang'])
const props = defineProps({
  showbol: {
    type: Boolean,
    default: false
  },
  rankList: Array,
})
const dialogTableVisible = ref(false)
let rankingList: any = $ref([])


const cancelHandle = () => {
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('change-rang',false)
}

const getRewards = async() => {
  rankingList = props.rankList
  setLoading(true)
  // eslint-disable-next-line no-use-before-define
  queryPlayer( props.rankList )
}
const queryPlayer = (data: any) =>{
  if( !data?.length ) setLoading(false)
  data?.forEach((item: number )=>{
    queryPointTeamInfo(item).then((res: any)=>{
      setLoading(false)
      if( res.error_code === 0 ){
        const temp = rankingList.findIndex((ele: any) => ele === res.data.troopId)
        if( temp > -1 ){
          rankingList[temp] = {
            ...res.data
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
        ul>.arco-spin{ display: flex;flex-wrap: wrap;height: 121px;padding: 0 4px;}
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
              background: url('https://moba-project.s3-accelerate.amazonaws.com/admin/ranking-1.webp') no-repeat;
              background-size: 100% 100%;
            }
            &.r2{
              background: url('https://moba-project.s3-accelerate.amazonaws.com/admin/ranking-2.webp') no-repeat;
              background-size: 100% 100%;
            }
            &.r3{
              background: url('https://moba-project.s3-accelerate.amazonaws.com/admin/ranking-3.webp') no-repeat;
              background-size: 100% 100%;
            }
          }
          .userimg{
            width: 26px;
            height: 26px;
            margin: 0 4px 0 14px;
            border-radius: 50%;
          }
          .username{width: 200px;text-align: left;}
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
  