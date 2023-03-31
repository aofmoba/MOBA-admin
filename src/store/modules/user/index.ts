import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  refreshToken as userRefresh,
} from '@/api/user';
import { setToken, clearToken, clearAllLocal } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import axios from 'axios';
import { UserState } from './types';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: undefined,
    avatar: undefined,
    job: undefined,
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: '',
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      // const res = await getUserInfo();
      this.setInfo({});
    },

    // Login
    async login(loginForm: any) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data.accessToken);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

      // refresh
      async refresh() {
        try {
          await userRefresh();
        } catch (err) {
          clearToken();
          throw err;
        }
      },

    // Logout
    async logout() {
      await userLogout();
      this.resetInfo();
      clearAllLocal()
      removeRouteListener();
    },
  },
});

export default useUserStore;
