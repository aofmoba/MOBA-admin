<template>
  <a-modal 
    v-model:visible="sureDialog" 
    modal-class="del-lots refuse-style"
  >
    <template #title>
      <div style="font-size: 20px;line-height: 28px;color: #3A3F63;font-weight: bold;">{{ title }}</div>
      <img class="close-btn" style="width: 32px;height: 32px;" src="https://moba-project.s3-accelerate.amazonaws.com/admin/close.svg" alt="" @click="cancelHandler">
    </template>
    <a-textarea v-if="actiontype" v-model="textVale" class="bg-white rounded" :max-length="{length:10000,errorOnly:true}" placeholder="请输入您拒绝的理由"/>
    <div v-else class="reason">{{ reason }}</div>
    <template #footer>
      <div class="cancel blue-1 cursor-pointer" @click="cancelHandler">取消</div>
      <a-space>
        <a-button class="active noboxshadow " :disabled="delLoading" style="width:128px; height: 40px;" @click="isAgreeHandler">
          <div style="font-size: 16px;line-height: 40px;font-weight: bold;"><a-spin v-if="delLoading"/> 确认</div>
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { approveArena, approvePoint } from '@/api/review';
import Message from '@arco-design/web-vue/es/message';

const emit = defineEmits(['cloosehandler'])
const props = defineProps({
    showbol: {
        type: Boolean,
        default: false,
    }, 
    title: {
        type: String,
        default: '拒绝信息',
    },
    reason: String, // 拒绝原因 当弹框为拒绝原因确认
    actiontype: { // 擂台，赛点，undefined
        type: String,
        default: '',
    },
    refuseid: Number
})
let sureDialog: boolean = $ref(false)
const textVale: string = $ref('')
watch(()=>props.showbol,(newV,oldV)=>{
    sureDialog = newV
},{immediate: true, deep: true})



const cancelHandler = () => {
    sureDialog = false
    emit('cloosehandler',false)
}

let delLoading: boolean = $ref(false)
const isAgreeHandler = async () => {
  if( props.reason ) { cancelHandler(); return }// 确认查看拒绝原因
  if( !textVale ) { Message.info('请输入您拒绝的理由'); return } 
  delLoading = true
  try {
    if( props.actiontype === '擂台') { // 拒绝
      await approveArena({id: props.refuseid || 0, accept: 2, reason: textVale}).finally(()=>{delLoading = false})
    }else if( props.actiontype === '赛点') { // 拒绝
      await approvePoint({id: String(props.refuseid), accept: 2, reason: textVale}).finally(()=>{delLoading = false})
    }
    sureDialog = false
    Message.success('success')
    emit('cloosehandler',true)
  } catch (error) {
    delLoading = false
  }
}


onMounted(()=>{
})

</script>

<style lang="less">
// &:hover{
//   background-color: transparent;
// }
.refuse-style{
  .arco-modal-header{
    .arco-modal-title{
      justify-content: flex-start;
    }
  }
  .arco-modal-body{
    height: 200px;
    padding: 20px !important;
    overflow: hidden;
    .arco-textarea-wrapper{
      width: 100%;
      height: 160px;
    }
    .reason{
      height: 100%;
      font-size: 16px;
      color: #858EBD;
      line-height: 22px;
      overflow-y: auto;
      &::-webkit-scrollbar{
          width: 8px;
      }
      &::-webkit-scrollbar-track-piece,&::-webkit-scrollbar-corner{
          background: transparent;
      }
      &::-webkit-scrollbar-thumb{
          border-radius: 7px;
          background-color: #ccc;
      }
    }
    .arco-textarea{
      padding: 9px 20px;
      font-size: 16px;
      line-height: 22px;
      color: #3A3F63;
      resize: none;
      border-radius: 4px;
      border: 1px solid #DAE0F2;
      &:hover{
        background-color: var(--color-bg-1);
      }
    }
  }
  .arco-modal-footer{
    justify-content: flex-end !important;
    padding: 0 20px 20px !important;
  }
}
// width: 426px;
// height: 160px;
</style>
  