<template>
  <article class="product list-item">
    <button :aria-label="`See Details: ${product.name}`" :title="`See Details: ${product.name}`">
      <img
        class="product__img"
        :src="product.image_main"
        :alt="`${product.name}`"
        :data-sku="product.sku"
        @click="updateModal(product)"
        aria-label="Product Details Coming Soon"
        title="Product Details Coming Soon"
      />
    </button>

    <div class="product__data">
      <p class="product__category">{{ product.category.name }}</p>

      <button class="btn--text" aria-label="View item details" title="Product Details Coming Soon">
        <h2
          class="product__name"
          :title="`Product Details Coming Soon | ${product.name}`"
          @click="updateModal(product)"
        >
          {{ truncTitle(product.name) }}
        </h2>
      </button>

      <ReviewSummary :product="product"></ReviewSummary>

      <p class="product__price">
        {{ prettyPriceUS(product.sale_price) }}
      </p>

      <div class="product__btn-wrapper">
        <q-select v-model.number="selectedQty" class="product__qty-select" :options="qtyOptions" outlined dense />

        <q-btn
          class="btn--add-to-cart"
          color="primary"
          size="14px"
          :title="`Add to cart - ${product.name}`"
          @click="onAddToCart(product)"
          unelevated
        >
          Add To Cart
        </q-btn>
      </div>
    </div>
  </article>
</template>

<script>
import ReviewSummary from './ReviewSummary';
import { prettyPriceUS, truncTitle } from '../utils/utilities';

import { mapStores } from 'pinia';
import { useCartStore } from '../stores/cart.js';

export default {
  name: 'ProductCard',
  emits: ['updateModal', 'updateQuantity'],
  data() {
    return {
      selectedQty: 1,
    };
  },
  props: ['product'],
  computed: {
    ...mapStores(useCartStore),
    qtyOptions() {
      return this.cartStore.qtyOptions;
    },
  },
  methods: {
    prettyPriceUS,
    truncTitle,
    updateModal() {
      // param: item
      // this.$emit('updateModal', item);
    },
    updateQuantity(item, quantity) {
      this.$emit('updateQuantity', item, quantity);
    },
    onAddToCart(item) {
      this.cartStore.addToCart(item.sku, this.selectedQty);
      this.selectedQty = 1;
    },
  },
  components: { ReviewSummary },
};
</script>
