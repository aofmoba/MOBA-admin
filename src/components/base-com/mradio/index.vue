<template>
    <a-radio-group v-model="modelValue.deValue" style="height: 40px;">
        <template v-for="item in radioarr" :key="item">
        <a-radio :value="item">
            <template #radio="{ checked }">
            <a-space
                align="start"
                class="custom-radio-card"
                :class="{ 'custom-radio-card-checked': checked }"
            >
                <div className="custom-radio-card-mask">
                <div className="custom-radio-card-mask-dot" />
                </div>
                <div class="mcolor-1" style="font-size: 16px;margin-left: 2px;">{{ item }}</div>
            </a-space>
            </template>
        </a-radio>
        </template>
    </a-radio-group>
</template>

<script lang="ts" setup>
import { watch,reactive, PropType } from 'vue'

const emit = defineEmits(['change-radio'])
const modelValue: any = reactive({
  deValue: ''
})
const props = defineProps({
    radioarr: {
        type: Array as PropType<string[]>,
        default() {
            return [];
        },
    },
    defaultvalue: {
        type: String,
        default() {
            return '';
        },
    },
    types: Number
});
watch(()=>props.defaultvalue,(newV,oldV)=>{
    modelValue.deValue = newV
},{immediate: true,deep: true})

watch(modelValue,(newV,oldV)=>{
    // eslint-disable-next-line vue/custom-event-name-casing
    emit('change-radio',newV.deValue, props.types)
},{immediate: true,deep: true})

</script>

<style scoped lang="less">
.arco-radio-group{
  display: flex;
  align-items: center;
}
.custom-radio-card-mask {
  height: 18px;
  width: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  border: 1px solid #B3C0E7;
  box-sizing: border-box;
}

.custom-radio-card-mask-dot {
  width: 12px;
  height: 12px;
  border-radius: 100%;
}
.custom-radio-card:hover,
.custom-radio-card-checked,
.custom-radio-card:hover .custom-radio-card-mask,
.custom-radio-card-checked  .custom-radio-card-mask{
  border-color: #4458FE;
}

.custom-radio-card:hover .custom-radio-card-title,
.custom-radio-card-checked .custom-radio-card-title {
  color: rgb(var(--primary-6));
}

.custom-radio-card-checked .custom-radio-card-mask-dot {
  background-color: #4458FE;
}

</style>
