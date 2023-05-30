<template>
  <div style="padding: 22px 30px;">
    <div v-if="showOne" class="first-full">
      <div></div>
      <div class="flex-items between">
          <div class="font-md mcolor-1">已确认签到：0 / 10</div>
          <a-space>
            <a-button class="default" style="width:180px; height: 54px;" @click="emit('on-prev')"><div style="font-size: 18px;line-height: 50px;font-weight: bold;">返回上一步</div></a-button>
            <a-button class="active" style="width: 180px; height: 54px;" @click="visible = true"><div style="font-size: 18px;line-height: 54px;font-weight: bold;">抽签</div></a-button>
          </a-space>
      </div>
    </div>
    <div v-else class="tabs-container">
      <ul v-if="winData[0]?.length" class="tabs-nav-list" :class="{'noscroll':tabcards.length <= 2}">
        <li v-for="num in tabcards" :key="num" :class="['flex-center',{'tab-active': winData[winData.length-1][0].teamNum === num}]">{{ num }}晋{{ num / 2 }} <span>{{ num / 2 }}强</span></li>
        <li :class="['flex-center',{'tab-active': winData[winData.length-1][0].teamNum === tabcards[tabcards.length-1]/2 || winData[0][0].teamNum === 2}]">冠亚争夺 <span>冠亚</span></li>
        <li v-if="winData[0][0].teamNum > 2" class="flex-center">季殿争夺 <span>季殿</span></li>
      </ul>
      <div class="tabs-content">
        <div v-if="contentloading" class="pre100 flex-center">
          <a-spin :size="38" />
        </div>
        <div v-else class="fight-team h-full">
          <div class="fight-team-wrap h-full">
            <div class="winTeam">
              <div class="flex-items"><img style="width: 24px;" src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/loseTeam.svg" alt="">胜者组</div>
              <div class="flex">
                <div 
                  v-for="sum,d in winData" 
                  :key="d" 
                  :class="['col-wrap','laststyle',
                  `marTop${d}`,
                  {'second-line': d == winData.length-2 && winData[winData.length-1][0].teamNum === 2},
                  {'champion': d == winData.length-1 && winData[winData.length-1][0].teamNum === 2}]"
                >
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
                          <div v-if="Number(data.redTeamId)" class="d1">{{ data.redIndex }}</div>
                          <div v-else class="d1 empty"><img src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/bye.svg" alt=""></div>
                          <div class="d2 flex-items between white-nowrap">
                            <div>{{ data.redTeamName }}</div>
                            <span>{{ data.redScore }}</span>
                          </div>
                        </li>
                        <li class="flex">
                          <div v-if="Number(data.blueTeamId)" class="d1">{{ data.blueIndex }}</div>
                          <div v-else class="d1 empty"><img src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/bye.svg" alt=""></div>
                          <div class="d2 flex-items between white-nowrap">
                            <div>{{ data.blueTeamName }}</div>
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
            <div v-if="loseData.length" class="loseTeam">
              <div class="flex-items"><img style="width: 24px;" src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/loseTeam.svg" alt="">败者组</div>
              <div class="flex">
                <div 
                  v-for="sum,d in loseData" 
                  :key="d" 
                  :class="['col-wrap','laststyle',
                  `marTop${d-emptyNum}`]"
                >
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
                          <div v-if="Number(data.redTeamId)" class="d1">{{ data.redIndex }}</div>
                          <div v-else class="d1 empty"><img src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/bye.svg" alt=""></div>
                          <div class="d2 flex-items between white-nowrap">
                            <div>{{ data.redTeamName }}</div>
                            <span>{{ data.redScore }}</span>
                          </div>
                        </li>
                        <li class="flex">
                          <div v-if="Number(data.blueTeamId)" class="d1">{{ data.blueIndex }}</div>
                          <div v-else class="d1 empty"><img src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/bye.svg" alt=""></div>
                          <div class="d2 flex-items between white-nowrap">
                            <div>{{ data.blueTeamName }}</div>
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
      <div style="font-size: 20px;line-height: 28px;color: #3A3F63;font-weight: bold;">共有{{ checknum }}支队伍进行比赛</div>
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
      <a-space><a-button class="active " style="width:128px; height: 40px;" :disabled="loading" @click="handleBeforeOk"><div style="font-size: 16px;line-height: 40px;font-weight: bold;"><a-spin v-if="loading" />确认抽签</div></a-button></a-space>
      <div class="blue-1 cursor-pointer" style="font-size: 16px;line-height: 40px;font-weight: bold;" @click="handleCancel">取消</div>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { onMounted, reactive, computed, watch } from "vue"
