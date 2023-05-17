<template>
  <div class="navbar" style="border: none;">
    <div class="left-side">
      <a-space>
        <icon-menu-fold
          v-if="appStore.device === 'mobile'"
          style="font-size: 22px; cursor: pointer; color: var(--color-text-1);"
          @click="toggleDrawerMenu"
        />
      </a-space>
    </div>
    <ul class="right-side">
      <li>
        <div style="font-size: 16px; color: #3A3F63; font-weight: bold;">{{ username }}</div>
        <a-avatar :size="38" :style="{ marginRight: '8px' ,marginLeft: '10px' }">
          <img
            src="//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png"
            alt="avatar"
          />
        </a-avatar>
        <a-dropdown class="exit-doption" trigger="click">
          <icon-down style="font-size: 24px; color: RGBA(100, 116, 254, 1);" />
          <template #content>
            <a-doption style="width: 224px;height: 60px; padding: 20px 30px;line-height: 0;" @click="setApiurl('api')">
              <a-space>
                <span class="mtext-1 font-md" style="margin-left: 2px;">
                  42.*.*.146
                </span>
                <icon-check-circle-fill v-if="apiActive === 'api'" style="color: green;opacity: .6"/>
              </a-space>
            </a-doption>
            <a-doption style="width: 224px;height: 60px; padding: 20px 30px;line-height: 0;" @click="setApiurl('main')">
              <a-space>
                <span class="mtext-1 font-md" style="margin-left: 2px;">
                  <!-- 161.*.*.95 -->
                  81.*.*.152
                </span>
                <icon-check-circle-fill v-if="apiActive === 'main'" style="color: green;opacity: .6"/>
              </a-space>
            </a-doption>
            <!-- <a-doption style="width: 224px;height: 60px; padding: 20px 30px;line-height: 0;" @click="setApiurl('han')">
              <a-space>
                <span class="mtext-1 font-md" style="margin-left: 2px;">
                  192.*.*.13
                </span>
                <icon-check-circle-fill v-if="apiActive === 'han'" style="color: green;opacity: .6"/>
              </a-space>
            </a-doption> -->
            <a-doption style="width: 224px;height: 60px; padding: 20px 30px;line-height: 0;" @click="handleLogout">
              <a-space>
                <img style="width: 22px;height: 22px;" src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/exit.svg" alt="">
                <span class="mtext-1 font-md" style="margin-left: 2px;">
                  退出登录
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, inject, onMounted, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useDark, useToggle } from '@vueuse/core';
  import { useAppStore, useUserStore } from '@/store';
  import { LOCALE_OPTIONS } from '@/locale';
  import useLocale from '@/hooks/locale';
  import useUser from '@/hooks/user';
  import { useRouter } from 'vue-router';
  // import MessageBox from '../message-box/index.vue';

  export default defineComponent({
    components: {
      // MessageBox,
    },
    setup() {
      const appStore = useAppStore();
      const userStore = useUserStore();
      const router = useRouter()
      const { logout } = useUser();
      const { changeLocale } = useLocale();
      const locales = [...LOCALE_OPTIONS];
      const avatar = computed(() =>  userStore );
      const username = computed(() => userStore.$state.username );
      const theme = computed(() => appStore.theme );
      const apiActive = computed(() => localStorage.getItem('mobaapiurl'));
      const isDark: any = useDark({
        selector: 'body',
        attribute: 'arco-theme',
        valueDark: 'dark',
        valueLight: 'light',
        storageKey: 'arco-theme',
        onChanged: (dark: any) => {
          // overridded default behavior
          appStore.toggleTheme(dark);
        },
      });
      const toggleTheme: any = useToggle(isDark);
      const setVisible = () => {
        appStore.updateSettings({ globalSettings: true });
      };
      const refBtn = ref();
      const triggerBtn = ref();
      const setPopoverVisible = () => {
        const event = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        refBtn.value.dispatchEvent(event);
      };
      const handleLogout = () => {
          logout();
      };
      const setApiurl = (url: string) => {
        (window as any).mobaapiurl = url
        localStorage.setItem('mobaapiurl',url)
        logout()
      };
      const setDropDownVisible = () => {
        const event = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        triggerBtn.value.dispatchEvent(event);
      };
      const switchRoles = async () => {
        const res = await userStore.switchRoles();
        Message.success(res as string);
      };
      const toggleDrawerMenu = inject('toggleDrawerMenu');
      onMounted(()=>{
        if( localStorage.getItem('mobaapiurl') === 'null' ){
          (window as any).mobaapiurl = 'api'
          localStorage.setItem('mobaapiurl','api')
        }
      })
      return {
        apiActive,
        appStore,
        locales,
        theme,
        avatar,
        username,
        changeLocale,
        toggleTheme,
        setVisible,
        setPopoverVisible,
        refBtn,
        triggerBtn,
        handleLogout,
        setApiurl,
        setDropDownVisible,
        switchRoles,
        toggleDrawerMenu,
      };
    },
  });
</script>

<style lang="less" scoped>
  
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-1);
    border-bottom: 1px solid var(--color-border);
  }

  .left-side {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
  
  .right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;
    :deep(.locale-select) {
      border-radius: 20px;
    }

    li {
      display: flex;
      align-items: center;
    }

    a {
      color: var(--color-text-1);
      text-decoration: none;
    }

    .nav-btn {
      color: rgb(var(--gray-8));
      font-size: 16px;
      border-color: rgb(var(--gray-2));
    }

    .trigger-btn,
    .ref-btn {
      position: absolute;
      bottom: 14px;
    }

    .trigger-btn {
      margin-left: 14px;
    }
  }
</style>

<style lang="less">
  .message-popover {
    .arco-popover-content {
      margin-top: 0;
    }
  }
  .exit-doption.arco-trigger-popup{
    z-index: 1 !important;
    position: fixed;
    top: 69px !important;
    left: auto !important;
    right: 20px !important;
    .arco-dropdown{
      padding: 0;
      border: none;
      box-shadow: 0px 4px 16px 0px rgba(179,192,231,0.32);
    }
    .arco-dropdown-list-wrapper{
      max-height: 400px !important;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-xs) {
    .navbar {
      .arco-typography {
        display: none;
      }
    }
  }
</style>
