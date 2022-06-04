import { defineStore } from 'pinia';

export const useSnackbarStore = defineStore('snackbar', {
  state: () => {
    return {
      show: false,
      checkIcon: true,
      message: '',
      timeoutShow: '',
      timeoutHide: '',
    };
  },
  actions: {
    showSnackbar() {
      if (this.show) {
        this.show = false;
        clearTimeout(this.timeoutHide);
        this.timeoutShow = setTimeout(() => (this.show = true), 500);
      } else {
        clearTimeout(this.timeoutShow);
        this.show = true;
      }
    },
  },
});
