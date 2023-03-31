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
    <div v-else class="first-full">
      <a-tabs default-active-key="1" lazy-load>
        <a-tab-pane key="1">
          <template #title>
            <div class="flex-items">128晋64 <span>64强</span></div>
          </template>
          <div class="flex">
            <div v-for="sum,d in sumData" :key="d" :class="['col-wrap',{'marTop2': d == 1},{'marTop3': d == 2 || d == 3},{'second-line': d == sumData.length-2}]">
              <div v-for="data,index in sum" :key="index" class="battle-col">
                <div v-if="data.groupA" class="battle-top flex flex-col items-end">
                  <a-dropdown class="action-doption" :popup-max-height="false" @select="handleSelect">
                    <a-button>更多操作 <icon-down/></a-button>
                    <template #content>
                      <a-doption>改判</a-doption>
                      <a-doption>重赛</a-doption>
                      <a-doption>切换红蓝方</a-doption>
                    </template>
                  </a-dropdown>
                  <ul>
                    <li v-for="item,i in data.groupA" :key="i" class="flex"><div class="d1">{{ item.score }}</div><div class="d2 flex-items between white-nowrap"><div>{{ item.name }}</div><span>{{ item.num }}</span></div></li>
                  </ul>
                  <div class="status">{{ '未开始' || '进行中' || '已结束' || '2023-01-30 14:00 已结束'}}</div>
                </div>
                <div v-if="data.groupB" class="battle-bot flex flex-col items-end mt-20">
                  <a-dropdown class="action-doption" :popup-max-height="false" @select="handleSelect">
                    <a-button>更多操作 <icon-down/></a-button>
                    <template #content>
                      <a-doption>改判</a-doption>
                      <a-doption>重赛</a-doption>
                      <a-doption>切换红蓝方</a-doption>
                    </template>
                  </a-dropdown>
                  <ul>
                    <li v-for="item,i in data.groupB" :key="i" class="flex"><div class="d1">{{ item.score }}</div><div class="d2 flex-items between white-nowrap"><div>{{ item.name }}</div> <span>{{ item.num }}</span></div></li>
                  </ul>
                  <div class="status">{{ '未开始' || '进行中' || '已结束' || '2023-01-30 14:00 已结束'}}</div>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #title>
            <div class="flex-items">64晋32 <span>32强</span></div>
          </template>
          <div></div>
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #title>
            <div class="flex-items">4晋2 <span>冠亚</span></div>
          </template>
          <div></div>
        </a-tab-pane>
        <a-tab-pane key="4">
          <template #title>
            <div class="flex-items">季殿争夺 <span>季殿</span></div>
          </template>
          <div></div>
        </a-tab-pane>
      </a-tabs>
      <a-space class="flex-items justify-end mt-20">
        <a-button class="default mr-20" style="width:180px; height: 54px;" @click="prevStep"><div style="font-size: 18px;line-height: 50px;font-weight: bold;">重新抽签</div></a-button>
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
      <img class="close-btn" style="width: 32px;height: 32px;" :src="closeImg" alt="" @click="handleCancel">
    </template>
    <div class="flex-center font-md mcolor-1">
      <div>您必须需打出第：</div>
      <a-select v-model="rewardNum" :unmount-on-close="true" placeholder="选择路径" :style="{width:'168px',height: '40px',margin:'0 10px'}">
        <a-option v-for="value,i of 7" :key="i">{{Number(value)+1}}</a-option>
      </a-select>
      名
    </div>
    <template #footer>
      <a-space><a-button class="active" style="width:128px; height: 40px;" @click="handleBeforeOk"><div style="font-size: 16px;line-height: 40px;font-weight: bold;">确认抽签</div></a-button></a-space>
      <div class="blue-1 cursor-pointer" style="font-size: 16px;line-height: 40px;font-weight: bold;" @click="handleCancel">取消</div>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue"
import { useRouter } from 'vue-router'

const closeImg = new URL('../../../../assets/images/icons/close.svg', import.meta.url).href
const emit = defineEmits(['on-next','on-prev'])
const router = useRouter()
const rewardNum: number = $ref(0)
let visible = $ref(false);
const tree1: any = reactive([
    {
      level: 1,
      groupA: [
        {name:'队伍名称在此a',num:73,score:0},
        {name:'队伍名称在此a1',num:73,score:0}
      ],
      groupB:[
        {name:'队伍名称在此b1',num:73,score:0},
        {name:'队伍名称在此b1',num:73,score:0},
      ],
    },
    {
      level: 1,
      groupA: [
        {name:'队伍名称在此c',num:73,score:0},
        {name:'队伍名称在此c1',num:73,score:0}
      ],
      groupB:[
        {name:'队伍名称在此d',num:73,score:0},
        {name:'队伍名称在此d1',num:73,score:0},
      ],
    },
    // {
    //   level: 1,
    //   groupA: [
    //     {name:'队伍名称在此e',num:73,score:0},
    //     {name:'队伍名称在此e1',num:73,score:0}
    //   ],
    //   groupB:[
    //     {name:'队伍名称在此f',num:73,score:0},
    //     {name:'队伍名称在此f1',num:73,score:0},
    //   ],
    // },
    // {
    //   level: 1,
    //   groupA: [
    //     {name:'队伍名称在此g',num:73,score:0},
    //     {name:'队伍名称在此g1',num:73,score:0}
    //   ],
    //   groupB:[
    //     {name:'队伍名称在此h',num:73,score:0},
    //     {name:'队伍名称在此h1',num:73,score:0},
    //   ],
    // },
])

