<template>
  <div class="upload-wrap">
    <a-upload
      ref="uploadRef"
      :file-list="file ? [file] : []"
      :show-file-list="false"
      :auto-upload="false"
      @change="onChange"
      @before-upload="beforeUpload"
      >
      <!-- :custom-request="uploadRequest" -->
      <template #upload-button>
        <div
          :class="`arco-upload-list-item${file && file.status === 'error' ? ' arco-upload-list-item-error' : ''}`"
        >
          <div
            v-if="file && file.url"
            class="arco-upload-list-picture"
            :style="{'width':width+'px','height':height+'px'}"
          >
            <img :src="file.url" />
            <div class="arco-upload-list-picture-mask">
              <div class="flex-center flex-col pre100">
                <img style="width: 18px;height: 18px;" :src="deleteImg" alt="">
                <div class="mt-10 font-sm">重新上传</div>
              </div>
            </div>
            <a-progress
              v-if="file.status === 'uploading' && file.percent < 100"
              :percent="file.percent"
              type="circle"
              size="mini"
              :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              }"
            />
          </div>
          <div v-else class="arco-upload-picture-card" :style="{'width':width+'px','height':height+'px'}">
            <div class="arco-upload-picture-card-text">
              <IconPlus class="mtext-1" style="font-size: 18px;" />
              <div class="mtext-1 font-sm" style="margin-top: 10px;">{{ text }}</div>
            </div>
          </div>
        </div>
      </template>
    </a-upload>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { FileItem, RequestOption,  Message, UploadRequest } from '@arco-design/web-vue'
import axios from 'axios'

const deleteImg = new URL('../../../assets/images/icons/delete.svg', import.meta.url).href
const emit = defineEmits(['change-banner'])
const props = defineProps({
  width:{
    type: Number,
    default: 160,
  },
  height:{
    type: Number,
    default: 160,
  },
  uwidth:{
    type: Number,
  },
  uheight:{
    type: Number
  },
  text:{
    type: String,
    default: '点击上传'
  },
  aindex: Number
})
let file: FileItem | any = $ref();

const onChange = (_: FileItem[], currentFile: FileItem) => {
  file = {...currentFile}
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('change-banner',file, props.aindex )
}

const beforeUpload = (files: File) => {
  return new Promise((resolve, reject) => {
      const img = new Image()
      const isJPG = files.type === "image/jpg"
      const isPng = files.type ==="image/png"
      // eslint-disable-next-line no-underscore-dangle
      const _URL = window.URL || window.webkitURL
      img.onload = () => {
        if( !props.uheight ){
          const status = img.width === props.uwidth
          // eslint-disable-next-line no-unused-expressions
          status && (isJPG || isPng) ? resolve(true) : reject();
        }else{
          const status = img.width === props.uwidth && img.height === props.uheight
          // eslint-disable-next-line no-unused-expressions
          status && (isJPG || isPng) ? resolve(true) : reject();
        }
      }
      img.src = _URL.createObjectURL(files);
  }).then(()=>{
      // 调用后台接口上传图片的方法
      console.log('success');
      return true
  }).catch(()=>{
      // 上传文件的图片大小不合符标准,尺寸为240×240。当前上传图片的尺寸为：
      Message.error('图片尺寸不合符标准')
      return false
  })
}

const uploadRequest = (fileItem: any) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", fileItem as File);
    // eslint-disable-next-line no-use-before-define
    axios.post("/localhost/pinFileToIPFS", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({data}) => {
        const imgUrl = `https://cyberpop.mypinata.cloud/ipfs/${data.IpfsHash}`
        resolve(imgUrl)
        // eslint-disable-next-line vue/custom-event-name-casing
        // emit('change-banner',imgUrl, props.aindex )
      })
      .catch((e: any) => {console.log(e);reject()});
  })
};

defineExpose({uploadRequest})

onMounted(()=>{
})

</script>

<style scoped lang="less">
.upload-wrap{
  :deep(.arco-upload){
    .arco-upload-picture-card{
      border-radius: 4px;
      background: transparent;
      border: none;
      background-image: linear-gradient(to right, #DAE0F2 50%, rgba(255, 255, 255, 0) 0%),
        linear-gradient(#DAE0F2 50%, rgba(255, 255, 255, 0) 0%),
        linear-gradient(to left, #DAE0F2 50%, rgba(255, 255, 255, 0) 0%),
        linear-gradient(to top, #DAE0F2 50%, rgba(255, 255, 255, 0) 0%);
      background-position: top, right, bottom, left;
      background-size: 20px 1px, 1px 20px, 20px 1px, 1px 20px;
      background-repeat: repeat-x, repeat-y, repeat-x, repeat-y;
      &:hover{
        background-image: linear-gradient(to right, #4458FE 50%, rgba(255, 255, 255, 0) 0%),
        linear-gradient(#4458FE 50%, rgba(255, 255, 255, 0) 0%),
        linear-gradient(to left, #4458FE 50%, rgba(255, 255, 255, 0) 0%),
        linear-gradient(to top, #4458FE 50%, rgba(255, 255, 255, 0) 0%);
      }
    }
    .arco-upload-list-picture{
      position: relative;
      border-radius: 4px;
      background: transparent;
      border: none;
      &::before{
        content: "";
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        background-image: linear-gradient(to right, #DAE0F2 50%, rgba(255, 255, 255, 0) 0%),
          linear-gradient(#DAE0F2 50%, rgba(255, 255, 255, 0) 0%),
          linear-gradient(to left, #DAE0F2 50%, rgba(255, 255, 255, 0) 0%),
          linear-gradient(to top, #DAE0F2 50%, rgba(255, 255, 255, 0) 0%);
        background-position: top, right, bottom, left;
        background-size: 20px 1px, 1px 20px, 20px 1px, 1px 20px;
        background-repeat: repeat-x, repeat-y, repeat-x, repeat-y;
        &:hover{
          background-image: linear-gradient(to right, #4458FE 50%, rgba(255, 255, 255, 0) 0%),
          linear-gradient(#4458FE 50%, rgba(255, 255, 255, 0) 0%),
          linear-gradient(to left, #4458FE 50%, rgba(255, 255, 255, 0) 0%),
          linear-gradient(to top, #4458FE 50%, rgba(255, 255, 255, 0) 0%);
        }
      }
    }
  }
}
</style>
