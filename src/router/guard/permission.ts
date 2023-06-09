import type { LocationQueryRaw, Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import usePermission from '@/hooks/permission';
import { useUserStore } from '@/store';
import { isLogin, getToken } from '@/utils/auth';
import appRoutes from '../routes';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    const event = ['pointlist','operation'].includes(String(to.name))
    async function crossroads() {
      const Permission = usePermission();
      if (Permission.accessRouter(to)) await next();
      else {
        const destination = Permission.findFirstPermissionRoute(
          appRoutes,
          userStore.permissions[0]
        ) || {
          name: 'notFound',
        };
        await next(destination);
      }
      NProgress.done();
    }
    if (isLogin() && getToken()) {
      if (userStore.permissions[0]) {
        crossroads();
      } else {
        try {
          if( to.name === 'login' ){
            next();
            NProgress.done();
            return;
          }
          await userStore.info();
          crossroads();
        } catch (error) {
          next({
            name: 'login',
            query: {
              redirect: event ? 'Event management' : to.name,
              ...(event ? '' : to.query),
            } as LocationQueryRaw,
          });
          NProgress.done();
        }
      }
    } else {
      if (to.name === 'login') {
        next();
        NProgress.done();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: event ? 'Event management' : to.name,
          ...(event ? '' : to.query),
        } as LocationQueryRaw,
      });
      NProgress.done();
    }
  });
}
