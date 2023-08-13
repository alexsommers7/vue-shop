import { defineStore } from 'pinia';
import { Loading } from 'quasar';
import { removeObjNull } from '../utils/utilities';

export const useCatalogStore = defineStore('catalog', {
  state: () => {
    return {
      productAPIParams: {
        brand: null,
        best_seller: null,
        price: null,
        availability: null,
        rating: null,
        on_sale: null,
        sort: null,
        limit: 10,
        page: 1,
      },
      filters: [],

      items: [],
      itemsTotal: 0,
      mostExpensiveItemPrice: 0,

      categories: [],

      brands: [],

      sortOptions: [
        { label: 'Price, Low to High', value: 0, query: 'sale_price' },
        { label: 'Highest Rated', value: 1, query: '-reviews_average,-reviews_quantity' },
        { label: 'Most Rated', value: 2, query: '-reviews_quantity' },
        { label: 'Price, High to Low', value: 3, query: '-sale_price' },
      ],

      leftDrawerOpen: false,
    };
  },
  actions: {
    async getProducts() {
      try {
        Loading.show({ delay: 250 });

        // reset pagination
        // this.productAPIParams.page = 1;

        // remove null fields
        this.productAPIParams = removeObjNull(this.productAPIParams);

        const url = `https://storepi.vercel.app/api/v1/products?${this.filters.join('&')}${
          this.filters.length ? '&' : ''
        }${new URLSearchParams(this.productAPIParams)}`;
        const res = await fetch(url);
        const json = await res.json();

        this.items = json.data.map((obj) => ({ ...obj, quantity: 1 }));
        this.itemsTotal = json.total;

        Loading.hide();
      } catch (err) {
        console.error(err);
      }
    },
    getters: {
      getParams: (state) => state.productAPIParams,
    },
    async getCategories() {
      try {
        const res = await fetch('https://storepi.vercel.app/api/v1/categories');
        const json = await res.json();

        // set as object with label & value for use as options prop
        this.categories = json.data.map(({ _id, name }) => {
          return {
            label: name,
            value: `category=${_id}`,
          };
        });
      } catch (err) {
        console.error(err);
      }
    },
    async getBrands() {
      try {
        const res = await fetch('https://storepi.vercel.app/api/v1/brands');
        const json = await res.json();

        // set as object with label & value for use as options prop
        this.brands = json.data.map((brand) => {
          return {
            label: brand,
            value: `brand=${brand.split(' ').join('-')}`,
          };
        });
      } catch (err) {
        console.error(err);
      }
    },
    async getMostExpensiveProduct() {
      try {
        const res = await fetch(
          'https://storepi.vercel.app/api/v1/products?sort=-sale_price&limit=1'
        );
        const json = await res.json();

        this.mostExpensiveItemPrice = json.data[0].sale_price;
        return json.data[0].sale_price;
      } catch (err) {
        console.error(err);
      }
    },
    clearFilters() {
      this.filters = [];
      this.getProducts();
    },
    setSort(val) {
      this.resetPagination();
      this.productAPIParams.sort = this.sortOptions.find((op) => op.value === val).query;
      this.getProducts();
    },
    resetPagination() {
      this.productAPIParams.page = 1;
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
  },
});
