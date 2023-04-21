export default {
  path: 'challenge',
  name: 'challenge management',
  component: () => import('@/views/challenge-management/index.vue'),
  meta: {
    locale: '擂台管理',
    icon: 'icon6',
    order: 5,
    requiresAuth: true,
    hideChildrenInMenu: true,
    roles: ['*'],
  },
};
