export default {
  path: 'newcommunity',
  name: 'newcommunity',
  component: () => import('@/views/newcommunity/index.vue'),
  meta: {
    locale: '创建社区内容',
    icon: 'icon2',
    order: 1,
    // requiresAuth: true,
    hideChildrenInMenu: true,
  },
};