import { useRouter } from 'vue-router'
import { staticData } from '@/store';
import { storeToRefs } from 'pinia';
import useLoading from '@/hooks/loading'
import { vertTime } from '@/utils/computed'
import {  
  resetPointDrawSlots,
  getPointFightData
} from '@/api/competition';
import type { getPointFightRes } from '@/api/competition';
import { Message } from "@arco-design/web-vue";
import { getWinBinaryArr, getLoseBinaryArr  } from '../filter/stepTwo'
// import { alltest  } from '../filter/testData'

const props = defineProps({
  checknum: {
    type: Number,
    default: 0
  }
})
const myTabRef: any = $ref()
const comStore = staticData();
const { currentStep } = storeToRefs(comStore);
const { loading, setLoading } = useLoading(false);
const emit = defineEmits(['on-next','on-prev'])
const router = useRouter()
let pointId: string = $ref('')
const rewardNum: string = $ref('1')
let visible = $ref(false);
let winData: getPointFightRes[][] | any[][] = $ref([])
let loseData: getPointFightRes[][] | any[][] = $ref([])

const tabcards = computed(() => {
  const indexArr = [];
  let { teamNum } = winData[0]?.length ? winData[0][0] : {teamNum: 0};
  while( teamNum >= 4 ){
    indexArr.push(teamNum);
    teamNum /= 2;
  }
  return indexArr;
})

// eslint-disable-next-line consistent-return
const computedStatus = (start: number,end: number) => {
  const now = Math.floor(new Date().getTime() / 1000)
  if( now < start || !start || !end ) return 1
  if( now >= start && now < end ) return 2
  if( now >= end ) return 0
}

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

// let allFightData = alltest
let allFightData: Array<getPointFightRes> | Array<any> = []
const getTeamIndex = (signData: any,fightData: Array<getPointFightRes> | any) => {
  allFightData = fightData.map((ele: getPointFightRes) => ({
    ...ele,
    blueIndex: Number(ele.blueTeamId) ? signData.filter((item:any)=> item.teamId === ele.blueTeamId)[0]?.indexId : -1,
    redIndex: Number(ele.redTeamId) ? signData.filter((item:any)=> item.teamId === ele.redTeamId)[0]?.indexId : -1
  }))
}


let emptyNum = $ref(0)
let signTeamNum: Array<{teamId: string;indexId: string}> = []
let contentloading: boolean = $ref(false)
const getPointFightDataFun = async () => {
  contentloading = true
  const res: any = await getPointFightData(pointId).catch(()=>{contentloading = false})
  if( !res.data ) {contentloading = false; return;}
  signTeamNum = JSON.parse(localStorage.getItem('signTeamNum') || '[]')
  getTeamIndex(signTeamNum, res.data)
  winData = getWinBinaryArr(allFightData)
  loseData = getLoseBinaryArr(allFightData)
  // 处理最后4名队伍在战胜组水平排列
  if( winData[winData.length-1].length === 2 && winData[winData.length-1][0].teamNum === 2 ){
    winData.push([winData[winData.length-1][1]])
    winData[winData.length-2].splice(1,1)
  }
  if( loseData.length ){
    let emptyLose = winData[0][0].teamNum
    const loseTeamNum = loseData[0][0].teamNum
    while( emptyLose > loseTeamNum ){
      loseData.unshift([]);
      emptyLose /= 2
    }
    emptyNum = loseData.filter((item: any) => !item.length).length
  }
  contentloading = false
}

