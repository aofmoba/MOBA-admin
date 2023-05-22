export default {
  path: 'newmatch',
  name: 'newmatch',
  component: () => import('@/views/newmatch/index.vue'),
  meta: {
    locale: '创建赛事',
    icon: 'icon1',
    order: 1,
    requiresAuth: true,
    hideChildrenInMenu: true,
    roles: ['*'],
  },
};
