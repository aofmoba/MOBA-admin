<template>
  <div style="padding: 22px 30px;">
    <div v-if="showOne" class="first-full">
      <div></div>
      <div class="flex-items between">
          <div class="font-md mcolor-1">已确认签到：0 / 10</div>
          <a-space>
            <a-button class="default" style="width:180px; height: 54px;" @click="prevStep"><div style="font-size: 18px;line-height: 50px;font-weight: bold;">返回上一步</div></a-button>
            <a-button class="active" style="width: 180px; height: 54px;" @click="visible = true"><div style="font-size: 18px;line-height: 54px;font-weight: bold;">抽签</div></a-button>
          </a-space>
      </div>
    </div>
    <div v-else class="tabs-container">
      <ul class="tabs-nav-list">
        <li class="flex-center tab-active">128晋64 <span>64强</span></li>
        <li class="flex-center">64晋32 <span>32强</span></li>
        <li class="flex-center">4晋2 <span>冠亚</span></li>
        <li class="flex-center">季殿争夺 <span>季殿</span></li>
      </ul>
      <div class="tabs-content" style="overflow-x: auto;">
        <div v-if="contentloading" class="pre100 flex-center">
          <a-spin :size="38" />
        </div>
        <div v-else class="flex">
          <div v-for="sum,d in sumData" :key="d" :class="['col-wrap',{'marTop2': d == 1},{'marTop3': d == 2},{'marTop4': d == 3},{'second-line': d == sumData.length-2 && false},{'champion': d == sumData.length-1 && false},{'laststyle':sumData.length>1}]">
            <div v-for="data,index in sum" :key="index" class="battle-col">
              <div class="battle-top flex flex-col items-end">
                <a-dropdown class="action-doption" :popup-max-height="false" @select="handleSelect">
                  <a-button>更多操作 <icon-down/></a-button>
                  <template #content>
                    <a-doption>改判</a-doption>
                    <a-doption>重赛</a-doption>
                    <a-doption>切换红蓝方</a-doption>
                  </template>
                </a-dropdown>
                <ul>
                  <li class="flex">
                    <div v-if="data.redTeamId" class="d1">{{ data.redTeamId }}</div>
                    <div v-else class="d1 empty"><img src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/bye.svg" alt=""></div>
                    <div class="d2 flex-items between white-nowrap">
                      <div>{{ data.redTeamId }}</div>
                      <span>{{ data.redScore }}</span>
                    </div>
                  </li>
                  <li class="flex">
                    <div v-if="data.blueTeamId" class="d1">{{ data.blueTeamId }}</div>
                    <div v-else class="d1 empty"><img src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/bye.svg" alt=""></div>
                    <div class="d2 flex-items between white-nowrap">
                      <div>{{ data.blueTeamId }}</div>
                      <span>{{ data.blueScore }}</span>
                    </div>
                  </li>
                </ul>
                <div class="status-wrap">
                  <div v-if="computedStatus(data.startTime,data.finishTime) === 1" class="status" style="color:#4458FE">未开始</div>
                  <div v-if="computedStatus(data.startTime,data.finishTime) === 2" class="status" style="color:#FF2855">进行中</div>
                  <div v-if="computedStatus(data.startTime,data.finishTime) === 0" class="status">{{ vertTime(data.finishTime) + ' 已结束' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a-space class="flex-items justify-end mt-20">
        <a-button class="default mr-20" style="width:180px; height: 54px;" @click="reGetFightDataFun"><div style="font-size: 18px;line-height: 50px;font-weight: bold;">重新抽签</div></a-button>
        <a-button class="default mr-20" style="width:180px; height: 54px;" @click="prevStep"><div style="font-size: 18px;line-height: 50px;font-weight: bold;">返回上一步</div></a-button>
        <a-button class="active" style="width: 180px; height: 54px;" @click="nextStep"><div style="font-size: 18px;line-height: 54px;font-weight: bold;">完成，下一步</div></a-button>
      </a-space>
    </div>
  </div>
  <a-modal 
    v-model:visible="visible" 
    modal-class="draw-lots"
  >
    <template #title>
      <div style="font-size: 20px;line-height: 28px;color: #3A3F63;font-weight: bold;">共有19支队伍进行比赛</div>
      <img class="close-btn" style="width: 32px;height: 32px;" src="https://moba-project.s3-accelerate.amazonaws.com/admin/close.svg" alt="" @click="handleCancel">
    </template>
    <div class="flex-center font-md mcolor-1">
      <div>您必须需打出第：</div>
      <a-select v-model="rewardNum" :unmount-on-close="true" placeholder="选择路径" :style="{width:'168px',height: '40px',margin:'0 10px'}">
        <a-option v-for="value of 8" :key="value">{{ value }}</a-option>
      </a-select>
      名
    </div>
    <template #footer>
      <a-space><a-button class="active btn-loading" style="width:128px; height: 40px;" :disabled="loading" @click="handleBeforeOk"><div style="font-size: 16px;line-height: 40px;font-weight: bold;"><a-spin v-if="loading" />确认抽签</div></a-button></a-space>
      <div class="blue-1 cursor-pointer" style="font-size: 16px;line-height: 40px;font-weight: bold;" @click="handleCancel">取消</div>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { onMounted, reactive, computed } from "vue"
import { useRouter } from 'vue-router'
import useLoading from '@/hooks/loading'
import { vertTime } from '@/utils/computed'
import {  
  resetPointDrawSlots,
  getPointFightData
} from '@/api/competition';
import type { getPointFightRes } from '@/api/competition';
import { Message } from "@arco-design/web-vue";

const { loading, setLoading } = useLoading(false);
const emit = defineEmits(['on-next','on-prev'])
const router = useRouter()
let pointId: string = $ref('')
const rewardNum: string = $ref('1')
let visible = $ref(false);
const tree1: any = reactive([
    {
      pointId: 123456,
      roundNum: 1,
      redTeamId: '001',
      blueTeamId: '002',
      redScore: 2,
      blueScore: 1,
      winTeamId: '001',
      startTime: 1682641273,
      finishTime: 1682651273,
      maxRound: 3,
    },
    {
      pointId: 123456,
      roundNum: 1,
      redTeamId: '003',
      blueTeamId: '004',
      redScore: 1,
      blueScore: 0,
      winTeamId: '003',
      startTime: 1682651273,
      finishTime: 1682661273,
      maxRound: 3,
    },
    {
      pointId: 123456,
      roundNum: 1,
      redTeamId: '005',
      blueTeamId: '006',
      redScore: 3,
      blueScore: 0,
      winTeamId: '005',
      startTime: 1682661273,
      finishTime: 1682681273,
      maxRound: 3,
    },
    {
      pointId: 123456,
      roundNum: 1,
      redTeamId: '007',
      blueTeamId: '008',
      redScore: 1,
      blueScore: 5,
      winTeamId: '008',
      startTime: 1682681273,
      finishTime: 16826101273,
      maxRound: 3,
    },
  ])
  
const tree2 = reactive([
    {
      pointId: null,
      roundNum: 2,
      redTeamId: null,
      blueTeamId: null,
      redScore: 0,
      blueScore: 0,
      winTeamId: null,
      startTime: null,
      finishTime: null,
      maxRound: 2,
    },
    {
      pointId: 123456,
      roundNum: 2,
      redTeamId: '001',
      blueTeamId: '003',
      redScore: 5,
      blueScore: 1,
      winTeamId: '001',
      startTime: 0,
      finishTime: 0,
      maxRound: 2,
    },
])

const tree3 = reactive([
    // {
    //   pointId: 123456,
    //   roundNum: 3,
    //   redTeamId: '001',
    //   blueTeamId: '008',
    //   redScore: 0,
    //   blueScore: 6,
    //   winTeamId: '008',
    //   startTime: 10000,
    //   finishTime: 10000,
    //   maxRound: 1,
    // },
])
const tree4 = reactive([
    {
      pointId: 123456,
      roundNum: 3,
      redTeamId: '003',
      blueTeamId: '005',
      redScore: 0,
      blueScore: 6,
      winTeamId: '005',
      startTime: 10000,
      finishTime: 10000,
      maxRound: 1,
    },
])
const tree5 = reactive([
    {
      pointId: 123456,
      roundNum: 4,
      redTeamId: '003',
      blueTeamId: '005',
      redScore: 0,
      blueScore: 6,
      winTeamId: '005',
      startTime: 10000,
      finishTime: 10000,
      maxRound: 1,
    },
])
const tree6 = reactive([
    {
      pointId: 123456,
      roundNum: 5,
      redTeamId: '003',
      blueTeamId: '005',
      redScore: 0,
      blueScore: 6,
      winTeamId: '005',
      startTime: 10000,
      finishTime: 10000,
      maxRound: 1,
    },
])
let sumData = $ref([tree1,tree2,tree3,tree4])

const treeData: any = reactive({
  level: 3,
  group:[{
    level: 2,
    group: [{
      level: 1,
      groupA: {name:'队伍名称在此a',num:73,score:1},
      groupB: {name:'队伍名称在此a1',num:73,score:1},
      children: [{name:'队伍名称在此a',num:73,score:1}]
    },{
      level: 1,
      groupA: {name:'队伍名称在此b',num:73,score:1},
      groupB: {name:'队伍名称在此b1',num:73,score:1},
      children: [{name:'队伍名称在此b',num:73,score:1}]
    }],
    children: [{name:'队伍名称在此a',num:73,score:1}]
  }
  ,{
    level: 2,
    group: [{
      level: 1,
      groupA: {name:'队伍名称在此c',num:73,score:1},
      groupB: {name:'队伍名称在此c1',num:73,score:1},
      children: [{name:'队伍名称在此c',num:73,score:1}]
    },{
      level: 1,
      groupA: {name:'队伍名称在此d',num:73,score:1},
      groupB: {name:'队伍名称在此d1',num:73,score:1},
      children: [{name:'队伍名称在此d',num:73,score:1}]
    }],
    children: [{name:'队伍名称在此a',num:73,score:1}]
  }
  ],
  children: [{name:'队伍名称在此c',num:73,score:1}]
})

const getFlatArr = (arr:any) => {
  return arr.reduce((a: any, item: any) => {
    let flatArr = [...a, item];
    if (item.children) {
      flatArr = [...flatArr, ...getFlatArr(item.children)];
    }
    return flatArr;
  }, []);
}

// eslint-disable-next-line consistent-return
const computedStatus = (start: number,end: number) => {
  const now = Math.floor(new Date().getTime() / 1000)
  if( now < start || !start || !end ) return 1
  if( now >= start && now < end ) return 2
  if( now >= end ) return 0
}
// const getNameByIdFromArr = (arr: any, id: any) => {
  // return []
  // return getFlatArr(arr).find((item: any) => item.id === id).name;
// }


const handleCancel = () => {
  visible = false;
}
let showOne: boolean = $ref(true)
const handleBeforeOk = () => {
  setLoading(true)
  resetPointDrawSlots({point_id: pointId, max_rank: Number(rewardNum)}).then((res: any) => {
    if( res.error_code === 0 ){
      // eslint-disable-next-line no-use-before-define
      getPointFightDataFun()
      showOne = false
      visible = false
    } 
  }).finally(()=>{setLoading(false)})
}

let contentloading: boolean = $ref(false)
// const arrobj = [...tree1,...tree1,...tree2,...tree2,...tree3,...tree3,...tree5,...tree6]
const arrobj = [...tree1,...tree2,...tree3]
const getPointFightDataFun = async () => {
  contentloading = true
  contentloading = false
  // const res: any = await getPointFightData(pointId).finally(()=>{contentloading = false})
  let numArr: getPointFightRes[][] | any[][] = []
  const lenArr: number[] = []
  let oneLen = 0
  arrobj.forEach((item: any)=>{
      if( !lenArr.includes(item.roundNum) ){
        lenArr.push(item.roundNum)
      }
      if( item.roundNum === 1 ){
        oneLen +=1
      }
  })
  numArr = reactive(Array(lenArr.length).fill(null).map((_, index) => ([])));
  lenArr.forEach((item: any,i)=>{
    // eslint-disable-next-line no-restricted-properties
    numArr[i] = reactive(Array(oneLen/Math.pow(2,item-1)).fill(null).map((_, index) => ({
      pointId: null,
      roundNum: item,
      redTeamId: null,
      blueTeamId: null,
      redScore: 0,
      blueScore: 0,
      winTeamId: null,
      startTime: null,
      finishTime: null,
      maxRound: null,
    })));
  })
  arrobj.forEach((item: getPointFightRes,i) => {
    const tempIndex = numArr.findIndex((da: Array<getPointFightRes>) => da[0].roundNum === item.roundNum )
    if( tempIndex >= 0 ){
      if( item.roundNum === lenArr.length ){
        const oneIndex = numArr[0].findIndex((one: any) => one.winTeamId === item.redTeamId || one.winTeamId === item.blueTeamId )
        if( oneIndex >= 0 ){
          // eslint-disable-next-line no-restricted-properties
          numArr[tempIndex].splice(oneIndex/Math.pow(2,lenArr.length-1),1,item)
        }
      }else{
        numArr[tempIndex].splice(i,1,item)
      }
    }
    // else{
    //   numArr.push([item])
    // }
    // return numArr.sort((a: getPointFightRes[],b: getPointFightRes[])=> a[0].roundNum - b[0].roundNum)
  })
  sumData = numArr
}

const reGetFightDataFun = async () => {
  await getPointFightDataFun()
  const temp = sumData[0].filter((item: getPointFightRes)=> item.redScore > 0 || item.blueScore > 0 )
  if( temp.length > 0 ){ Message.error('比赛已经开始，不能进行重新抽签操作') }
  else {
    visible = true
  }
} 

const handleSelect = () => {

}
const prevStep = () => {
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('on-prev')
}
const nextStep = async () => {
  await getPointFightDataFun()
  const temp = sumData[0].filter((item: getPointFightRes)=> item.redScore > 0 || item.blueScore > 0 )
  console.log(temp);
  if( temp.length > 0 ){ Message.error('比赛已经开始，不能进行重新抽签操作') }
  else {
    // eslint-disable-next-line vue/custom-event-name-casing
    emit('on-next')
  }
}

onMounted(() => {
  const queryInfo: any = router.currentRoute.value.query.matchinfo
  pointId = JSON.parse(queryInfo).id
  // console.log(getNameByIdFromArr(treeData.group,2));
})

</script>

<style lang="less" scoped>
.tabs-container{
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all .1s ease;
  .tabs-nav-list{
    display: flex;
    height: 86px;
    border: 1px solid #DAE0F2;
    li{
      position: relative;
      flex: 1;
      font-size: 20px;
      color: #3A3F63;
      span{
        display: inline-block;
        width: 50px;
        margin-left: 20px;
        line-height: 22px;
        font-size: 16px;
        font-weight: 500;
        color: #71A0FE;
        background: #F4F7FF;
        border-radius: 4px;
        text-align: center;
      }
      &:not(:last-child)::after{
        content: '';
        position: absolute;
        top: 50%;
        right: 0;
        width: 1px;
        height: 44px;
        margin-top: -22px;
        border-left: 1px solid #DAE0F2;
      }
      &.tab-active{
        color: #fff;
        font-weight: bold;
        background-color: #4458FE;
        &::after{border-left: none;}
      }
      &:not(.tab-active):hover{
        background: rgba(68, 88, 254, .1);
      }
    }
  }
  .tabs-content{
    flex: 1;
    padding: 30px;
    background: rgba(218,224,242,0.1);
  }
}
.battle-col{
  .battle-top,.battle-bot{
    width: 180px;
    :deep(.arco-btn-secondary){
      width: 80px;
      height: 20px;
      padding: 0 5px 0 10px;
      font-size: 10px;
      color: #858EBD;
      background-color: #F9FAFD;
      border: 1px solid #DAE0F2;
      text-align: left;
      svg{
        font-size: 14px;
        color: #858EBD;
      }
    }
    ul{
      width: 180px;
      margin: 8px 0 10px;
      li{
        height: 32px;
        font-size: 14px;
        background: #FFFFFF;
        border: 1px solid #DAE0F2;
        .d1{
          min-width: 36px;
          width: 36px;
          height: 100%;
          line-height: 31px;
          background: #FF2855;
          color: #fff;
          text-align: center;
        }
        .d2{
          width: 144px;
          padding: 0 12px 0 10px;
          color: #3A3F63;
          div{
            flex: 1;
            margin-right: 3px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      li:last-child{border-top: none;
        .d1{border-top: none;background-color: #4458FE;}
      }
      li .empty{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(218, 224, 242, .4) !important;
        img{
          width: 20px;
          height: 20px;
        }
      }
    }
    .status-wrap{
      width:100%;
      .status{width:100%;font-size: 13px;font-weight: 400;color: rgba(58,63,99,0.64);text-align: left;
        &.waiting{color: #4458FE;}
        &.pending{color: #FF2855;}
      }
    }
  }
  &:not(:first-child){margin-top: 20px;}
  &:first-child{margin-top: 0 !important;}
}
// 伪元素
.commonstyle{
  content: "";
  position: absolute;
  background-color:#DAE0F2;
}
.col-wrap{
  .battle-col{
    height: auto;
    position: relative;
    &:nth-child(odd)::before{
      top: 59px;
      right: -32px;
      width: 1px;
      height: calc(100% + 20px);
      &:extend(.commonstyle);
      opacity: .7;
    }
    &:nth-child(odd)::after{
      top: calc( (100% + 20px) / 2 + 60px );
      right: -64px;
      width: 32px;
      height: 1px;
      &:extend(.commonstyle);
      // opacity: .7;
    }
    .battle-top,.battle-bot{
      position: relative;
      &::before{
        top: 59px;
        right: -32px;
        width: 32px;
        height: 1px;
        &:extend(.commonstyle);
        opacity: .6;
      }
    }
  }
  &:last-child .battle-top::before{display: none;}
  &:last-child .battle-top::after{display: none;}
}
.col-wrap{
  margin-right: 64px;
  &:not(:first-child){margin-right: 96px;}
  &.marTop2{margin-top: 69.5px;.battle-col{margin-top: 157px;&:nth-child(odd)::before{height: calc(100% + 157px);};&::after{top: calc( (100% + 157px) / 2 + 60px );right: -96px;width: 64px;}}}
  &.marTop3{margin-top: 207px;.battle-col{margin-top: 431px;&:nth-child(odd)::before{height: calc(100% + 431px);};&::after{top: calc( (100% + 431px) / 2 + 69.5px );right: -96px;width: 64px;}}}
  &.marTop4{margin-top: 490px;.battle-col{margin-top: 980px;}}
  &.laststyle{
    &:last-child{
      // .battle-col{margin-top: 450px;}
      .battle-col{
        &::before,&::after{display:none;}
        .battle-top,.battle-bot{&::before{display:none}}
      }
    }
  }
  &.second-line{
    margin-right: 64px;
    .battle-col{
      &::before,&::after{display:none;}
      .battle-top{&::before{right: -64px;width: 64px;}}
    }
  }
  &.champion{
    margin-top: 490px;
    margin-right: 0;
    .battle-col{margin-top: 980px;}
  }
}
</style> 

<style lang="less">
.draw-lots.arco-modal{
  width: 466px;
  height: 276px;
  border-radius: 8px;
  .arco-modal-header{
    height: 28px;
    margin-top: 40px;
    border-bottom: none;
    .close-btn{
      position: absolute;
      top: 16px;
      right: 16px;
      cursor: pointer;
    }
    .arco-modal-close-btn{
      display: none;
    }
  }
  .arco-modal-body{
    padding: 30px 0 0 0;
  }
  .arco-modal-footer{
    border-top: none;
    padding: 40px 0 18px;
    text-align: center;
  }
  .arco-select{
    max-width: 143px;
    border-radius: 4px;
    border: 1px solid #DAE0F2;
    background-color: #fff;
    .arco-select-view-value{
      font-size: 16px;
      color: #3A3F63;
    }
    .arco-select-view-suffix{
        svg{
          font-size: 17px;
          color: #9AA1C8;
        }
      }
  }
}
.action-doption{
  min-width: 80px;
  max-width: 80px;
  margin-top: -3px;
  margin-left: 0px;
  .arco-dropdown{
    padding: 0;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px 0px rgba(179,192,231,0.32);
    border-radius: 4px;
    .arco-dropdown-option{
      height: 28px;
      padding: 0 10px;
      font-size: 10px;
      zoom: (.97);
      color: #3A3F63;
      &:hover{
        color: #4458FE;
        background-color: #EEF2FF;
      }
    }
  }
}
</style>
  