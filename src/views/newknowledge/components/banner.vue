<template>
  <div class="banner-type">
    <a-form ref="formRef" class="other-form" :model="formKnow" @submit="handleSubmit">
      <a-form-item
        field="image" label="内容Banner："
        :rules="[{ required: true, message:'' }]"
      >
        <div class="flex-col">
          <Mupload :width="335" :height="120" :uwidth="670" :uheight="240" @change-banner="changeBanner" />
          <div class="mt-10 mtext-gray font-sm">尺寸（670*240px），仅限JPG和PNG格式</div>
        </div>
      </a-form-item>
      <a-form-item field="jumpUrl" label="跳转路径：">
        <Mradio :radioarr="['游戏内','游戏外']" :defaultvalue="formKnow.jumpUrl" @change-radio="changeRadio" />
      </a-form-item>
      <a-form-item field="imageUrl" label="Banner跳转路径：">
        <a-input v-if="formKnow.jumpUrl === '游戏内'" v-model="formKnow.imageUrl" placeholder=" " />
        <div v-else class="know-select">
          <a-space>
            <div class="mr-10 white-nowrap">一级路径 :</div>
            <a-select v-model="level1" :unmount-on-close="true" placeholder="选择路径" :style="{width:'168px',height: '40px'}">
              <a-option v-for="value,i of Object.keys(formKnow.outGame)" :key="i">{{value}}</a-option>
            </a-select>
            <div class="mr-10 ml-30 white-nowrap">二级路径 :</div>
            <a-select v-model="level2" :unmount-on-close="true" placeholder="选择路径" :style="{width:'168px',height: '40px'}">
              <a-option v-for="value,i of Object.keys(formKnow.outGame[level1])" :key="i">{{value}}</a-option>
            </a-select>
            <div class="mr-10 ml-30 white-nowrap">三级路径 :</div>
            <a-select v-model="level3" :unmount-on-close="true" placeholder="选择路径" :style="{width:'168px',height: '40px'}" :options="formKnow.outGame[level1][level2] || []" />
          </a-space>
        </div>
      </a-form-item>
      <a-form-item field="viewTime" label="内容展示时间：">
        <DatePicker @change-date="changeDate"/>
      </a-form-item>
      <a-form-item field="sortOrder" label="内容排序顺序：">
        <a-input-number v-model="formKnow.sortOrder" :hide-button="true" :min="1" :max="5" :style="{width:'188px',marginRight: '10px'}" placeholder=" " />
        <div>（1-5)</div>
      </a-form-item>
      <a-form-item style="align-items: end;">
        <div class="flex-center" style="width: 758px;">
          <a-button class="active large" html-type="submit"><div>保存并确认</div></a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch,ref } from 'vue'
import { FileItem, ValidatedError } from '@arco-design/web-vue';
import { LoginData } from '@/api/user';
import { $ref } from 'vue/macros';

const formRef: HTMLFormElement = $ref()
const level1 = ref('首页1');
const level2 = ref('');
const level3 = ref('');
const formKnow:any = reactive({
    type: 'Banner',
    image: {},
    jumpUrl: '游戏外',
    imageUrl: '',
    outGame: {
      '首页1': {
        '首页1-1': ['游戏内','结束页','社交对话框','新闻页'],
        '首页1-2': ['游戏内','结束页','社交对话框','新闻页'],
        '首页1-3': ['游戏内','结束页','社交对话框','新闻页'],
      },
      '首页2': {
        '首页2-1': ['游戏内','结束页','社交对话框','新闻页'],
        '首页2-2': ['游戏内','结束页','社交对话框','新闻页'],
        '首页2-3': ['游戏内','结束页','社交对话框','新闻页'],
      },
      '首页3': {
        '首页3-1': ['游戏内','结束页','社交对话框','新闻页'],
        '首页3-2': ['游戏内','结束页','社交对话框','新闻页'],
        '首页3-3': ['游戏内','结束页','社交对话框','新闻页'],
      }
    },
    viewTime: {},
    sortOrder: null
});
watch(level1, () => {
  level2.value = ''
})
watch(level2, () => {
  level3.value = ''
})
const changeBanner = (file: FileItem) => {
  formKnow.image = file
}
const changeRadio = (file: any) => {
  formKnow.jumpUrl = file
}
const changeDate = (date: Date) => {
  formKnow.viewTime = date
}
const handleSubmit = ({errors, values,}: {
    values: Record<string, LoginData>,
    errors: Record<string, ValidatedError> | undefined
  }) => {
    console.log('values:', values, '\nerrors:', errors,)
    if( !errors && formKnow.reward.length && (Object.keys(formKnow.rules.file).length || formKnow.rules.text) ){
      alert('success')
    }
}

onMounted(() => {
})
</script>

<style lang="less" scoped>
  .banner-type {
    :deep(.arco-form){
      .arco-row:nth-child(1)>.arco-form-item-label-col{
        margin-top: 9px;
      }
      .know-select{
        .arco-select{
          padding: 0 18px 0 20px;
          background: var(--color-bg-1);
          border-radius: 4px;
          border: 1px solid #DAE0F2;
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
    }
  }
</style>