const reGetFightDataFun = async () => {
  await getPointFightDataFun()
  const nowTime = new Date().getTime()
  const temp = allFightData.filter((item: getPointFightRes)=> item.startTime <= nowTime )
  if( temp.length > 0 ){ Message.error('比赛已开始或结束，不能进行重新抽签操作') }
  else {
    visible = true
  }
} 

const handleSelect = () => {

}

const prevStep = async () => {
  await getPointFightDataFun()
  const nowTime = new Date().getTime()
  const temp = allFightData.filter((item: getPointFightRes)=> item.startTime <= nowTime )
  if( temp.length > 0 ){ Message.error('比赛已开始或结束，不能返回上一步') }
  else {
    // eslint-disable-next-line vue/custom-event-name-casing
    emit('on-prev')
  }
}
const nextStep = async () => {
  await getPointFightDataFun()
  const nowTime = new Date().getTime()
  const temp = allFightData.filter((item: getPointFightRes)=> item.finishTime > nowTime )
  if( temp.length > 0 ){ Message.error('晋级比赛还未全部完成') }
  else {
    // eslint-disable-next-line vue/custom-event-name-casing
    emit('on-next')
  }
}

const intoActive = async () => {
  pointId = JSON.parse(localStorage.getItem('matchinfo') || '{}').id
  await getPointFightDataFun()
  const nowTime = new Date().getTime()
  const temp = allFightData.filter((item: getPointFightRes)=> item.startTime <= nowTime )
  if( temp.length > 0 ){ showOne = false } // 如果已抽签且比赛已开始直接显示对战表
}

watch(currentStep,(newV: any)=>{
  if( newV === 2 ) intoActive()
},{immediate: true,deep: true})

onMounted(() => {
  pointId = JSON.parse(localStorage.getItem('matchinfo') || '{}').id
})

</script>

<style lang="less" scoped>
.border-right{
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  width: 1px;
  height: 44px;
  margin-top: -22px;
  border-left: 1px solid #DAE0F2;
}

.tabs-container{
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all .1s ease;
  .tabs-nav-list{
    position: relative;
    display: flex;
    height: 86px;
    border: 1px solid #DAE0F2;
    overflow-x: overlay;
    background-color: 'transparent';
    transition: background-color .4s;
    -webkit-background-clip: text;
    &:not(.noscroll):hover{background: rgb(207, 205, 205);}
    &::-webkit-scrollbar{
        width: 10px;
        height: 8px;
    }
    &::-webkit-scrollbar-track-piece,&::-webkit-scrollbar-corner{
        background: transparent;
    }
    &::-webkit-scrollbar-thumb{
        border-radius: 7px;
        background-color: inherit;
    }
    li{
      position: relative;
      min-width: 270px;
      font-size: 20px;
      color: #3A3F63;
      background-color: #fff;
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
        &:extend(.border-right);
      }
      &.tab-active{
        color: #fff;
        font-weight: bold;
        background-color: #4458FE;
        &::after{border-left: none;}
      }
      &:not(.tab-active):hover{
        background: RGBA(236, 238, 254, 1);
      }
    }
    &.noscroll{
      li::after{
        &:extend(.border-right);
      }
    }
  }
  .tabs-content{
    flex-grow: 1;
    height: 360px;
    padding: 30px 10px;
    background: rgba(218,224,242,0.1);
    .fight-team{
      overflow: auto;
      height: 100%;
      &::-webkit-scrollbar{
          width: 10px;
          height: 8px;
      }
      &::-webkit-scrollbar-track-piece,&::-webkit-scrollbar-corner{
          background: transparent;
      }
      &::-webkit-scrollbar-thumb{
          border-radius: 7px;
          background-color: rgb(207, 205, 205);
      }
      .fight-team-wrap{
        height: fit-content;
        width: max-content;
        min-width: 100%;
      }
      .winTeam>div:first-child,.loseTeam>div:first-child{
        margin-bottom: 12px;
        font-size: 20px;
        font-weight: 600;
        color: #3A3F63;
        line-height: 28px;
        img{margin-right: 6px;}
      }
      .winTeam>div:first-child{
        color: #4458FE;
        img{
          filter: invert(46%) sepia(76%) saturate(7060%) hue-rotate(230deg) brightness(101%) contrast(99%);
        }
      }
      .loseTeam{margin-top: 30px;}
      .winTeam>div:last-child{
        min-height: 260px;
        padding: 22px 20px;
        background-color: rgba(68, 88, 254, 0.03);
      }
      .loseTeam>div:last-child{
        padding: 22px 20px;
        background-color: rgba(58, 63, 99, 0.03);
      }
    }
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
        background: var(--color-bg-1);
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
  min-width: 180px;
  width: 180px;
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
      right: -96px;
      width: 64px;
      height: 1px;
      &:extend(.commonstyle);
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
  &:first-child .battle-col:nth-child(odd)::after{
      right: -64px;
      width: 32px;
  }
  &:last-child .battle-top::before{display: none;}
  &:last-child .battle-top::after{display: none;}
}

