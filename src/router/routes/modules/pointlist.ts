export default {
  path: 'pointlist',
  name: 'pointlist',
  component: () => import('@/views/point-management/point-list/index.vue'),
  meta: {
    requiresAuth: true,
    hideChildrenInMenu: true,
    roles: ['*'],
  },
}