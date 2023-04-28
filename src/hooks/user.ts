import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { Message } from '@arco-design/web-vue';

export default function useUser() {
  const router = useRouter();
  const userStore = useUserStore();
  const logout = async (logoutTo?: string) => {
    await userStore.logout().catch();
    const currentRoute = router.currentRoute.value;
    const event = ['pointlist','operation'].includes(String(currentRoute.name))
    router.push({
      name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'login',
      query: {
        ...(event ? '' : router.currentRoute.value.query),
        redirect: event ? 'Event management' : currentRoute.name as string,
      },
    });
  };
  return {
    logout,
  };
}