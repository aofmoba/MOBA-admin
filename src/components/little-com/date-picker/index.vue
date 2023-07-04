<template>
  <div class="date-picker flex-items">
    <a-date-picker
      style="width: 210px;height: 40px; margin-right: 10px;background-color: transparent;border: 1px solid #DAE0F2;"
      show-time
      :default-value="backStart?backStart:''"
      format="YYYY/MM/DD HH:mm"
      placeholder="选择日期"
      :unmount-on-close="true"
      :disabled-date="startDisabledDate"
      :disabled-time="startDisabledTime"
      @clear="clearStart"
      @ok="onStart"
      >
      <!-- :disabled-time="getDisabledTime1" -->
      <template #suffix-icon>
        <svg t="1676875927854" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9236" width="18" height="20"><path d="M378.857631 467.61921l-88.76158 0 0 88.76158 88.76158 0L378.857631 467.61921zM556.38079 467.61921l-88.76158 0 0 88.76158 88.76158 0L556.38079 467.61921zM733.903949 467.61921l-88.76158 0 0 88.76158 88.76158 0L733.903949 467.61921zM822.665529 156.952658l-44.38079 0 0-88.76158-88.76158 0 0 88.76158L334.475817 156.952658l0-88.76158-88.76158 0 0 88.76158-44.38079 0c-49.262984 0-88.317465 39.942711-88.317465 88.76158l-0.444115 621.332081c0 48.818869 39.498596 88.76158 88.76158 88.76158l621.332081 0c48.818869 0 88.76158-39.942711 88.76158-88.76158L911.427108 245.714238C911.427108 196.895369 871.484398 156.952658 822.665529 156.952658zM822.665529 867.046319 201.333448 867.046319 201.333448 378.857631l621.332081 0L822.665529 867.046319z" p-id="9237" fill="#858EBD"></path></svg>
      </template>
    </a-date-picker>
    <div class="flex-items mcolor-1">开始<div class="mtext-1 white-nowrap overhidden flex-content" style="width: 26px;margin: 0 20px;">— —</div></div>
    <a-date-picker
      style="width: 210px;height: 40px; margin-right: 10px;background-color: var(--color-bg-1);border: 1px solid #DAE0F2;"
      show-time
      :default-value="backFinish?backFinish:''"
      format="YYYY/MM/DD HH:mm"
      placeholder="选择日期"
      :unmount-on-close="true"
      :disabled-date="endDisabledDate"
      :disabled-time="endDisabledTime"
      @clear="clearEnd"
      @ok="onEnd"
      >
      <!-- :disabled-time="getDisabledTime2" -->
      <template #suffix-icon>
        <svg t="1676875927854" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9236" width="18" height="20"><path d="M378.857631 467.61921l-88.76158 0 0 88.76158 88.76158 0L378.857631 467.61921zM556.38079 467.61921l-88.76158 0 0 88.76158 88.76158 0L556.38079 467.61921zM733.903949 467.61921l-88.76158 0 0 88.76158 88.76158 0L733.903949 467.61921zM822.665529 156.952658l-44.38079 0 0-88.76158-88.76158 0 0 88.76158L334.475817 156.952658l0-88.76158-88.76158 0 0 88.76158-44.38079 0c-49.262984 0-88.317465 39.942711-88.317465 88.76158l-0.444115 621.332081c0 48.818869 39.498596 88.76158 88.76158 88.76158l621.332081 0c48.818869 0 88.76158-39.942711 88.76158-88.76158L911.427108 245.714238C911.427108 196.895369 871.484398 156.952658 822.665529 156.952658zM822.665529 867.046319 201.333448 867.046319 201.333448 378.857631l621.332081 0L822.665529 867.046319z" p-id="9237" fill="#858EBD"></path></svg>
      </template>
    </a-date-picker>
    <div class="mcolor-1">结束</div>
  </div>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { $ref } from "vue/macros"
import { getIntTime } from '@/utils/computed'

const emit = defineEmits(['change-date'])
const props = defineProps({
  starttime: Number,
  finishtime: Number,
  types: Number,
  interval: { // true: 不设置24小时限制，默认设置
    type: Boolean,
    default: false
  }
})
interface dateType {
  start: number;
  end: number;
}
const dataDuration: dateType = $ref({
  start: 0,
  end: 0
})

