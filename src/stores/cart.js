import { defineStore } from 'pinia';
import { useCatalogStore } from '../stores/catalog.js';
import { Notify } from 'quasar';

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
      const cartItem = JSON.parse(JSON.stringify(this.findCatalogItemBySKU(sku))); // local copy
      const matchingItem = this.cartItems.find((item) => item.sku === cartItem.sku);

      if (!matchingItem) {
        cartItem.quantity = quantity;
        this.cartItems.unshift(cartItem);
      } else {
        if (matchingItem.quantity + quantity > 10) return this.onItemMaxReached();
        matchingItem.quantity += quantity;
      }

      Notify.create({
        message: 'Item Added to Cart',
        // actions: [
        //   {
        //     label: 'View Cart',
        //     color: 'white',
        //     handler: () => {
        //       console.log('TODO - show cart');
        //     },
        //   },
        // ],
      });

      this.updateLocalStorage();
    },
    removeFromCart(sku) {
			this.cartItems = this.cartItems.filter(item => item.sku != sku);

      Notify.create({ message: 'Item Removed From Cart' });
      this.updateLocalStorage();
    },
    onItemMaxReached() {
      Notify.create({
        message: 'Max quantity per item is 10',
        type: 'negative',
      });
    },
    updateItemQuantity(sku, quantity) {
      this.findCartItemBySKU(sku).quantity = quantity;
    },
    updateLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    },
  },
});
