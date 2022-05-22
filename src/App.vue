<template>
  <div class="wrapper" :class="{ loading: isLoading }">
    <div class="loading__content">
      <div class="loading__spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <nav class="row nav align-middle align-justify full-width">
      <FilterProducts :categories="categories" @filterChange="onFilterChange"></FilterProducts>
      <SortProducts :products="products" @onProductSort="onProductSort"></SortProducts>
      <ProductCart
        :cartItems="cartItems"
        :total="total"
        :uniqueCartItems="uniqueCartItems"
        :renderedNavHeight="renderedNavHeight"
        @onRemoveFromCart="onRemoveFromCart"
        @onCartQuantityChange="onCartQuantityChange"
      ></ProductCart>
      <button class="nav__button" aria-label="Navigation" @click="toggleNav">
        <span class="nav__icon"></span>
      </button>
    </nav>
    <div class="nav__backdrop"></div>
    <ProductGrid
      :products="products"
      :selectedCategory="selectedCategory"
      :renderedNavHeight="renderedNavHeight"
      @addToCart="onAddToCart"
      ref="productGrid"
    ></ProductGrid>
    <Toast :showToast="showToast" :removingFromCart="removingFromCart"></Toast>
    <div class="ie-message">
      Internet Explore had a good run, but it's time to move on.<br /><span
        >This website doesn't work here - try Edge instead!</span
      >
    </div>
  </div>
</template>

<script>
import ProductGrid from './components/ProductGrid';
import FilterProducts from './components/FilterProducts';
import SortProducts from './components/SortProducts';
import ProductCart from './components/ProductCart';
import Toast from './components/CartToast';

export default {
  name: 'App',
  data() {
    return {
      isLoading: true,
      products: [],
      categories: [],
      cartItems: JSON.parse(localStorage.getItem('cart') || '[]'),
      selectedCategory: 'all',
      uniqueCartItems: 0,
      total: 0,
      renderedNavHeight: 0,
      removingFromCart: false,
      showToast: false,
    };
  },
  methods: {
    getCategories() {
      fetch('https://storepi.herokuapp.com/api/v1/categories')
        .then((res) => res.json())
        .then((json) => {
          this.categories = json.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getProducts() {
      fetch('https://storepi.herokuapp.com/api/v1/products?limit=10')
        .then((res) => res.json())
        .then((json) => {
          // add a quantity property to each product
          this.products = json.data.map((obj) => ({ ...obj, quantity: 1 }));
        })
        .catch((err) => {
          console.error(err);
        });
    },
    onFilterChange(filter) {
      this.selectedCategory = filter;
      this.toggleNav();
      this.smoothScrollToTop();
    },
    onProductSort(sortValue) {
      this.products =
        +sortValue === 0 // 0 is low-to-high, 1 is high-to-low
          ? this.products.sort((a, b) => a.sale_price - b.sale_price)
          : this.products.sort((a, b) => b.sale_price - a.sale_price);
      this.toggleNav();
      this.smoothScrollToTop();
    },
    onAddToCart(cartItem, quantity) {
      this.uniqueCartItems += quantity;
      this.removingFromCart = false; // for toast
      this.total += parseFloat((cartItem.sale_price * quantity).toFixed(2));
      let matchingItem = this.cartItems.find((item) => item.sku == cartItem.sku);
      if (!matchingItem) {
        cartItem.quantity = quantity;
        this.cartItems.unshift(cartItem);
      } else {
        let index = this.findIndexBySKU(matchingItem.sku);
        this.cartItems[index].quantity
          ? (this.cartItems[index].quantity = +this.cartItems[index].quantity + quantity)
          : (this.cartItems[index].quantity = quantity);
        this.reRenderCart();
      }
      this.makeAToast();
      this.updateLocalStorage();
    },
    onCartQuantityChange(sku, newQuantity) {
      let index = this.findIndexBySKU(sku);
      this.removingFromCart = newQuantity < this.cartItems[index].quantity ? true : false;
      this.cartItems[index].quantity = +newQuantity;
      this.calculateTotal();
      this.calculateUniqueItems();
      this.reRenderCart();
      this.makeAToast();
      this.updateLocalStorage();
    },
    onRemoveFromCart(sku) {
      this.removingFromCart = true; // for toast
      let index = this.findIndexBySKU(sku);
      this.cartItems.splice(index, 1);
      this.makeAToast();
      this.calculateTotal();
      this.calculateUniqueItems();
      this.updateLocalStorage();
    },
    findIndexBySKU(sku) {
      return this.cartItems.findIndex((item) => item.sku == sku);
    },
    calculateTotal() {
      let total = this.cartItems.reduce((acc, el) => acc + el.sale_price * el.quantity || el.sale_price, 0);
      this.total = parseFloat(total.toFixed(2));
    },
    calculateUniqueItems() {
      let items = this.cartItems.reduce((acc, el) => acc + +el.quantity || 1, 0);
      this.uniqueCartItems = parseFloat(items);
    },
    reRenderCart() {
      // force re-render by momentarily altering array
      // needed for when item is already in cart and just increasing qty
      this.cartItems.push('');
      this.cartItems.pop();
    },
    toggleNav() {
      let navWrapper = this.$el.querySelector('nav.nav');
      let mobileNavBackdrop = this.$el.querySelector('.nav__backdrop');
      navWrapper.classList.toggle('in');
      mobileNavBackdrop.addEventListener('click', function() {
        navWrapper.classList.remove('in');
      });
      let that = this;
      setTimeout(function() {
        that.checkNavHeight();
      }, 1000);
    },
    checkNavHeight() {
      this.renderedNavHeight = this.$el.querySelector('.nav').getBoundingClientRect().height;
    },
    smoothScrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    makeAToast() {
      let that = this;
      this.showToast = true;
      setTimeout(function() {
        that.showToast = false;
      }, 2500);
    },
    updateLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    },
    checkLocalStorage() {
      this.calculateUniqueItems();
      this.calculateTotal();
    },
  },
  created() {
    Promise.all([this.getCategories(), this.getProducts()]).then(() => (this.isLoading = false));
  },
  mounted() {
    this.checkNavHeight();
    window.addEventListener('resize', this.checkNavHeight);
    this.checkLocalStorage();
  },
  components: {
    ProductGrid,
    FilterProducts,
    SortProducts,
    ProductCart,
    Toast,
  },
};
</script>

<style lang="scss">
@import './scss/main';
</style>