let backStart: number = $ref()
let backFinish: number = $ref()
watch(()=>props, (newV)=>{
  // eslint-disable-next-line no-multi-assign
  dataDuration.start = backStart = Number(newV.starttime)*1000
  // eslint-disable-next-line no-multi-assign
  dataDuration.end = backFinish = Number(newV.finishtime)*1000
},{immediate: true,deep: true})


const range = (start: number, end: number) => {
  const result: any = []
  for (let i = start; i < end; i+=1) {
    result.push(i);
  }
  return result;
}
const startDisabledDate = (date: Date) =>{
  const newDate = new Date()
  if( props.interval ){ // 无24小时间隔
    return dataDuration.end ? !(date.getTime() <= dataDuration.end && (date.getTime()+86340000 > newDate.getTime())) : !(date.getTime()+86400000 > newDate.getTime())
  }
  return dataDuration.end ? !(date.getTime() <= (dataDuration.end - 86340000) && (date.getTime()+86340000 > newDate.getTime())) : !(date.getTime()+86400000 > newDate.getTime())
}
const endDisabledDate = (date: Date) =>{
  const newDate = new Date()
  if( props.interval ){ // 无24小时间隔
    return dataDuration.start ? !(date.getTime()+86400000 >= dataDuration.start) : !(date.getTime()+86400000 >= newDate.getTime())
  }
  return dataDuration.start ? !(date.getTime() >= dataDuration.start) : !(date.getTime() >= newDate.getTime())
}

