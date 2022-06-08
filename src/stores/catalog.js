import { defineStore } from 'pinia';

export const useCatalogStore = defineStore('catalog', {
  state: () => {
    return {
      items: [],
      categories: [],
      selectedCategory: 'all',
      recordCount: 25,
      sortValue: '',
      sortOptions: [
        { label: 'Price, Low to High', value: 0 },
        { label: 'Price, High to Low', value: 1 },
      ],
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
    sortProducts() {
      this.items = this.items.sort((a, b) => {
        return this.sortValue === 0 ? a.sale_price - b.sale_price : b.sale_price - a.sale_price;
      });
    },
    setSort(val) {
      this.sortValue = val;
      this.sortProducts();
    },
    async getProduct() {},
  },
});
