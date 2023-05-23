<template>
  <a-modal 
    v-model:visible="sureDialog" 
    modal-class="del-lots"
  >
    <template #title>
      <div style="font-size: 20px;line-height: 28px;color: #3A3F63;font-weight: bold;">{{ title }}</div>
      <img class="close-btn" style="width: 32px;height: 32px;" src="https://moba-project.s3-accelerate.amazonaws.com/admin/close.svg" alt="" @click="cancelHandler">
    </template>
    <div class="flex-center font-md mcolor-1">
      <div v-if="actiontype !== '结束比赛'">您确定要同意此{{ actiontype }}吗？</div>
      <div v-else>您确定要结束比赛吗？</div>
    </div>
    <template #footer>
      <a-space>
        <a-button class="active noboxshadow " :disabled="delLoading" style="width:128px; height: 40px;" @click="isAgreeHandler">
          <div style="font-size: 16px;line-height: 40px;font-weight: bold;"><a-spin v-if="delLoading"/> 确认</div>
        </a-button>
      </a-space>
      <div class="cancel blue-1 cursor-pointer" @click="cancelHandler">取消</div>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { approveArena, approvePoint, approveComp } from '@/api/review';
import Message from '@arco-design/web-vue/es/message';

const emit = defineEmits(['cloosehandler'])
const props = defineProps({
    showbol: {
        type: Boolean,
        default: false,
    }, 
    title: {
        type: String,
        default: '确认信息',
    },
    actiontype: {
        type: String,
        default: '',
    },
    sureid: Number
})
let sureDialog: boolean = $ref(false)
watch(()=>props.showbol,(newV,oldV)=>{
    sureDialog = newV
},{immediate: true, deep: true})


let delLoading: boolean = $ref(false)
const isAgreeHandler = async() => {
  delLoading = true
  try {
    if( props.actiontype === '擂台') { // 同意
      await approveArena({id: props.sureid || 0, accept: 1}).finally(()=>{delLoading = false})
    }else if( props.actiontype === '赛点') { // 同意
      await approvePoint({id: String(props.sureid), accept: 1}).finally(()=>{delLoading = false})
    }else if( props.actiontype === '结束比赛' ){ // 结束比赛
      delLoading = false
      Message.info('Sorry, this feature is still under development...')
      return
    }
    sureDialog = false
    Message.success('success')
    emit('cloosehandler', true)
  } catch (error) {
    delLoading = false
  }
}

const cancelHandler = () => {
    sureDialog = false
    emit('cloosehandler',false)
}

onMounted(()=>{})

</script>

<style scoped lang="less">

</style>
  