.loseTeam .col-wrap .battle-col {
  &:nth-child(odd)::after{
    right: -96px;
    width: 64px;
  }
}


.col-wrap{
  margin-right: 64px;
  &:not(:first-child){margin-right: 96px;}
  &.marTop1{
    margin-top: 69.5px;
    .battle-col{
      margin-top: 157px;
      &:nth-child(odd)::before{height: calc(100% + 157px);};&::after{top: calc( (100% + 157px) / 2 + 60px );}
    }}
  &.marTop2{
    margin-top: 207px;
    .battle-col{
      margin-top: 431px;
      &:nth-child(odd)::before{height: calc(100% + 431px);};&::after{top: calc( (100% + 431px) / 2 + 69.5px );}
    }}
  &.marTop3{
    margin-top: 492px;
    .battle-col{
      margin-top: 979px;
      &:nth-child(odd)::before{height: calc(100% + 979px);};&::after{top: calc( (100% + 979px) / 2 + 69.5px );}
    }
  }
  &.marTop4{
    margin-top: 1050px;
    .battle-col{
      margin-top: 2075px;
      &:nth-child(odd)::before{height: calc(100% + 2075px);};&::after{top: calc( (100% + 2075px) / 2 + 69.5px );}
    }
  }
  &.marTop5{
    margin-top: 2156px;
    .battle-col{
      margin-top: 4267px;
      &:nth-child(odd)::before{height: calc(100% + 4267px);};&::after{top: calc( (100% + 4267px) / 2 + 69.5px );}
    }
  }
  &.marTop6{
    margin-top: 4359px;
    .battle-col{
      margin-top: 8650px;
      &:nth-child(odd)::before{height: calc(100% + 8650px);};&::after{top: calc( (100% + 8650px) / 2 + 69.5px );}
    }
  }
  &.marTop7{
    margin-top: 8752px;
    .battle-col{
      margin-top: 17464px;
      &:nth-child(odd)::before{height: calc(100% + 17464px);};&::after{top: calc( (100% + 17464px) / 2 + 69.5px );}
    }
  }
  &.laststyle{
    &:last-child{
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
    margin-right: 0;
    .battle-col{margin-top: 980px;}
    &.marTop2:last-child{ // 如果这是最后一列
      margin-top: 69.5px;
    }
    &.marTop3:last-child{ // 如果这是最后一列
      margin-top: 207px;
    }
    &.marTop4:last-child{ // 如果这是最后一列
      margin-top: 492px;
    }
    &.marTop5:last-child{ // 如果这是最后一列
      margin-top: 1050px;
    }
    &.marTop6:last-child{ // 如果这是最后一列
      margin-top: 2156px;
    }
    &.marTop7:last-child{ // 如果这是最后一列
      margin-top: 4359px;
    }
    &.marTop8:last-child{ // 如果这是最后一列
      margin-top: 8752px;
    }
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
    background-color: var(--color-bg-1);
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
    background: var(--color-bg-1);
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
  