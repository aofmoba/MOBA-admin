<script lang="tsx">
  import { compile, computed, defineComponent, h, ref, inject } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    RouteLocationNormalized,
    RouteRecordNormalized,
    RouteRecordRaw,
    useRouter,
  } from 'vue-router';
  import { useAppStore, staticData } from '@/store';
  import usePermission from '@/hooks/permission';
  import { listenerRouteChange } from '@/utils/route-listener';
  import { storeToRefs } from 'pinia'; // 使普通数据变响应式的函数

  export default defineComponent({
    emit: ['collapse'],
    setup() {
      const { t } = useI18n();
      const appStore = useAppStore();
      const comStore = staticData();
      const { isAssetsAllow } = storeToRefs(comStore);
      const permission = usePermission();
      const router = useRouter();
      const toggleDrawerMenu = inject('toggleDrawerMenu');
      const collapsed = computed({
        get() {
          if (appStore.device === 'desktop') return appStore.menuCollapse;
          return false;
        },
        set(value: boolean) {
          appStore.updateSettings({ menuCollapse: value });
        },
      });
      const appRoute = computed(() => {
        return router
          .getRoutes()
          .find((el) => el.name === 'root') as RouteRecordNormalized;
      });
      const menuTree = computed(() => {
        let copyRouter = JSON.parse(JSON.stringify(appRoute.value.children));
        copyRouter = copyRouter.filter((item: any) => !['newpoint','pointlist','operation'].includes(item.name))
        copyRouter.sort(
          (a: RouteRecordNormalized, b: RouteRecordNormalized) => {
            return (
              ((a.meta.order as number) || 0) - ((b.meta.order as number) || 0)
            );
          }
        );

        // 只有可配置的钱包地址可以查看 Assets Overview 页面
        // eslint-disable-next-line no-empty
        // if( isAssetsAllow.value || localStorage.getItem('isAssetsAllow') ){

        // }else{
        //   copyRouter = copyRouter.filter((item: any) => item.name !== 'AssetsOverview')
        // }

        function travel(_routes: RouteRecordRaw[], layer: number) {
          if (!_routes) return null;
          const collector: any = _routes.map((element) => {
            // no access
            if (!permission.accessRouter(element)) {
              return null;
            }

            // leaf node
            if (!element.children) {
              return element;
            }

            // route filter hideInMenu true
            element.children = element.children.filter(
              (x) => x.meta?.hideInMenu !== true
            );

            // Associated child node
            const subItem = travel(element.children, layer);
            if (subItem.length) {
              element.children = subItem;
              return element;
            }
            // the else logic
            if (layer > 1) {
              element.children = subItem;
              return element;
            }

            if (element.meta?.hideInMenu === false) {
              return element;
            }

            return null;
          });
          return collector.filter(Boolean);
        }

        return travel(copyRouter, 0);
      });

      // In this case only two levels of menus are available
      // You can expand as needed

      const selectedKey = ref<string[]>([]);
      const goto = (item: RouteRecordRaw) => {
        router.push({
          name: item.name,
        });
      };
      listenerRouteChange(
        (
          newRoute: RouteLocationNormalized & {
            meta: { hideChildrenInMenu?: boolean };
          }
        ) => {
          if (!newRoute.meta.hideInMenu) {
            if (newRoute.meta.hideChildrenInMenu) {
              selectedKey.value = [newRoute.name as string];
              if( newRoute.name === 'newpoint' ) selectedKey.value = ['newmatch']
              if( ['pointlist','operation'].includes(newRoute.name as string) ) selectedKey.value = ['Event management']
            } else {
              selectedKey.value = [newRoute.matched[2]?.name as string];
            }
          }
        },
        true
      );
      const setCollapse = (val: boolean) => {
        if (appStore.device === 'desktop')
          appStore.updateSettings({ menuCollapse: val });
      };

      const renderSubMenu = () => {
        function travel(_route: RouteRecordRaw[], nodes = []) {
          if (_route) {
            _route.forEach((element) => {
              // This is demo, modify nodes as needed
              const icon = element?.meta?.icon
                ? `<img src="https://moba-project.s3-accelerate.amazonaws.com/admin/${element?.meta?.icon}-a.webp"/>`
                : ``;
              const r = !element?.meta?.hideChildrenInMenu ? (
                <a-sub-menu
                  key={element?.name}
                  v-slots={{
                    icon: () => h(compile(icon)),
                    'expand-icon-down': () => h(compile(`<icon-right />`)),
                    title: () => h(compile(element?.meta?.locale || '')),
                  }}
                >
                  {element?.children?.map((elem) => {
                    return (
                      <a-menu-item
                        key={elem.name}
                        v-slots={{icon: () => h(compile(`<icon-caret-right />`))}}
                        onClick={() => goto(elem)}
                      >
                        {elem?.meta?.locale || ''}
                        {travel(elem.children ?? [])}
                      </a-menu-item>
                    );
                  })}
                </a-sub-menu>
              ) : (
                  <a-menu-item
                    class={[{'menutext':element?.meta?.menutext}]}
                    key={element?.name}
                    v-slots={{
                      icon: () => h(compile(icon)),
                      title: () => h(compile(element?.meta?.locale || '')),
                    }}
                    onClick={() => goto(element)}
                  >
                    {element?.meta?.locale || ''}
                  </a-menu-item>
              );
              nodes.push(r as never);
            });
          }
          return nodes;
        }

        return travel(menuTree.value);
      };
      return () => (
        <a-menu
          v-model:collapsed={collapsed.value}
          show-collapse-button={appStore.device !== 'mobile'}
          auto-open={false}
          selected-keys={selectedKey.value}
          auto-open-selected={true}
          level-indent={34}
          style="height: 100%;background-color:#222653;"
          onCollapse={setCollapse}
          onMenuItemClick={ appStore.device === 'mobile' ? toggleDrawerMenu : ''}
        >
        <a-menu-item key='title' style="margin: 30px 0;padding: 0;font-size: 20px;height: 28px; line-height:28px;font-weight: bold; text-align: center;color: #fff;">MOBA后台管理系统</a-menu-item>
        {renderSubMenu()}
        </a-menu>
      );
    },
  });
