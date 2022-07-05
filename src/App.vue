<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <LayoutHeader></LayoutHeader>

    <ProductFilter></ProductFilter>

    <q-page-container>
      <!-- <router-view /> -->
      <ProductGrid ref="productGrid"></ProductGrid>
    </q-page-container>

    <q-footer class="q-pa-xs" elevated>
      <p>
        Developed by
        <a href="https://AlexSommers.com" target="_blank">Alex Sommers</a>
        with
        <a href="https://github.com/alexsommers7/StorePI" target="_blank">StorePI</a>
      </p>
    </q-footer>

    <transition v-if="isScrolling" name="fade">
      <button
        aria-label="Return to the top of the page"
        title="Return to the top of the page"
        class="toTop"
        @click="smoothScrollToTop"
      >
        <q-icon name="keyboard_arrow_up" color="white" size="2.5rem" />
      </button>
    </transition>
  </q-layout>
</template>

<script>
import LayoutHeader from './components/LayoutHeader';
import ProductGrid from './components/ProductGrid';
import ProductFilter from './components/ProductFilter';

export default {
  name: 'App',
  data() {
    return {
      isScrolling: false,
      nonUniqueCartItems: 0,
      renderedNavHeight: 0,
      removingFromCart: false,
    };
  },
  methods: {
    onClear() {
      this.exactPhrase = '';
      this.hasWords = '';
      this.excludeWords = '';
    },
    changeDate(option) {
      this.byDate = option;
      this.showDateOptions = false;
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
    window.addEventListener('scroll', this.detectScroll, { passive: true });
  },
  components: {
    LayoutHeader,
    ProductGrid,
    ProductFilter,
  },
};
</script>
