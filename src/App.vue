<template>
  <div class="wrapper" :class="{ loading: isLoading }">
    <div class="loading__content">
      <q-spinner color="primary" size="3rem" :thickness="5" />
    </div>

    <nav class="row nav full-width">
      <FilterProducts @visualReset="visualReset"></FilterProducts>

      <SortProducts @visualReset="visualReset"></SortProducts>

      <ProductCart :renderedNavHeight="renderedNavHeight"></ProductCart>

      <button class="nav__button" aria-label="Navigation" @click="toggleNav">
        <span class="nav__icon"></span>
      </button>
    </nav>

    <div class="nav__backdrop"></div>

    <ProductGrid :renderedNavHeight="renderedNavHeight" ref="productGrid"></ProductGrid>

    <transition v-if="isScrolling" name="fade">
      <button
        aria-label="Return to the top of the page"
        title="Return to the top of the page"
        class="toTop"
        @click="smoothScrollToTop"
      >
        <q-icon name="keyboard_arrow_up" color="white" size="2.25rem" />
      </button>
    </transition>

    <div class="ie-message">
      Internet Explore had a good run, but you deserve a better experience.<br /><span
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

import { mapStores } from 'pinia';
import { useCatalogStore } from './stores/catalog.js';
import { useCartStore } from './stores/cart.js';

export default {
  name: 'App',
  data() {
    return {
      isLoading: true,
      isScrolling: false,
      nonUniqueCartItems: 0,
      renderedNavHeight: 0,
      removingFromCart: false,
    };
  },
  computed: {
    ...mapStores(useCatalogStore, useCartStore),
  },
  methods: {
    visualReset() {
      this.toggleNav();
      this.smoothScrollToTop();
    },
    toggleNav() {
      let navWrapper = this.$el.querySelector('nav.nav');
      let mobileNavBackdrop = this.$el.querySelector('.nav__backdrop');
      navWrapper.classList.toggle('in');
      mobileNavBackdrop.addEventListener('click', () => {
        navWrapper.classList.remove('in');
      });

      setTimeout(() => this.checkNavHeight(), 1000);
    },
    checkNavHeight() {
      this.renderedNavHeight = this.$el.querySelector('.nav').getBoundingClientRect().height;
    },
    detectScroll() {
      document.body.scrollTop > 700 || document.documentElement.scrollTop > 700
        ? (this.isScrolling = true)
        : (this.isScrolling = false);
    },
    smoothScrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  mounted() {
    Promise.all([this.catalogStore.getCategories(), this.catalogStore.getProducts()]).then(
      () => (this.isLoading = false)
    );

    this.checkNavHeight();
    window.addEventListener('resize', this.checkNavHeight);
    window.addEventListener('scroll', this.detectScroll, { passive: true });
  },
  components: {
    ProductGrid,
    FilterProducts,
    SortProducts,
    ProductCart,
  },
};
</script>
