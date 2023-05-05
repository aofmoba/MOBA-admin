export default {
    path: 'championship',
    name: 'championship',
    component: () => import('@/views/review-management/championship/index.vue'),
    meta: {
      locale: '锦标赛',
      icon: 'icon10',
      order: 12,
      requiresAuth: true,
      hideChildrenInMenu: true,
      roles: ['admin'],
    },
  };
  