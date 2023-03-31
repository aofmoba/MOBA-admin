<template>
  <div class="form-group other-form m-30">
    <a-form ref="formRef" class="other-form" :model="formAdmin" @submit="handleSubmit">
      <a-form-item
          field="uid" label="游戏UID："
          :rules="[{ required: true, message:'UID不能为空' }]"
          :validate-trigger="['blur']"
      >
          <a-input v-model="formAdmin.uid" placeholder="请输入游戏UID" />
      </a-form-item>
      <a-form-item field="status" label="权限身份：">
        <a-space id="selectadmin" style="position: relative;">
          <a-select v-model="formAdmin.status" :popup-container="selectadmin" :unmount-on-close="true" :style="{width:'280px',height: '40px'}">
            <a-option v-for="value,i of ['超级管理员','管理员','地区推广员']" :key="i">{{value}}</a-option>
          </a-select>
        </a-space>
      </a-form-item>
      <a-form-item v-if="formAdmin.status == '地区推广员'" field="area" label="地区：">
        <a-space>
          <a-select v-model="level1" :unmount-on-close="true" placeholder="国家" :style="{width:'168px',height: '40px'}">
              <a-option v-for="value,i of Object.keys(formAdmin.cityName)" :key="i">{{value}}</a-option>
          </a-select>
          <div class="label ml-10 mr-30 white-nowrap">国家</div>
          <a-select v-model="level2" :unmount-on-close="true" placeholder="省份/州" :style="{width:'168px',height: '40px'}">
              <a-option v-for="value,i of Object.keys(formAdmin.cityName[level1])" :key="i">{{value}}</a-option>
          </a-select>
          <div class="label ml-10 mr-30 white-nowrap">省份/州</div>
          <a-select v-model="level3" :unmount-on-close="true" placeholder="城市" :style="{width:'168px',height: '40px'}" :options="formAdmin.cityName[level1][level2] || []" />
          <div class="label ml-10 mr-20 white-nowrap">城市</div>
      </a-space>
      </a-form-item>
      <a-form-item field="usetime" label="权限有效期：">
        <DatePicker @change-date="changeDate"/>
      </a-form-item>
      <a-form-item
          field="remarks" label="权限备注："
          :rules="[{ required: true, message:'' },{maxLength:50,message:'最多可填写50个字'}]"
          :validate-trigger="['blur']"
      >
          <a-input v-model="formAdmin.remarks" placeholder="输入此权限人员的备注（姓名）" />
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
import { onMounted, reactive, ref,watch } from 'vue'
import { ValidatedError } from '@arco-design/web-vue';
import { LoginData } from '@/api/user';

let selectadmin: any = $ref(null)
const level1 = ref('中国');
const level2 = ref('');
const level3 = ref('');
const formAdmin:any = reactive({
  uid: '',
  status: '超级管理员',
  cityName: {
    '中国': {
      'city1': ['place1'],
      'city2': ['place1'],
      'city3': ['place1'],
    },
    '韩国': {
      'city1': ['place1'],
      'city2': ['place1'],
      'city3': ['place1'],
    },
    '巴西': {
      'city1': ['place1'],
      'city2': ['place1'],
      'city3': ['place1'],
    }
  },
  usetime: '',
  remarks: '',
})
watch(level1, () => {level2.value = ''})
watch(level2, () => {level3.value = ''})

const changeDate = (date: Date) => {
  formAdmin.usetime = date
}
const handleSubmit = ({errors, values,}: {
    values: Record<string, LoginData>,
    errors: Record<string, ValidatedError> | undefined
  }) => {
    if( !errors ){
      // console.log('values:', values, '\nerrors:', errors,)
    }
}
onMounted(()=>{
  selectadmin = document.getElementById('selectadmin')
})
</script>

<style lang="less" scoped>
.form-group {
  :deep(.arco-form){
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
#selectadmin{
  :deep(.arco-trigger-popup){
    margin-left: 56px !important;
  }
}
</style>
