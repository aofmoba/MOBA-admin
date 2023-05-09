import { defineStore } from 'pinia';

const staticData = defineStore('common', {
  state: () => {
    return {
      userAddress: '',
      chainId: -1, // chainid
      currentStep: Number(localStorage.getItem('currentStep')) || 1
    };
  },

  getters: {},

  actions: {},
});

export default staticData;
