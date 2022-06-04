/* eslint-disable vue/no-v-for-template-key */
<template>
  <section>
    <h1 class="screen-reader-only">Shop Products</h1>

    <transition-group name="list" tag="div" class="row products text-center" mode="out-in">
      <ProductCard
        v-for="product in filteredProductList"
        :product="product"
        :key="product.sku"
        @updateModal="updateModal"
        @updateQuantity="updateQuantity"
      ></ProductCard>
    </transition-group>

    <transition name="fade-scale" mode="out-in">
      <Modal :modalData="modalData"></Modal>
    </transition>
  </section>
</template>

<script>
import Modal from './ProductModal';
import ProductCard from './ProductCard';
import { prettyPriceUS, truncTitle } from '../utils/utilities';
import { mapStores } from 'pinia';
import { useCartStore } from '../stores/cart.js';
import { useCatalogStore } from '../stores/catalog.js';

export default {
  name: 'ProductGrid',
  data() {
    return {
      modalData: {
        openTriggered: false,
        selectedImagePath: '',
        selectedImageAlt: '',
        selectedTitle: '',
        selectedPrice: '',
        selectedDescription: '',
      },
    };
  },
  computed: {
    ...mapStores(useCartStore, useCatalogStore),
    productsLocal() {
      return [...this.catalogStore.items];
    },
    filteredProductList() {
      return this.catalogStore.selectedCategory === 'all'
        ? this.productsLocal
        : this.productsLocal.filter((product) => product.category.name === this.catalogStore.selectedCategory);
    },
    navHeight() {
      return `${this.renderedNavHeight}px`;
    },
  },
  watch: {
    navHeight: {
      handler: function () {
        const modal = this.$el.querySelector('.modal');
        modal.style.top = this.navHeight;
        modal.style.height = `calc(100% - ${this.navHeight})`;
      },
    },
  },
  props: {
    renderedNavHeight: Number,
  },
  methods: {
    prettyPriceUS,
    truncTitle,
    findItemBySKU(sku) {
      return this.filteredProductList.find((item) => item.sku == sku);
    },
    updateModal(item) {
      this.modalData = {}; // reset in case same item is clicked on
      this.modalData.selectedImagePath = item.image_main;
      this.modalData.selectedImageAlt = `Image of ${item.name}`;
      this.modalData.selectedTitle = item.name;
      this.modalData.selectedPrice = item.sale_price;
      this.modalData.selectedDescription = item.description;
      this.modalData.openTriggered = true;
    },
    updateQuantity(item, qty) {
      item.qty = qty;
    },
  },
  mounted() {
    const scrollbarWidth = window.innerWidth - document.body.clientWidth + 'px';
    document.documentElement.style.setProperty('--scrollbarWidth', scrollbarWidth);
  },
  components: {
    Modal,
    ProductCard,
  },
};
</script>

<style scoped>
.list-item,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter-active {
  transition-delay: 0.75s;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-move {
  transition: transform 0.5s;
}
</style>