const startDisabledTime = (date: Date) =>{
  const newDate = new Date()
  let curH = 24
  let curM = 60
  let tempH = 0
  let tempM = 0
  // 日期必须大于当前年月日时
  if( date.getFullYear() === newDate.getFullYear() && date.getMonth() === newDate.getMonth() && date.getDate() === newDate.getDate() ){
    tempH = newDate.getHours()
    if( date.getHours() <= newDate.getHours() ){ // 确定在当前的小时后的分钟为可选,当前小时及以前的分钟不可选
      tempM = newDate.getMinutes()+1
    }
  }
  if( props.interval ){ // 无24小时间隔
    if( dataDuration.end && date.getFullYear() === new Date(dataDuration.end).getFullYear() && date.getMonth() === new Date(dataDuration.end).getMonth() && date.getDate() === new Date(dataDuration.end).getDate() ){
      curH = new Date(dataDuration.end).getHours()+1
      if( date.getHours() === new Date(dataDuration.end).getHours() ){ // 选择时间hour与结束时间hour相同时 限制minute区段
        curM = new Date(dataDuration.end).getMinutes()
      }
    }
  }else{
    // eslint-disable-next-line no-lonely-if
    if( 
        (dataDuration.end && date.getFullYear() === new Date(dataDuration.end).getFullYear() && date.getMonth() === new Date(dataDuration.end).getMonth() && date.getDate() === new Date(dataDuration.end).getDate()-1) || // 同年同月前后两天
        (dataDuration.end && date.getFullYear() === new Date(dataDuration.end).getFullYear() && date.getMonth() === new Date(dataDuration.end).getMonth()-1 && new Date(dataDuration.end).getDate() === 1 && date.getDate() === new Date(date.getFullYear(), date.getMonth()+1, 0).getDate()) || // 同年不同月上月底和下月初两天
        (dataDuration.end && date.getFullYear() === new Date(dataDuration.end).getFullYear()-1 && date.getMonth() === 11 && new Date(dataDuration.end).getMonth() === 0 && new Date(dataDuration.end).getDate() === 1 && date.getDate() === new Date(date.getFullYear(), date.getMonth()+1, 0).getDate()) // 同年不同月上月底和下月初两天
    ){
        curH = new Date(dataDuration.end).getHours()+1
        curM = new Date(dataDuration.end).getMinutes()+1
    }
  }
  
  // 确定在开始时间的小时后的分钟为可选
  if( dataDuration.end && date.getHours()<new Date(dataDuration.end).getHours() && (date.getDate()===newDate.getDate() ? date.getHours()>newDate.getHours() : true) ){
    tempM = 0
    curM = 60
  }

  return !dataDuration.end ? 
  {
    disabledHours: () => range(0, tempH),
    disabledMinutes: () => range(0, tempM)
  }: 
  {
    disabledHours: () => [...range(0, tempH),...range(curH, 24)],
    disabledMinutes: () => [...range(0, tempM),...range(curM, 60)]
  };
}
const endDisabledTime = (date: Date) =>{
  const newDate = new Date()
  let curH = 0
  let curM = 0
  if( props.interval ){ // 无24小时间隔
    if( dataDuration.start && date.getFullYear() === new Date(dataDuration.start).getFullYear() && date.getMonth() === new Date(dataDuration.start).getMonth() && date.getDate() === new Date(dataDuration.start).getDate()){
      curH = new Date(dataDuration.start).getHours()
      curM = new Date(dataDuration.start).getMinutes()+1
    }else if( !dataDuration.start && date.getFullYear() === new Date(dataDuration.start).getFullYear() && date.getMonth() === new Date(dataDuration.start).getMonth() && date.getDate() === new Date(dataDuration.start).getDate()){
      curH = newDate.getHours()
      curM = newDate.getMinutes()+1
    }
  }else{
    // eslint-disable-next-line no-lonely-if
    if( dataDuration.start ){
      if( 
        (date.getFullYear() === new Date(dataDuration.start).getFullYear() && date.getMonth() === new Date(dataDuration.start).getMonth() && date.getDate() === new Date(dataDuration.start).getDate()+1) || // 同年同月前后两天
        (date.getFullYear() === new Date(dataDuration.start).getFullYear() && date.getMonth() === new Date(dataDuration.start).getMonth()+1 && date.getDate() === 1 && new Date(dataDuration.start).getDate() === new Date(new Date(dataDuration.start).getFullYear(), new Date(dataDuration.start).getMonth()+1, 0).getDate()) || // 同年不同月上月底和下月初两天
        (date.getFullYear() === new Date(dataDuration.start).getFullYear()+1 && date.getMonth() === 0 && new Date(dataDuration.start).getMonth() === 11 && date.getDate() === 1 && new Date(dataDuration.start).getDate() === new Date(new Date(dataDuration.start).getFullYear(), new Date(dataDuration.start).getMonth()+1, 0).getDate()) // 不同年不同月上年最后一月最后一天和下年第一月第一天两天
      ){
        curH = new Date(dataDuration.start).getHours()
        curM = new Date(dataDuration.start).getMinutes()
      }
    }else{
      // eslint-disable-next-line no-lonely-if
      if( 
        (date.getFullYear() === newDate.getFullYear() && date.getMonth() === newDate.getMonth() && date.getDate() === newDate.getDate()+1) || // 同年同月当前天的后一天
        (date.getFullYear() === newDate.getFullYear() && date.getMonth() === newDate.getMonth()+1 && date.getDate() === 1 && newDate.getDate() === new Date(newDate.getFullYear(), newDate.getMonth()+1, 0).getDate()) || // 同年不同月当前月最后一天的后一天
        (date.getFullYear() === newDate.getFullYear()+1 && date.getMonth() === 0 && newDate.getMonth() === 11 && date.getDate() === 1 && newDate.getDate() === new Date(newDate.getFullYear(), newDate.getMonth()+1, 0).getDate()) // 不同年不同月当前年最后一月最后一天的后一天
      ){
        curH = newDate.getHours()
        curM = newDate.getMinutes()+1
      }
    }
  }
  // 确定在当前或者开始时间后的小时的分钟为可选
  if( date.getHours() > (dataDuration.start ? new Date(dataDuration.start).getHours() : newDate.getHours() ) ){
    curM = 0
  }
  return {
    disabledHours: () => range(0, curH),
    disabledMinutes: () => range(0, curM)
  };
}

const onStart = (dateString: string, date: Date) => {
  dataDuration.start = getIntTime(date)
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('change-date',dataDuration,props.types)
}
const onEnd = (dateString: string, date: Date) => {
  dataDuration.end = getIntTime(date)
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('change-date',dataDuration, props.types)
}
const clearStart = () => {
  dataDuration.start = 0
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('change-date',dataDuration, props.types)
}
const clearEnd = () => {
  dataDuration.end = 0
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('change-date',dataDuration, props.types)
}

</script>

<style scoped lang="less">
</style>
