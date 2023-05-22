export default {
    path: 'flag',
    name: 'flag',
    component: () => import('@/views/review-management/flag/index.vue'),
    meta: {
      locale: '夺旗赛',
      icon: 'icon11',
      order: 13,
      requiresAuth: true,
      hideChildrenInMenu: true,
      roles: ['admin','*'],
    },
  };
  
  