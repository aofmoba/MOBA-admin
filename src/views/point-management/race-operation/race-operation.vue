<template>
  <div :class="['race-wrap other-form',{'wrapbg':currentStep !== 1}]">
    <div class="wrapbg">
      <Mtitle title="赛程操作" />
      <div class="process-wrap" style="padding: 45px 30px 20px;">
        <a-steps label-placement="vertical" :changeable="false" :current="currentStep" @change="setCurrent">
          <a-step>参赛签到
            <template #node>
              <div>1</div>
            </template>
          </a-step>
          <a-step>抽签/赛程
            <template #node>
              <div>2</div>
            </template>
          </a-step>
          <a-step>保存名称
            <template #node>
              <div>3</div>
            </template>
          </a-step>
        </a-steps>
        <DatePicker v-if="currentStep === 1" :key="signTime.startTime" :starttime="signTime.startTime" :interval="true" :finishtime="signTime.finishTime" style="margin-top: 40px;" @change-date="changeDate"/>
      </div>
    </div>
    <StepOne v-if="currentStep === 1" @on-next="onNext"/>
    <StepTwo v-if="currentStep === 2" @on-prev="onPrev" @on-next="onNext"/>
    <stepThree v-if="currentStep === 3" @on-prev="onPrev" @on-next="onNext"/>
  </div>
</template>

<script lang="ts" setup>
import { onActivated, onMounted } from "vue"
import { useRouter } from 'vue-router'
import { dateType } from "@/types/global"
import StepOne from './components/stepOne.vue'
import StepTwo from './components/stepTwo.vue'
import stepThree from './components/stepThree.vue'

const router = useRouter()
let currentStep: number = $ref(1)
const signTime = $ref({
  startTime: 0,
  finishTime: 0
})
const setCurrent = (current: number) => {
  currentStep = current
}
const onPrev = () => {
  currentStep = Math.max(1, currentStep - 1)
  localStorage.setItem('currentStep',String(currentStep))
}
const onNext = () => {
  currentStep = Math.min(3, currentStep + 1)
  localStorage.setItem('currentStep',String(currentStep))
}
const changeDate = (date: dateType) => {
  signTime.startTime = Math.floor(Number(date.start) / 1000)
  signTime.finishTime = Math.floor(Number(date.end) / 1000)
}

onActivated(()=>{
  if( !localStorage.getItem('currentStep') ) currentStep = 1
})

onMounted(() => {
  currentStep = 1
  currentStep = Number(localStorage.getItem('currentStep')) || 1
  const queryInfo: any = JSON.parse(localStorage.getItem('matchinfo') || '')
  signTime.startTime = Number(queryInfo.start) || 0
  signTime.finishTime = Number(queryInfo.end) || 0
})

</script>

<style scoped lang="less">
:deep(.arco-steps){
  .arco-steps-item{
    margin: 0;
    &.arco-steps-item-active,&.arco-steps-item-finish{
      .arco-steps-item-tail{
        &::after{
          border-color: #4458FE !important;
        }
      }
      .arco-steps-item-title{
        color: #4458FE;
      }
      .arco-steps-item-node{
        color: #fff;
        background-color: var(--color-bg-1);
        border-color: #4458FE;
        div{
          background-color: #4458FE;
          border-color: #4458FE;
        }
      }
    }
    .arco-steps-item-title{
      color: #3A3F63;
    }
    .arco-steps-item-node{
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 36px;
      color: #858EBD;
      border-radius: 100%;
      background-color: var(--color-bg-1);
      border: 1px solid #DAE0F2;
      div{
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 100%;
        border: 1px solid #DAE0F2;
      }
    }
    .arco-steps-item-tail{
      width: 110%;
      top: 16.2px;
      left: 0;
      &::after{
        height: 2px;
        border: 1px solid #DAE0F2;
        border-left: none;
        border-right: none;
        background: var(--color-bg-1);
      }
    }
    &:nth-child(1){
      max-width: 216px !important;
      .arco-steps-item-node{
        margin-left: 180px;
      }
      .arco-steps-item-content{
        margin-left: 126px;
      }
    }
    &:nth-child(2){
      max-width: 347px !important;
      .arco-steps-item-node{
        margin-left: 311px;
      }
      .arco-steps-item-content{
        margin-left: 257px;
      }
    }
    &:nth-child(3){
      flex: 1;
      .arco-steps-item-tail{
        position: absolute;
        box-sizing: border-box;
        width: 100%;
        height: 2px;
        // background: #3A3F63;
        &::after{
          position: absolute;
          display: block;
          width: 100%;
          height: 100%;
          content: '';
        }
      }
      .arco-steps-item-node{
        margin-left: 311px;
      }
      .arco-steps-item-content{
        margin-left: 258px;
      }
    }
  }
}
</style>
