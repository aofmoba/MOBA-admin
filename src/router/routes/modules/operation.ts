export default {
  path: 'operation',
  name: 'operation',
  component: () => import('@/views/point-management/race-operation/index.vue'),
  meta: {
    requiresAuth: true,
    hideChildrenInMenu: true,
    roles: ['*'],
  },
}