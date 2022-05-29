import { defineStore } from 'pinia';
import { useCatalogStore } from '../stores/catalog.js';

export const useCartStore = defineStore('cart', {
  state: () => {
    return {
      cartItems: JSON.parse(localStorage.getItem('cart') || '[]'),
      removingFromCart: false,
      toast: {
        show: false,
        timeoutHide: {},
        timeoutShow: {},
      },
    };
  },
  getters: {
    uniqueCartItems: (state) => new Set(state.cartItems).size,
    nonUniqueCartItems: (state) => parseFloat(state.cartItems.reduce((acc, el) => acc + el.quantity || 1, 0)),
    total: (state) =>
      parseFloat(state.cartItems.reduce((acc, el) => acc + el.sale_price * el.quantity || el.sale_price, 0).toFixed(2)),
  },
  actions: {
    findCatalogItemBySKU(sku) {
      const catalogStore = useCatalogStore();
      return catalogStore.items.find((item) => item.sku == sku);
    },
    findCartItemBySKU(sku) {
      return this.cartItems.find((item) => item.sku == sku);
    },
    addToCart(sku, quantity) {
      const cartItem = JSON.parse(JSON.stringify(this.findCatalogItemBySKU(sku))); // create a local copy
      const matchingItem = this.cartItems.find((item) => item.sku == cartItem.sku);

      if (!matchingItem) {
        cartItem.quantity = quantity;
        this.cartItems.unshift(cartItem);
      } else {
        matchingItem.quantity += quantity;
      }

      this.removingFromCart = false; // context for toast
      this.makeAToast();
      this.updateLocalStorage();
    },
    removeFromCart(sku) {
      const i = this.cartItems.findIndex((item) => item.sku == sku);
      this.cartItems.splice(i, 1);

      this.removingFromCart = true; // context for toast
      this.makeAToast();
      this.updateLocalStorage();
    },
    incrementItemQuantity(sku = 1) {
      this.findCartItemBySKU(sku).quantity++;
    },
    decrementItemQuantity(sku) {
      this.findCartItemBySKU(sku).quantity--;
    },
    makeAToast() {
      if (this.toast.show) {
        this.toast.show = false;
        clearTimeout(this.toast.timeoutHide);
        this.toast.timeoutShow = setTimeout(() => (this.toast.show = true), 500);
      } else {
        clearTimeout(this.toast.timeoutShow);
        this.toast.show = true;
      }

      this.toast.timeoutHide = setTimeout(() => (this.toast.show = false), 4000);
    },
    updateLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    },
  },
});
