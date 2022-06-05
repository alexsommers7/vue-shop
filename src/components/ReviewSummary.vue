<template>
  <div
    class="product__review-summary"
    :aria-label="`${product.reviews_quantity} users rated this product ${product.reviews_average} stars out of 5`"
    :title="`${product.reviews_average} stars | ${product.reviews_quantity} reviews`"
  >
    <div class="stars">
      <q-icon name="star" size="1.25rem" />
      <q-icon name="star" size="1.25rem" />
      <q-icon name="star" size="1.25rem" />
      <q-icon name="star" size="1.25rem" />
      <q-icon name="star" size="1.25rem" />
      <div class="cover" :style="{ width: `${100 - (product.reviews_average / 5) * 100}%` }"></div>
    </div>

    <span class="count q-ml-sm">{{ product.reviews_quantity || 'No Reviews Yet' }}</span>
    <button aria-label="Review breakdown" @click="getProductReviews" class="q-pl-none">
      <q-icon name="expand_more" color="dark" />

      <q-menu class="review__breakdown" anchor="bottom left" :offset="[100, 5]">
        <div class="column q-pa-md" v-if="loading">
          <q-skeleton type="rect" class="q-mt-sm" height="20px" />
          <q-skeleton type="rect" class="q-mt-sm q-mb-sm" height="10px" />

          <q-separator class="q-mt-xs q-mb-xs" />

          <div class="q-mt-sm">
            <q-skeleton type="rect" class="q-mt-sm" height="10px" />
            <q-skeleton type="rect" class="q-mt-sm" height="10px" width="80%" />
            <q-skeleton type="rect" class="q-mt-sm" height="10px" width="60%" />
            <q-skeleton type="rect" class="q-mt-sm" height="10px" width="40%" />
            <q-skeleton type="rect" class="q-mt-sm" height="10px" width="20%" />
          </div>
        </div>

        <div class="column q-pa-md" v-else>
          <p class="text-h6">
            <strong class="text-primary">{{ product.reviews_average }}</strong> out of
            <strong class="text-primary">5</strong> stars
          </p>

          <p class="font-muted q-pb-xs">
            {{ product.reviews_quantity }} {{ product.reviews_quantity === 1 ? 'Review' : 'Reviews' }}
          </p>

          <q-separator class="q-mt-xs q-mb-xs" />

          <div class="row no-wrap items-center q-mt-sm" v-for="rating in [5, 4, 3, 2, 1]" :key="rating">
            <q-icon
              :name="rating >= star ? 'star' : 'star_border'"
              size="1rem"
              v-for="star in [1, 2, 3, 4, 5]"
              :key="star"
            />

            <q-linear-progress :value="reviewBreakdown[rating] / product.reviews_quantity" class="q-ml-sm" />

            <span class="q-ml-sm percentage"
              >{{ ((reviewBreakdown[rating] / product.reviews_quantity) * 100).toFixed(0) }}%</span
            >
          </div>
        </div>
      </q-menu>
    </button>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useCatalogStore } from '../stores/catalog.js';

export default {
  computed: {
    ...mapStores(useCatalogStore),
  },
  data() {
    return {
      loading: true,
      reviews: [],
      reviewBreakdown: {},
    };
  },
  props: ['product'],
  methods: {
    async getProductReviews() {
      const res = await fetch(`https://storepi.herokuapp.com/api/v1/products/${this.product.id}/reviews`);
      const json = await res.json();

      this.reviewBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      json.data
        .map((review) => review.rating)
        .forEach(
          (rating) =>
            (this.reviewBreakdown[rating] = this.reviewBreakdown[rating] ? this.reviewBreakdown[rating] + 1 : 1)
        );

      this.loading = false;
    },
  },
};
</script>
