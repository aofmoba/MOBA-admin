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
const isAgreeHandler = () => {
  delLoading = true
  if( props.actiontype === '擂台') { // 同意
    console.log('擂台同意');
    // eslint-disable-next-line no-multi-assign
    delLoading = sureDialog = false
    emit('cloosehandler',false)
    // deleteArena(sureid).then((res:any)=>{
    //   if( res.error_code === 0) {
    //     onPageChange(1)
    //     sureDialog = false
    //     Message.success('success')
    //   }
    // }).finally(()=>{delLoading = false})
  }else if( props.actiontype === '赛事') { // 同意
    console.log('赛事同意');
    // eslint-disable-next-line no-multi-assign
    delLoading = sureDialog = false
    emit('cloosehandler',false)
    // deleteArena(sureid).then((res:any)=>{
    //   if( res.error_code === 0) {
    //     onPageChange(1)
    //     sureDialog = false
    //     Message.success('success')
    //   }
    // }).finally(()=>{delLoading = false})
  }else if( props.actiontype === '结束比赛' ){ // 结束比赛
    console.log('结束比赛');
    // eslint-disable-next-line no-multi-assign
    delLoading = sureDialog = false
    emit('cloosehandler',false)
  }
}

const cancelHandler = () => {
    sureDialog = false
    emit('cloosehandler',false)
}

onMounted(()=>{
})

</script>

<style scoped lang="less">

</style>
  