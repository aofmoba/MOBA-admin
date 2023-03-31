<template>
  <div class="banner-type">
    <a-form ref="formRef" class="other-form" :model="formCom" @submit="handleSubmit">
      <a-form-item
        field="image" label="内容Banner："
        :rules="[{ required: true, message:'' }]"
      >
        <div class="flex-col">
          <Mupload :width="335" :height="120" :uwidth="670" :uheight="240" @change-banner="changeBanner" />
          <div class="mt-10 mtext-gray font-sm">尺寸（670*240px），仅限JPG和PNG格式</div>
        </div>
      </a-form-item>
      <a-form-item field="imageUrl" label="Banner跳转路径：">
        <a-input v-model="formCom.videoUrl" placeholder=" " />
      </a-form-item>
      <a-form-item field="viewTime" label="内容展示时间：">
        <DatePicker @change-date="changeDate"/>
      </a-form-item>
      <a-form-item field="sortOrder" label="内容排序顺序：">
        <a-input-number v-model="formCom.sortOrder" :hide-button="true" :min="0" :max="100000" :style="{width:'188px',marginRight: '10px'}" placeholder=" " />
        <div>（0-100000）</div>
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
import { reactive, onMounted } from 'vue'
import { FileItem, ValidatedError } from '@arco-design/web-vue';
import { LoginData } from '@/api/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const formRef: HTMLFormElement = $ref()
const formCom:any = reactive({
    type: 'Banner',
    image: {},
    imageUrl: '',
    viewTime: {},
    sortOrder: null
});
const changeBanner = (file: FileItem) => {
  formCom.image = file
}
const changeDate = (date: Date) => {
  formCom.viewTime = date
}
const handleSubmit = ({errors, values,}: {
    values: Record<string, LoginData>,
    errors: Record<string, ValidatedError> | undefined
  }) => {
    console.log('values:', values, '\nerrors:', errors,)
    if( !errors && formCom.reward.length && (Object.keys(formCom.rules.file).length || formCom.rules.text) ){
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
    }
  }
</style>
