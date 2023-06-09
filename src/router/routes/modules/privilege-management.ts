export default {
  path: 'privilege',
  name: 'privilege management',
  component: () => import('@/views/privilege-management/index.vue'),
  meta: {
    locale: '权限管理',
    icon: 'icon8',
    order: 10,
    requiresAuth: true,
    hideChildrenInMenu: true,
    roles: ['admin'],
  },
};
