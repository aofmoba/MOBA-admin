<template>
  <div class="form-group other-form m-30">
    <a-form :model="formCom">
      <a-form-item field="type" label="内容类型：">
        <Mradio :radioarr="['图文','Banner','视频/直播']" :defaultvalue="formCom.type" @change-radio="changeRadio" />
      </a-form-item>
    </a-form>
    <ImageText v-if="formCom.type === '图文'" />
    <Banner v-if="formCom.type === 'Banner'" />
    <LiveVodeo v-if="formCom.type === '视频/直播'" />
</div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import ImageText from './image-text.vue';
import Banner from './banner.vue';
import LiveVodeo from './live-video.vue';

const formCom:any = reactive({
    type: '图文',
});
const changeRadio = (file: any) => {
  formCom.type = file
}
</script>

<style lang="less" scoped>
.arco-form{
  .arco-row{
    margin-bottom: 15px;
  }
}
</style>
