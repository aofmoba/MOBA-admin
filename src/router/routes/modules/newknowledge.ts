export default {
  path: 'newknowledge',
  name: 'newknowledge',
  component: () => import('@/views/newknowledge/index.vue'),
  meta: {
    locale: '创建小知识内容',
    icon: 'icon3',
    order: 2,
    // requiresAuth: true,
    hideChildrenInMenu: true,
  },
};
