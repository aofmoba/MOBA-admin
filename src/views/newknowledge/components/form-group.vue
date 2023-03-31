<template>
  <div class="form-group other-form m-30">
    <a-form :model="formKnow">
      <a-form-item field="type" label="内容类型：">
        <Mradio :radioarr="['Banner','功能目录','资讯内容']" :defaultvalue="formKnow.type" @change-radio="changeRadio" />
      </a-form-item>
    </a-form>
    <Banner v-if="formKnow.type === 'Banner'" />
    <FunCatalog v-if="formKnow.type === '功能目录'" />
    <InfoContent v-if="formKnow.type === '资讯内容'" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import Banner from './banner.vue';
import FunCatalog from './fun-catalog.vue';
import InfoContent from './info-content.vue';

const formKnow:any = reactive({
    type: 'Banner',
});
const changeRadio = (file: any) => {
  formKnow.type = file
}
</script>

<style lang="less" scoped>
.arco-form{
  .arco-row{
    margin-bottom: 12px;
  }
}
</style>
