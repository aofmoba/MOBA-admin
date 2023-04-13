<template>
  <a-config-provider :locale="locale">
    <router-view></router-view>
  </a-config-provider>
</template>

<script lang="ts">
  import { defineComponent, onMounted, watch } from 'vue';
  import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
  import { staticData } from '@/store';
  import { storeToRefs } from 'pinia';
  import useUser from '@/hooks/user';
  import { useRouter, useRoute } from 'vue-router';

  export default defineComponent({
    setup() {
      const route = useRoute();
      const comStore = staticData();
      const { userAddress, chainId } = storeToRefs(comStore);
      const { logout } = useUser();

      watch(()=>route.name,(newV,oldV)=>{
        if( newV !== 'operation' && newV !== undefined ) localStorage.removeItem('currentStep')
      },{immediate:true,deep:true});
      onMounted(() => {});
      return {
        locale: enUS,
      };
    },
  });
</script>
