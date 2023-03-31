<template>
  <a-config-provider :locale="locale">
    <router-view></router-view>
  </a-config-provider>
</template>

<script lang="ts">
  import { defineComponent, onMounted } from 'vue';
  import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
  import { staticData } from '@/store';
  import { storeToRefs } from 'pinia';
  import useUser from '@/hooks/user';
  // eslint-disable-next-line import/extensions
  // import Web3 from 'web3/dist/web3.min.js'
  
  export default defineComponent({
    setup() {
      const comStore = staticData();
      const { userAddress, chainId } = storeToRefs(comStore);
      const { logout } = useUser();

      onMounted(() => {
        // const web3obj = new Web3((Web3 as any).givenProvider);
        // web3obj.eth.net.getId().then(async (id: any) => {
        //   chainId.value = id
        // })
        // if( localStorage.getItem('address') ){
        //   const { ethereum } = window as any;
        //   if(ethereum){
        //     ethereum.on('accountsChanged', (accounts: any) => {
        //       console.log(accounts[0]); // 一旦切换账号这里就会执行
        //       // localStorage.setItem('address', accounts[0]);
        //       // eslint-disable-next-line prefer-destructuring
        //       // userAddress.value = accounts[0];
        //       logout();
        //     });
  
        //     ethereum.on('chainChanged', (id: string) => {
        //       // console.log(id);
        //       chainId.value = Number(id)
        //     });
        //   }
        // }
      });
      return {
        locale: enUS,
      };
    },
  });
</script>
