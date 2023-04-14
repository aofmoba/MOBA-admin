<template>
  <div class="match-stage" style="width: 758px;">
    <div v-for="item,i in stageList" :key="i" class="card flex flex-col between" style="height: 54px;">
      <div class="reward-ranking flex-items mcolor-1 font-md">
        <a-date-picker
          v-model="item.startTime"
          style="width: 210px;height: 40px; margin-right: 29px;background-color: #fff;border: 1px solid #DAE0F2;"
          show-time
          format="YYYY/MM/DD HH:mm"
          placeholder="选择日期"
          :unmount-on-close="true"
          :disabled-date="startDisabledDate"
          :disabled-time="startDisabledTime"
        >
          <template #suffix-icon>
            <svg t="1676875927854" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9236" width="18" height="20"><path d="M378.857631 467.61921l-88.76158 0 0 88.76158 88.76158 0L378.857631 467.61921zM556.38079 467.61921l-88.76158 0 0 88.76158 88.76158 0L556.38079 467.61921zM733.903949 467.61921l-88.76158 0 0 88.76158 88.76158 0L733.903949 467.61921zM822.665529 156.952658l-44.38079 0 0-88.76158-88.76158 0 0 88.76158L334.475817 156.952658l0-88.76158-88.76158 0 0 88.76158-44.38079 0c-49.262984 0-88.317465 39.942711-88.317465 88.76158l-0.444115 621.332081c0 48.818869 39.498596 88.76158 88.76158 88.76158l621.332081 0c48.818869 0 88.76158-39.942711 88.76158-88.76158L911.427108 245.714238C911.427108 196.895369 871.484398 156.952658 822.665529 156.952658zM822.665529 867.046319 201.333448 867.046319 201.333448 378.857631l621.332081 0L822.665529 867.046319z" p-id="9237" fill="#858EBD"></path></svg>
          </template>
        </a-date-picker>
        <a-space>
          <a-input v-model="item.name" class="card-name" placeholder="请输入阶段名称" style="width: 188px;margin-right: 20px;"/>
        </a-space>
        <div v-if="( i !== 0 && stageList.length < 10 && stageList.length > 1) || ( stageList.length <= 1 )" class="cursor-pointer" style="margin-right: 20px;" @click="addStage(i)"><icon-plus style="font-size: 24px; color: #858EBD;" /></div>
        <div v-if="stageList.length > 1" class="cursor-pointer" @click="delStage(i)"><icon-minus style="font-size: 24px; color: #858EBD;" /></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { stepsData } from '@/api/competition'

const emit = defineEmits(['change-stage'])
const stageList = $ref<stepsData[]>([
  {
    name: '',
    startTime: 0,
  }
])

watch(()=> stageList,(newV:any,oldV:any)=>{
  if( newV ){
    let reault = newV.filter((item:any) => item.name && item.startTime )
    reault = reault.map((item: any) => ({name: item.name, startTime: Math.floor(new Date(item.startTime).getTime()/1000) }))
    // eslint-disable-next-line vue/custom-event-name-casing
    emit('change-stage',reault)
  }
},{deep:true})

const addStage = (index: number) => {
  stageList.splice(index+1,0,{
    name: '',
    startTime: 0,
  })
}
const delStage = (index: number) => {
  if( stageList.length > 1){
    stageList.splice(index,1)
  }
}
const range = (start: number, end: number) => {
  const result: any = []
  for (let i = start; i < end; i+=1) {
    result.push(i);
  }
  return result;
}

const startDisabledDate = (date: Date) =>{
  return !(date.getTime()+86400000 > new Date().getTime())
}
const startDisabledTime = (date: Date) =>{
  let tempH = 0
  let tempM = 0
  if( date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate() ){
    tempH = new Date().getHours()
    tempM = new Date().getMinutes()+1
  }
  return {
    disabledHours: () => range(0, tempH),
    disabledMinutes: () => range(0, tempM)
  }
}


const disabledDate = (date: Date) =>{
  return (
    date.getTime() < new Date(new Date().getFullYear(),0,1).getTime() ||
    date.getTime() > new Date(new Date().getFullYear(),11,31).getTime()
  )
}

</script>

<style scoped lang="less">
.match-stage{
  .card{
    padding: 7px 30px;
    margin-left: -30px;
    &.active,&:hover{
      background-color: rgba(218, 224, 242, 1);
    }
  }
}
</style>
