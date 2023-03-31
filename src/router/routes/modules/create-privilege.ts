export default {
  path: 'create',
  name: 'create privilege',
  component: () => import('@/views/create-privilege/index.vue'),
  meta: {
    locale: '创建权限',
    icon: 'icon7',
    order: 6,
    // requiresAuth: true,
    hideChildrenInMenu: true,
  },
};
