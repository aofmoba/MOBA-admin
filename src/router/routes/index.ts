import type { RouteRecordRaw } from 'vue-router';

const modules = import.meta.globEager('./modules/*.ts');
const menutext = import.meta.globEager('./modules/menutext/*.ts');
const appRoutes: RouteRecordRaw[] = [];

const allmodules = { ...modules,...menutext }
Object.keys(allmodules).forEach((key) => {
  const defaultModule = allmodules[key].default;  
  if (!defaultModule) return;
  if ( ['login'].includes( defaultModule.name )) return;
  const moduleList = Array.isArray(defaultModule)
    ? [...defaultModule]
    : [defaultModule];
  appRoutes.push(...moduleList);
});

export default appRoutes;
