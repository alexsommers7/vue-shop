<template>
  <article class="product list-item">
    <button :aria-label="`See Details: ${product.name}`" :title="`See Details: ${product.name}`">
      <img
        class="product__img"
        :src="product.image_main"
        :alt="`${product.name}`"
        :data-sku="product.sku"
        @click="updateModal(product)"
      />
    </button>

    <div class="product__data">
      <p class="product__category">{{ product.category.name }}</p>

      <button class="btn--text" aria-label="View item details">
        <h2 class="product__name" :title="`See Details: ${product.name}`" @click="updateModal(product)">
          {{ truncTitle(product.name) }}
        </h2>
      </button>

      <ReviewSummary :product="product"></ReviewSummary>

      <p class="product__price">{{ prettyPriceUS(product.sale_price) }}</p>

      <div class="product__btn-wrapper">
        <q-select
          v-model.number="selectedQty"
          class="product__qty-select"
          :options="qtyOptions"
          label="Qty"
          outlined
          dense
        />

        <button
          class="btn btn--primary product__btn product__btn--add-to-cart"
          :title="`Add to cart - ${product.name}`"
          @click="onAddToCart(product)"
        >
          Add To Cart
        </button>
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
      qtyOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      selectedQty: 1,
    };
  },
  props: ['product'],
  computed: {
    ...mapStores(useCartStore),
  },
  methods: {
    prettyPriceUS,
    truncTitle,
    updateModal(item) {
      this.$emit('updateModal', item);
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
