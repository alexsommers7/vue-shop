import { defineStore } from 'pinia';
import { useCatalogStore } from '../stores/catalog.js';
import { useSnackbarStore } from '../stores/snackbar.js';

export const useCartStore = defineStore('cart', {
  state: () => {
    return {
      cartItems: JSON.parse(localStorage.getItem('cart') || '[]'),
      removingFromCart: false,
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
      const snackbar = useSnackbarStore();
      const cartItem = JSON.parse(JSON.stringify(this.findCatalogItemBySKU(sku))); // create a local copy
      const matchingItem = this.cartItems.find((item) => item.sku == cartItem.sku);

      if (!matchingItem) {
        cartItem.quantity = quantity;
        this.cartItems.unshift(cartItem);
      } else {
        matchingItem.quantity += quantity;
      }

      snackbar.message = 'Item Added to Cart';
      snackbar.showSnackbar();
      this.updateLocalStorage();
    },
    removeFromCart(sku) {
      const snackbar = useSnackbarStore();
      const i = this.cartItems.findIndex((item) => item.sku == sku);
      this.cartItems.splice(i, 1);

      snackbar.message = 'Item Removed From Cart';
      snackbar.showSnackbar();
      this.updateLocalStorage();
    },
    updateItemQuantity(sku, quantity) {
      this.findCartItemBySKU(sku).quantity = quantity;
    },
    updateLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    },
  },
});
