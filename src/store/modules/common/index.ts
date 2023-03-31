import { defineStore } from 'pinia';

const staticData = defineStore('common', {
  state: () => {
    return {
      isAssetsAllow: false,
      userAddress: '',
      chainId: -1, // chainid
    };
  },

  getters: {},

  actions: {},
});

export default staticData;
