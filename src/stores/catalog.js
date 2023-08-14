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
        offset: 0,
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
        // this.productAPIParams.offset = 0;

        // remove null fields
        this.productAPIParams = removeObjNull(this.productAPIParams);

        let cleanFilters = this.filters;

        // check for multiple instances of category_id or brand_id and join duplicates into a single key e.g. category_id=1&category_id=2 => category_id=1,2
        const potentialDuplicates = ['category_id', 'brand_id'];

        potentialDuplicates.forEach((key) => {
          const filterKeys = this.filters.filter((f) => f.startsWith(key));
          if (filterKeys.length > 1) {
            cleanFilters = cleanFilters.filter((f) => !f.startsWith(key));
            cleanFilters.push(`${key}=${filterKeys.map((f) => f.split('=')[1]).join(',')}`);
          }
        });

        const url = `https://storepi.vercel.app/api/v1/products?${cleanFilters.join('&')}${
          cleanFilters.length ? '&' : ''
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
        this.categories = json.data.map(({ id, name }) => {
          return {
            label: name,
            value: `category_id=${id}`,
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
        this.brands = json.data.map(({ id, name }) => {
          return {
            label: name,
            id,
            value: `brand_id=${id}`,
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
      this.productAPIParams.offset = 0;
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
  },
});
