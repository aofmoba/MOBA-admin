export default {
  path: 'newpoint',
  name: 'newpoint',
  component: () => import('@/views/newmatchpoint/index.vue'),
  meta: {
    requiresAuth: false,
    hideChildrenInMenu: true,
  },
}