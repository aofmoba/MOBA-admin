<template>
  <div class="reward-wrap" style="width: 758px;">
    <div v-for="item,i in rewardList" :key="i" class="card relative flex flex-col between" style="height: 124px;">
      <div class="reward-ranking flex-items mcolor-1 font-md">
        <div class="flex-items">第<a-input-number v-model="item.startRank" :hide-button="true" :min="0" :max="10" class="input-reward" />名</div>
        <div class="mtext-1 white-nowrap overhidden flex-content" style="width: 26px;margin: 0 20px;">— —</div>
        <div class="flex-items" :style="{'marginRight': rewardType ? '37px': ''}">第<a-input-number v-model="item.endRank" :hide-button="true" :min="0" :max="10" class="input-reward" />名</div>
        <ul v-if="!rewardType" class="reward-img flex-items" style="margin-left: 35px;">
          <li 
            v-for="data in rewardsIcon" :key="data.id"
            :class="{'active': item.props.filter((m:any)=>m.id == data.id).length}"
            @click="toggleHandler(i,data.id)"
          ><img :src="data.img" alt=""></li>
        </ul>
        <div v-if="( i !== 0 && rewardList.length < 10 && rewardList.length > 1) || ( rewardList.length <= 1 )" class="cursor-pointer" style="margin-right: 20px;" @click="addReward(i)"><icon-plus style="font-size: 24px; color: #858EBD;" /></div>
        <div class="cursor-pointer" :style="{'marginLeft': rewardType && ( (i === 0 && rewardList.length > 1 ) || rewardList.length >= 10 ) ? '44px': ''}" @click="delReward(i)"><icon-minus style="font-size: 24px; color: #858EBD;" /></div>
      </div>
      <div v-if="rewardType" class="challenge-card absolute flex-items">
          <Mupload :width="94" :height="94" :uwidth="102" :uheight="102" text="上传奖励图" :aindex="i" @change-banner="changeBanner" />
          <div class="tips mt-10 mtext-gray font-sm">尺寸（102*102px），仅限JPG和PNG格式</div>
      </div>
      <a-space>
        <a-input v-model="item.name" class="card-name" placeholder="请输入您的奖励名称" />
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FileItem } from '@arco-design/web-vue'
import { watch, onMounted } from 'vue'

const emit = defineEmits(['change-reward'])
const props = defineProps({
  rewardType: String,
  backrew: Array,
})
const rewardsIcon = [
  {id: 1,img:new URL('../../../assets/images/reward-1.webp', import.meta.url).href},
  {id: 2,img:new URL('../../../assets/images/reward-2.webp', import.meta.url).href},
  {id: 3,img:new URL('../../../assets/images/reward-3.webp', import.meta.url).href},
  {id: 4,img:new URL('../../../assets/images/reward-4.webp', import.meta.url).href},
]
let rewardList: any = $ref([
  {
    name: '',
    startRank: null,
    endRank: null,
    rewardimg: '',
    props: [],
  },
  {
    name: '',
    startRank: null,
    endRank: null,
    rewardimg: '',
    props: [],
  }
])
let flag: boolean = $ref(false)
watch(()=>props.backrew,(newV: any,oldV: any)=>{
  if( newV === undefined ) return
  if( !flag && newV.length ) {
    rewardList = []
    rewardList.push(...newV)
    flag = true
  }
},{immediate: true,deep:true})
watch(()=> rewardList,(newV:any)=>{
  if( newV ){
    let reault = newV.filter((item:any) => item.name && ![null,undefined].includes(item.startRank) && ![null,undefined].includes(item.endRank) && item.props.length > 0 )
    if( !props.rewardType ){
      reault = reault.map((item: any) => ({name:item.name, startRank:item.startRank, endRank:item.endRank,props: item.props}))
    }
    // eslint-disable-next-line vue/custom-event-name-casing
    emit('change-reward',reault)
  }
},{deep:true})

const toggleHandler = (i: number,id: any) => {
  const temp = rewardList[i].props.findIndex((item: any) => item.id === id);
  if( temp > -1 ) rewardList[i].props.splice(temp,1)
  else rewardList[i].props = [{id,count:1}]
  // else rewardList[i].props.push({id,count:1})
}

const addReward = (index: number) => {
  rewardList.splice(index+1,0,{
    name: '',
    startRank: null,
    endRank: null,
    rewardimg: '',
    props: [],
  })
}
const delReward = (index: number) => {
  if( rewardList.length > 1){
    rewardList.splice(index,1)
  }
}

const changeBanner = (file: FileItem,index: number) => {
  // rewardList[index].rewardimg = file
  rewardList[index].rewardimg = 'https://cyberpop.mypinata.cloud/ipfs/QmZbwxvByrEfb7rEToQU49etQyGqjWxheG7DVvK78Gpmwo'
}
onMounted(()=>{
})
</script>

<style scoped lang="less">
.reward-wrap{
  .reward-ranking{
    :deep(.arco-input-wrapper){
      width: 40px !important;
      margin: 0 10px;
      padding: 0;
      border: 1px solid #DAE0F2 !important;
      border-radius: 4px;
      input{
        height: 40px !important;
        text-align: center;
      }
    }
  }
  .card{
    padding: 15px 30px;
    margin-left: -30px;
    &.active,&:hover{
      background-color: rgba(218, 224, 242, .2);
    }
    .reward-img{
      padding-left: 50px;
      li{
        width: 40px;
        height: 40px;
        margin-right: 10px;
        background: rgba(218,224,242,0.25);
        border: 1px solid #DAE0F2;
        border-radius: 4px;
        &.active{
          border: 1px solid #4458FE;
          background: rgba(68,88,254,0.1);
        }
        img{
          width: 100%;
          height: 100%;
        }
        &:last-child{
          margin-right: 22px;
        }
      }
    }
    .challenge-card{
      top: 4px;
      left: 406px;
      .tips{margin-left: 10px;opacity: .64;}
    }
    :deep(.arco-input-wrapper.card-name) input{
        width: 355px !important;
    }
  }
}
</style>
