<template>
  <div class="fun-catalog">
    <a-form ref="formRef" class="other-form" :model="formKnow" @submit="handleSubmit">
      <a-form-item field="funType" label="功能类型：">
        <Mradio :radioarr="['英雄推荐','文案','图文','动画']" :defaultvalue="formKnow.funType" @change-radio="changeRadio" />
      </a-form-item>
      <a-form-item field="hero" label="英雄头图：">
        <a-select v-model="formKnow.hero.value" :unmount-on-close="true" placeholder="选择英雄" :style="{width:'280px',height: '40px'}">
          <a-option v-for="value,i of formKnow.hero.data" :key="i">{{value}}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        field="heroImg" label="英雄头图："
        :rules="[{ required: true, message:'' }]"
      >
        <div class="flex-col">
          <Mupload :width="120" :height="120" :uwidth="240" :uheight="240" @change-banner="changeBanner" />
          <div class="mt-10 mtext-gray font-sm">尺寸（240*240px），仅限JPG和PNG格式</div>
        </div>
      </a-form-item>
      <a-form-item field="heroUrl" label="英雄路径：">
        <a-space>
          <div class="mr-10 white-nowrap">一级路径 :</div>
          <a-select v-model="level1" :unmount-on-close="true" placeholder="选择路径" :style="{width:'168px',height: '40px'}">
            <a-option v-for="value,i of Object.keys(formKnow.heroUrl)" :key="i">{{value}}</a-option>
          </a-select>
          <div class="mr-10 ml-30 white-nowrap">二级路径 :</div>
          <a-select v-model="level2" :unmount-on-close="true" placeholder="选择路径" :style="{width:'168px',height: '40px'}">
            <a-option v-for="value,i of Object.keys(formKnow.heroUrl[level1])" :key="i">{{value}}</a-option>
          </a-select>
          <div class="mr-10 ml-30 white-nowrap">三级路径 :</div>
          <a-select v-model="level3" :unmount-on-close="true" placeholder="选择路径" :style="{width:'168px',height: '40px'}" :options="formKnow.heroUrl[level1][level2] || []" />
        </a-space>
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
import { useRouter } from 'vue-router';
import { $ref } from 'vue/macros';

const router = useRouter();
const formRef: HTMLFormElement = $ref()
const level1 = ref('首页1');
const level2 = ref('');
const level3 = ref('');
const formKnow:any = reactive({
    type: '功能目录',
    funType: '英雄推荐',
    hero: {
      value: '',
      data: ['英雄1','英雄2']
    },
    heroImg: {},
    heroUrl: {
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
});
watch(level1, () => {
  level2.value = ''
})
watch(level2, () => {
  level3.value = ''
})
const changeRadio = (radio: string) => {
  formKnow.funType = radio
}
const changeBanner = (file: FileItem) => {
  formKnow.heroImg = file
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
  .fun-catalog {
    :deep(.arco-form){
      .arco-row:nth-child(3)>.arco-form-item-label-col{
        margin-top: 9px;
      }
      .arco-select{
        padding: 0 18px 0 20px;
        background: #fff;
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
</style>