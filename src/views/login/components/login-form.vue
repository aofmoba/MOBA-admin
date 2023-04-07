<template>
  <div class="form-group">
    <div class="form-title">MOBA后台管理系统</div>
    <a-form ref="formRef" :model="formLogin" @submit="handleSubmit">
      <a-form-item         
        field="user_name"
        :rules="[{ required: true, message: '用户名不能为空' }]"
        :validate-trigger="['change', 'blur']" 
        label="账号："
      >
        <a-input v-model="formLogin.user_name" placeholder="输入登录密码" />
      </a-form-item>
      <a-form-item 
        field="password" 
        :rules="[{ required: true, message: '密码不能为空' }]"
        :validate-trigger="['change', 'blur']"
        label="密码："
      >
        <a-input-password
            v-model="formLogin.password"
            placeholder="输入登录账号"
            allow-clear
        />
      </a-form-item>
      <a-form-item>
          <a-button class="active large btn-loading" html-type="submit" style="margin-left: 4px;" :disabled="loading"><div><a-spin v-if="loading"></a-spin> 登录</div></a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message, ValidatedError } from '@arco-design/web-vue';
  import { staticData, useUserStore } from '@/store';
  import { storeToRefs } from 'pinia';
  import useLoading from '@/hooks/loading';
  import { LoginData } from '@/api/user';
  import { setTimestamp, clearAllLocal } from '@/utils/auth';

  const userStore = useUserStore();
  const router = useRouter();
  const { loading, setLoading } = useLoading(false);
  const comStore = staticData();
  const { isAssetsAllow } = storeToRefs(comStore);
  const formLogin = reactive({
    user_name: '',
    password: ''
  });

  const handleSubmit = async ({ errors,values}: {
    values: Record<string, LoginData>,
    errors: Record<string, ValidatedError> | undefined
  }) => {
    if (!errors) {
      setLoading(true);
      try {
        await userStore.login(values);
        setTimestamp(new Date().getTime())
        const { redirect } = router.currentRoute.value.query;
        router.push({name: (redirect as string) || 'newmatch'});
        Message.success('success')
        setLoading(false);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };
  onMounted(() => {
    clearAllLocal()
  });
</script>

<style lang="less" scoped>
  .form-group {
    padding: 50px 0;
    text-align: center;
    .form-title {
      height: 56px;
      margin-bottom: 60px;
      font-size: 40px;
      font-weight: bold;
      color: #4458FE;
      line-height: 56px;
      white-space: nowrap;
    }
    :deep(.arco-form){
      .arco-row{
        position: relative;
        flex-wrap: nowrap;
        padding: 0 163px 0 164px 0 !important;
        margin: 0;
        &:nth-child(1){padding-bottom: 30px !important;}
        &:nth-child(2){padding-bottom: 50px !important;}
        .arco-form-item-label-col{
          min-width: 48px !important;
          max-width: 48px !important;
          margin-left: 164px;
          .arco-form-item-label{
            color: #3A3F63;
          }
        }
        .arco-form-item-wrapper-col{
          flex-basis: 355px;
          padding-left: 0;
          margin-left: 10px;
          .arco-input{
            font-size: 16px;
            color: #858EBD;
          }
          .arco-form-item-message{
            position: absolute;
            top: 44px;
          }
          .arco-input-error{
            background: transparent;
            border: 1px solid #DAE0F2;
          }
        }
      }
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-xs) {
    .form-group {
      .form-title {
        font-size: 26px;
      }
      :deep(.arco-form){
        .arco-row{
          .arco-form-item-label-col{
            margin-left: auto;
          }
          .arco-form-item-wrapper-col{
            flex-basis: 250px;
            margin-right: auto;
          }
          &:last-child{
            .arco-form-item-label-col{display: none;}
            .arco-form-item-wrapper-col{ margin: 0 auto; }
          }
        }
      }
    }
  }
</style>