import { defineStore } from 'pinia';

export const useCatalogStore = defineStore('catalog', {
  state: () => {
    return {
      items: [],
      categories: [],
      selectedCategory: 'all',
      recordCount: 20,
      sortValue: '',
    };
  },
  actions: {
    async getProducts() {
      try {
        const res = await fetch(`https://storepi.herokuapp.com/api/v1/products?limit=${this.recordCount}`);
        const json = await res.json();

        this.items = json.data.map((obj) => ({ ...obj, quantity: 1 }));
      } catch (err) {
        console.error(err);
      }
    },
    async getCategories() {
      try {
        const res = await fetch('https://storepi.herokuapp.com/api/v1/categories');
        const json = await res.json();

        this.categories = json.data;
      } catch (err) {
        console.error(err);
      }
    },
    async getProduct() {},
    sortProducts() {
      this.items = this.items.sort((a, b) => {
        // 0 is low-to-high, 1 is high-to-low
        return this.sortValue === 0 ? a.sale_price - b.sale_price : b.sale_price - a.sale_price;
      });
    },
  },
});