</script>

<style lang="less" scoped>
  .mainColor{color: #8DA0C4;}
  .mainColor2{color: #B3C0E7;}
  .graybg{background: rgba(179, 192, 231, .1) !important;}
  :deep(.arco-menu-collapse-button){display: none;}

  :deep(.arco-menu-inner) {
    padding: 0 16px !important;
    &>.arco-menu-item{margin-bottom: 10px;}
    .menutext{
      padding-left: 0 !important;
      height: 20px !important;
      margin-top: 20px;
      margin-bottom: 10px;
      cursor: auto;
      &:hover{
        &:extend(.mainColor);
        background: transparent !important;
      }
      &:extend(.mainColor);
      .arco-menu-icon{display: none;}
      .arco-menu-title{line-height: 20px;}
    }
    .arco-menu-inline-header{margin-bottom: 0;}
    .arco-menu-item, .arco-menu-inline-header{
      height: 44px;
      padding-left: 20px;
      background-color: transparent !important;
      border-radius: 8px;
      &:extend(.mainColor2);
      .arco-menu-icon{
        opacity: .7;
      }
    }

    .arco-icon {
      &:not(.arco-icon-down) {
        font-size: 18px;
      }
    }
    .arco-menu-item:hover,.arco-menu-inline-header:hover{
      &:extend(.mainColor2);
      &:extend(.graybg);
    }
    .arco-menu-item.arco-menu-selected:hover,
    .arco-menu-item.arco-menu-selected,
    .arco-menu-inline-header.arco-menu-selected,
    .arco-menu-inline-header.arco-menu-selected:hover
    {
      color: #fff !important;
      background: linear-gradient(45deg, #4F8AFF 0%, #4B5EFF 100%) !important;
      .arco-menu-icon{opacity: 1;}
      .arco-icon{&:extend(.mainColor2);}
    }
    .arco-menu-inline-content .arco-menu-item{padding-left: 9px;margin-bottom: 0;}
    .arco-menu-inline-content .arco-menu-item.arco-menu-selected,
    .arco-menu-inline-content .arco-menu-item.arco-menu-selected:hover
    {
      &:extend(.graybg);
    }
    .arco-menu-icon{
      display: flex;
      align-content: center;
      width: 20px !important;
      margin-right: 8px !important;
      img{
        width: 100%;
      }
    }
    .arco-menu-icon-suffix.is-open{
      transform: none;
    }
  }
</style>