const tree2 = reactive([
    {
      level: 2,
      groupA: [
        {name:'队伍名称在此a',num:73,score:0},
        {name:'队伍名称在此b',num:73,score:0}
      ],
      groupB:[
        {name:'队伍名称在此c',num:73,score:0},
        {name:'队伍名称在此d',num:73,score:0},
      ],
    },
    // {
    //   level: 2,
    //   groupA: [
    //     {name:'队伍名称在此e',num:73,score:0},
    //     {name:'队伍名称在此f',num:73,score:0}
    //   ],
    //   groupB:[
    //     {name:'队伍名称在此g',num:73,score:0},
    //     {name:'队伍名称在此h',num:73,score:0},
    //   ],
    // }
])

const tree3 = reactive([
    {
      level: 3,
      groupA: [
        {name:'队伍名称在此a',num:73,score:0},
        {name:'队伍名称在此c',num:73,score:0}
      ],
      // groupB:[
      //   {name:'队伍名称在此e',num:73,score:0},
      //   {name:'队伍名称在此g',num:73,score:0},
      // ],
    },
])
const tree4 = reactive([
    {
      level: 4,
      groupA: [
        {name:'队伍名称在此a',num:73,score:0},
        {name:'队伍名称在此c',num:73,score:0}
      ],
    },
    // {
    //   level: 4,
    //   groupA: [
    //     {name:'队伍名称在此e',num:73,score:0},
    //     {name:'队伍名称在此g',num:73,score:0}
    //   ],
    // },
])
const sumData = $ref([tree1,tree2,tree3,tree4])

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
    console.log(a,item);
    
    let flatArr = [...a, item];
    if (item.children) {
      flatArr = [...flatArr, ...getFlatArr(item.children)];
    }
    return flatArr;
  }, []);
}

const getNameByIdFromArr = (arr: any, id: any) => {
  console.log(getFlatArr(arr));
  return []
  // return getFlatArr(arr).find((item: any) => item.id === id).name;
}
let showOne: boolean = $ref(true)
const handleBeforeOk = () => {
  window.setTimeout(() => {
    showOne = false
    visible = false
    // eslint-disable-next-line vue/custom-event-name-casing
    // emit('on-next')
  }, 1000)
}
const handleCancel = () => {
  visible = false;
}

const prevStep = () => {
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('on-prev')
}
const nextStep = () => {
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('on-next')
}
const handleSelect = () => {

}

onMounted(() => {
  console.log(getNameByIdFromArr(treeData.group,2));
  
})

</script>

<style lang="less" scoped>
:deep(.arco-tabs){
  .arco-tabs-nav{
    height: 86px;
    border: 1px solid #DAE0F2;
    .arco-tabs-nav-tab{
      display: block;
      height: 100%;
      .arco-tabs-nav-tab-list{
        display: flex;
        height: 100%;
        .arco-tabs-tab{
          flex: 1;
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 2;
          margin: 0;
          font-size: 20px;
          color: #3A3F63;
          transition: all .1s ease;
          .arco-tabs-tab-title{
            display: flex;
            justify-content: center;
            width: 100%;
            line-height: 44px;
            border-left: 1px solid #DAE0F2;
            &::before{display: none;}
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
          }
          &:first-child .arco-tabs-tab-title{border-left: none;}
          &:hover{ background-color: rgba(68, 88, 254, .1);}
          &.arco-tabs-tab-active{
            color: #fff;
            font-weight: bold;
            .arco-tabs-tab-title{border-left: none;}
          }
        }
        .arco-tabs-nav-ink{ height: 100%; }
      }
    }
    &::before{ display: none;}
  } 
  .arco-tabs-content{
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
          line-height: 30px;
          background: #FF2855;
          border: 1px solid #DAE0F2;
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
    }
    .status{width:100%;font-size: 13px;color: rgba(58,63,99,0.64);text-align: left;
      &.waiting{color: #4458FE;}
      &.pending{color: #FF2855;}
    }
  }
  &:not(:first-child){margin-top: 30px;}
  &:first-child{margin-top: 0 !important;}
}
// 伪元素
.commonstyle{
  content: "";
  position: absolute;
  background-color:#DAE0F2;
}
.battle-col{
  height: auto;
  position: relative;
  &::before{
    top: 59px;
    right: -32px;
    width: 1px;
    height: calc(100% - 118px);
    &:extend(.commonstyle);
    opacity: .7;
  }
  &::after{
    top: calc( (100% - 118px) / 2 + 60px );
    right: -64px;
    width: 32px;
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
    }
  }
}
.col-wrap{
  margin-right: 64px;
  &:nth-child(2){margin-right: 96px;}
  &.marTop2{margin-top: 70px;.battle-col{margin-top: 168px;.battle-bot{margin-top: 166px;}&::after{right: -96px;width: 64px;}}}
  &.marTop3{margin-top: 212px;.battle-col{margin-top: 158px;.battle-bot{margin-top: 450px;}}}
  &:last-child{
    .battle-col{margin-top: 450px;}
    .battle-col{
      &::before,&::after{display:none;}
      .battle-top,.battle-bot{&::before{display:none}}
    }
  }
  &.second-line{
    .battle-col{
      &::before,&::after{display:none;}
      .battle-top,.battle-bot{&::before{right: -64px;width: 64px;}}
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
  