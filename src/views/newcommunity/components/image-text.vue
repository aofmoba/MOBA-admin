<template>
  <div class="image-text">
    <a-form ref="formRef" class="other-form" :model="formCom" @submit="handleSubmit">
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
          <Mupload :width="160" :height="120" :uwidth="160" :uheight="120" @change-banner="changeBanner" />
          <div class="mt-10 mtext-gray font-sm">尺寸（160*120px），仅限JPG和PNG格式</div>
        </div>
      </a-form-item>
      <a-form-item field="imageText" label="内容图文信息：">
        <div class="image-content">
            <div class="img-textarea bg-white rounded" contenteditable="true" @focus="initImageText(1)" style="width: 758px;height: 120px;" @paste="descImgPaste($event)"></div>
            <div class="mt-10 mtext-gray font-sm">图片宽度尺寸为（1540px），仅限JPG和PNG格式</div>
        </div>
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
    type: '图文',
    title: '',
    image: {},
    imageText:{
      description: '请输入您的内容图文信息',
      figure:[]
    },
    viewTime: {},
    sortOrder: null
});
const changeBanner = (file: FileItem) => {
  formCom.image = file
}
const changeDate = (date: Date) => {
  formCom.viewTime = date
}
const initImageText = (type?: number) => {
  const elem: any = document.getElementsByClassName('img-textarea')[0]
  if( type ) {
    formCom.imageText.description = ''
    elem.style.color = '#3A3F63'
  }
  elem.innerHTML =  formCom.imageText.description
}
const descImgPaste = (event: any) => {
    if (event.clipboardData || event.originalEvent) {
        const clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
        if(clipboardData.items){
            let blob
            for (let i = 0; i < clipboardData.items.length; i+=1) {
                if (clipboardData.items[i].type.indexOf("image") !== -1) {
                    blob = clipboardData.items[i].getAsFile();
                }
            }
            const render = new FileReader();
            render.onload = (evt: any) => {
                // 输出base64编码
                const base64 = evt.target.result;
                const imgElem: any = document.createElement('img') as HTMLImageElement
                imgElem.src = base64
                document.getElementsByClassName('img-textarea')[0].appendChild(imgElem)
            }
            if(blob){
                render.readAsDataURL(blob);
            }
        }
    }
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
  initImageText()
})
</script>

<style lang="less" scoped>
  .image-text {
    :deep(.arco-form){
      .arco-row:nth-child(2)>.arco-form-item-label-col,
      .arco-row:nth-child(3)>.arco-form-item-label-col{
        margin-top: 9px;
      }
      .image-content{
        .img-textarea{
          padding: 9px 20px;
          color: #858EBD;
          font-size: 16px;
          line-height: 22px;
          border-radius: 4px;
          border: 1px solid #DAE0F2;
          &:focus-visible{
            outline: none;
          }
        }
      }      
    }
  }
</style>
