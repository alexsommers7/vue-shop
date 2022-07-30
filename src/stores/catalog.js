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
  getters: {
    productFilters: (state) => [...state.filters],
  },
  actions: {
    async getProducts() {
      try {
        Loading.show({ delay: 250 });

        // reset pagination
        this.productAPIParams.page = 1;

        // remove null fields
        this.productAPIParams = removeObjNull(this.productAPIParams);

        const url = `https://storepi.herokuapp.com/api/v1/products?${this.filters.join('&')}${
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
    async getCategories() {
      try {
        const res = await fetch('https://storepi.herokuapp.com/api/v1/categories');
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
        const res = await fetch('https://storepi.herokuapp.com/api/v1/brands');
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
    setSort(val) {
      this.productAPIParams.sort = this.sortOptions.find((op) => op.value === val).query;
      this.productAPIParams.page = 1;
      this.getProducts();
    },
    paginate(val) {
      this.productAPIParams.page = val;
      this.getProducts();
    },
    async getProduct() {},
  },
});
