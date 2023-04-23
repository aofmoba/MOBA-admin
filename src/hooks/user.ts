import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { Message } from '@arco-design/web-vue';

export default function useUser() {
  const router = useRouter();
  const userStore = useUserStore();
  const logout = async (logoutTo?: string) => {
    await userStore.logout().catch();
    const currentRoute = router.currentRoute.value;
    if( currentRoute.name === 'operation' ) 
    router.push({
      name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'login',
      query: {
        ...(currentRoute.name === 'operation' ? '' : router.currentRoute.value.query),
        redirect: currentRoute.name === 'operation' ? 'Event management' : currentRoute.name as string,
      },
    });
  };
  return {
    logout,
  };
}
