<template>
  <div class="live-video">
    <a-form ref="formRef" :model="formCom" @submit="handleSubmit">
      <a-form-item
        field="title" label="内容标题："
        :rules="[{ required: true, message:'' },{maxLength:20,message:'最多可填写20个字'}]"
        :validate-trigger="['blur']"
      >
        <a-input v-model="formCom.title" placeholder="请输入您的内容名称" />
      </a-form-item>
      <a-form-item
        field="image" label="内容小图："
        :rules="[{ required: true, message:'' }]"
      >
        <div class="flex-col">
          <Mupload :width="160" :height="120" :uwidth="160" :uheight="120" @change-banner="changeBanner1" />
          <div class="mt-10 mtext-gray font-sm">尺寸（160*120px），仅限JPG和PNG格式</div>
        </div>
      </a-form-item>
      <a-form-item field="video" label="内容图文信息：">
        <Mupload :width="240" :height="135" @change-banner="changeBanner2" />
      </a-form-item>
      <a-form-item field="videoUrl" label="视频URL：">
        <a-input v-model="formCom.videoUrl" placeholder=" " />
      </a-form-item>
      <a-form-item field="viewTime" label="内容展示时间：">
        <DatePicker @change-date="changeDate"/>
      </a-form-item>
      <a-form-item field="sortOrder" label="内容排序顺序：">
        <a-input-number v-model="formCom.sortOrder" :hide-button="true" :min="0" :max="100000" :style="{width:'188px',marginRight: '10px'}" placeholder=" " />
        <div>（0-100000）</div>
      </a-form-item>
      <a-form-item>
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
    type: '视频/直播',
    title: '',
    image: {},
    video: {},
    videoUrl: '',
    viewTime: {},
    sortOrder: null
});
const changeBanner1 = (file: FileItem) => {
  formCom.image = file
}
const changeBanner2 = (file: FileItem) => {
  formCom.video = file
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
  .live-video {
    :deep(.arco-form){
      .arco-row:nth-child(2)>.arco-form-item-label-col,
      .arco-row:nth-child(3)>.arco-form-item-label-col{
        margin-top: 9px;
      }
    }
  }
</style>
