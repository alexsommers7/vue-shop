/* eslint-disable vue/no-v-for-template-key */
<template>
  <section>
    <div>
      <div class="row products text-center">
        <div class="products__controls">
          <q-btn
            flat
            color="primary"
            icon="filter_alt"
            class="filter q-mr-sm"
            aria-label="Toggle filter sidebar"
            title="Toggle filter sidebar"
            @click="catalogStore.toggleLeftDrawer"
          />
          <ProductSort></ProductSort>
        </div>

        <ProductCard
          v-for="product in productsLocal"
          :product="product"
          :key="product.sku"
          @updateModal="updateModal"
          @updateQuantity="updateQuantity"
        ></ProductCard>
      </div>

      <div class="row justify-center q-mx-auto q-pt-sm q-pb-lg" v-if="productsLocal.length">
        <q-pagination
          v-model="currentPage"
          color="primary"
          :max="Math.ceil(catalogStore.itemsTotal / catalogStore.productAPIParams.limit)"
          :max-pages="4"
          boundary-numbers
        />
      </div>

      <div class="column items-center font-muted q-mt-xl q-pt-xl products-empty" v-else>
        <q-icon name="search" color="background" size="2.5rem" />
        <p class="color-background text-h6">No Products Found</p>
      </div>

      <transition name="fade-scale" mode="out-in">
        <Modal :modalData="modalData"></Modal>
      </transition>
    </div>
  </section>
</template>

<script>
import ProductSort from './ProductSort';
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
      currentPage: 1,
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
  },
  watch: {
    currentPage: {
      handler: function () {
        this.catalogStore.paginate(this.currentPage);
      },
    },
  },
  methods: {
    prettyPriceUS,
    truncTitle,
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
    this.catalogStore.getProducts();
  },
  components: {
    ProductSort,
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
