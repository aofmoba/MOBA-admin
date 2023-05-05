export default {
  path: 'event',
  name: 'Event management',
  component: () => import('@/views/event-management/index.vue'),
  meta: {
    locale: '赛事管理',
    icon: 'icon4',
    order: 5,
    requiresAuth: true,
    hideChildrenInMenu: true,
    roles: ['*'],
  },
};
