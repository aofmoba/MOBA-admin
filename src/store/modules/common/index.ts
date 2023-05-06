import { defineStore } from 'pinia';

const staticData = defineStore('common', {
  state: () => {
    return {
      userAddress: '',
      chainId: -1, // chainid
    };
  },

  getters: {},

  actions: {},
});

export default staticData;
