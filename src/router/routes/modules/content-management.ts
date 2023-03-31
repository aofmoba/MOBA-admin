export default {
  path: 'content',
  name: 'Content management',
  component: () => import('@/views/content-management/index.vue'),
  meta: {
    locale: '内容管理',
    icon: 'icon5',
    order: 4,
    // requiresAuth: true,
    hideChildrenInMenu: false,
  },
  children: [{
    path: 'banner',
    name: 'banner',
    component: () => import('@/views/content-management/banner/index.vue'),
    meta: {
      locale: 'Banner',
      icon: 'icon-caret-right',
      order: 4-1,
      hideChildrenInMenu: true,
  }},
  {
    path: 'community',
    name: 'community',
    component: () => import('@/views/content-management/community/index.vue'),
    meta: {
      locale: '社区内容',
      icon: 'icon-caret-right',
      order: 4-2,
      hideChildrenInMenu: true,
  }},
  {
    path: 'knowledge',
    name: 'knowledge',
    component: () => import('@/views/content-management/banner/index.vue'),
    meta: {
      locale: '小知识导航内容',
      icon: 'icon-caret-right',
      order: 4-3,
      hideChildrenInMenu: true,
  }},
]
};
