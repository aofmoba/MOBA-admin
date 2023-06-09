<template>
  <div class="form-group">
    <div class="form-title">AOF后台管理系统</div>
    <a-tabs default-active-key="1" @change="tabChange">
      <a-tab-pane key="1" title="账号登录">
        <a-form ref="formRef" :model="formLogin" @submit="handleSubmit">
          <a-form-item         
            field="user_name"
            :rules="[{ required: true, message: '账号不能为空' }]"
            :validate-trigger="['change', 'blur']" 
            label="账号："
          >
            <a-input v-model="formLogin.user_name" autofocus placeholder="输入登录账号" />
          </a-form-item>
          <a-form-item 
            field="password" 
            :rules="[{ required: true, message: '密码不能为空' }]"
            :validate-trigger="['change', 'blur']"
            label="密码："
          >
            <a-input-password
                v-model="formLogin.password"
                placeholder="输入登录密码"
                allow-clear
            />
          </a-form-item>
          <a-form-item>
              <a-button class="active large " html-type="submit" style="margin-left: 4px;" :disabled="loading"><div><a-spin v-if="loading"></a-spin> 登录</div></a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" title="钱包登录" :disabled="true">
        <div class="metamask flex-center">
          <img src="https://moba-project.s3-accelerate.amazonaws.com/admin/metamask.jpg" alt="">
          <div>METAMASK</div>
        </div>
        <div class="mobile-w" style="padding-bottom: 50px;">
          <a-button class="active large " style="margin-left: -2px;" :disabled="wloading" @click="connectSubmit"><div><a-spin v-if="wloading"></a-spin> 登录</div></a-button>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message, ValidatedError } from '@arco-design/web-vue';
  import { staticData, useUserStore } from '@/store';
  import { storeToRefs } from 'pinia';
  import useLoading from '@/hooks/loading';
  import { LoginData, getWalletRandom} from '@/api/user';
  import { setTimestamp, clearAllLocal, getAddress } from '@/utils/auth';
  // eslint-disable-next-line import/extensions
  import Web3 from 'web3/dist/web3.min.js'
  import { Sign } from '@/utils/web3/web3'

  const userStore = useUserStore();
  const router = useRouter();
  const { loading, setLoading } = useLoading(false);
  const { loading: wloading, setLoading: setWLoading } = useLoading(false);
  const comStore = staticData();
  const { userAddress } = storeToRefs(comStore);
  const formLogin = reactive({
    user_name: '',
    password: ''
  });

  const tabChange = (key: string | number) => {}

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

  const connectSubmit = async () => {
    // Message.info('Sorry, this feature is still under development...')
    setWLoading(true);
    try {
      const { ethereum } = window as any // 获取小狐狸实例
      if (!ethereum) {
        setWLoading(false);
        Message.info('请安装Metamask，安装完成后，刷新页面即可使用')
      } else {
        const account: any = await getAddress()
        if( account ){
          const result: any = await getWalletRandom(String(account))
          const signature: any = await Sign(result.data,account)
          if( signature ){
            await userStore.walletLogin({address: String(account), signature: String(signature) })
            setTimestamp(new Date().getTime())
            const { redirect } = router.currentRoute.value.query;
            router.push({name: (redirect as string) || 'newmatch'});
            Message.success('success')
            setWLoading(false);
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setWLoading(false);
    }
  };

  onMounted(() => {
    clearAllLocal()
  });
</script>

<style lang="less" scoped>
  .form-group {
    padding-top: 50px;
    text-align: center;
    .form-title {
      height: 56px;
      font-size: 40px;
      font-weight: bold;
      color: #4458FE;
      line-height: 56px;
      white-space: nowrap;
      // margin-bottom: 40px;
    }
    :deep(.arco-form){
      .arco-row{
        position: relative;
        flex-wrap: nowrap;
        padding-bottom: 30px;
        margin: 0;
        &:last-child{padding-bottom: 50px;}
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
  .metamask{
    flex-direction: column;
    width: 110px;
    height: 110px;
    margin: 0 auto 30px;
    border-radius: 4px;
    border: 1px solid #DAE0F2;
    img{
      width: 60px;
    }
    div{
      margin-top: 5px;
      font-size: 16px;
      font-weight: 600;
      color: #3A3F63;
      line-height: 22px;
    }
  }
  :deep(.arco-tabs){
    .arco-tabs-nav{
      height: 110px;
      padding: 30px 0 40px;
      .arco-tabs-nav-tab{
        display: block;
        height: 100%;
        overflow: visible;
        .arco-tabs-nav-tab-list{
          display: flex;
          width: 246px;
          height: 100%;
          margin: 0 auto;
          background: var(--color-bg-1);
          border-radius: 4px;
          border: 1px solid #DAE0F2;
          .arco-tabs-tab{
            flex: 1;
            z-index: 2;
            margin: 0;
            padding: 0;
            font-size: 16px;
            line-height: 22px;
            color: #3A3F63;
            font-weight: 400;
            transition: all .1s ease;
            .arco-tabs-tab-title{
              width: 100%;
              line-height: 40px;
              &::before{display: none;}
            }
            &.arco-tabs-tab-active{
              color: #fff;
              font-weight: bold;
            }
          }
          .arco-tabs-nav-ink{ 
            height: 100%;
            background: #4458FE;
            border-radius: 4px;
            box-shadow: 0px 4px 16px 0px #B3C0E7; }
        }
      }
      &::before{ display: none;}
    } 
    .arco-tabs-content{
      padding: 0;
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
    .mobile-w{
      button{
        width: 246px !important;
        margin-left: 4px !important;
      }
    }
  }
</style>