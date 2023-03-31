export default {
  path: 'operation',
  name: 'operation',
  component: () => import('@/views/point-management/race-operation/index.vue'),
  meta: {
    requiresAuth: false,
    hideChildrenInMenu: true,
  },
}