<template>
  <q-drawer v-model="catalogStore.leftDrawerOpen" show-if-above bordered class="bg-white" :width="250">
    <q-scroll-area class="fit">
      <q-list padding class="text-grey-8 q-pt-none">
        <q-expansion-item class="filter__item" header-class="bg-default" label="Average Rating" default-opened>
          <q-range
            class="q-py-lg q-px-md"
            v-model="review_filter"
            @change="$nextTick(() => onReviewFilter())"
            color="primary"
            :min="0"
            :max="5"
            :step="0.5"
            marker-labels
            vertical
            dense
            snap
          >
            <template v-slot:marker-label-group="{ markerMap }">
              <div
                class="row items-center no-wrap"
                :class="markerMap[review_filter.min].classes"
                :style="markerMap[review_filter.min].style"
              >
                <q-icon v-if="review_filter.min === 0" size="sm" color="yellow-14" name="star_outline" />

                <template v-else>
                  <q-icon
                    v-for="i in Math.floor(review_filter.min)"
                    :key="i"
                    size="sm"
                    color="yellow-14"
                    name="star_rate"
                  />

                  <q-icon
                    v-if="review_filter.min > Math.floor(review_filter.min)"
                    size="sm"
                    color="yellow-14"
                    name="star_half"
                  />
                </template>
              </div>

              <div
                class="row items-center no-wrap"
                :class="markerMap[review_filter.max].classes"
                :style="markerMap[review_filter.max].style"
              >
                <q-icon
                  v-for="i in Math.floor(review_filter.max)"
                  :key="i"
                  size="sm"
                  color="yellow-14"
                  name="star_rate"
                />

                <q-icon
                  v-if="review_filter.max > Math.floor(review_filter.max)"
                  size="sm"
                  color="yellow-14"
                  name="star_half"
                />
              </div>
            </template>
          </q-range>
        </q-expansion-item>

        <q-expansion-item
          class="filter__item"
          header-class="bg-default"
          :label="filter.label"
          :caption="filter.caption"
          :key="filter.label"
          v-for="filter in filters"
          :default-opened="filter.open"
        >
          <q-card>
            <!-- 40 is height of each item, 32 is sum of vertical padding -->
            <q-scroll-area
              :style="`height: ${filter.options.length * 40 + 32}px; max-height: 180px;`"
              :thumb-style="{ width: '5px' }"
            >
              <q-card-section>
                <q-option-group
                  :options="filter.options"
                  type="checkbox"
                  color="primary"
                  v-model="catalogStore.filters"
                  @update:model-value="$nextTick(() => catalogStore.getProducts())"
                />
              </q-card-section>
            </q-scroll-area>
          </q-card>
        </q-expansion-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { mapStores } from 'pinia';
import { useCatalogStore } from '../stores/catalog.js';

export default {
  name: 'ProductFilter',
  data() {
    return {
      filters: [
        // {
        //   label: 'Price',
        //   caption: '',
        //   options: [
        //     // TODO - range slider
        //     { label: '$50 and under', value: 'sale_price[lte]=50' },
        //     { label: '$100 and under', value: 'sale_price[lte]=100' },
        //     { label: '$1,000 and under', value: 'sale_price[lte]=1000' },
        //   ],
        //   open: true,
        // },
        {
          label: 'Best Seller',
          caption: '',
          options: [{ label: 'Yes', value: 'best_seller=true' }],
          open: false,
        },
        {
          label: 'Availability',
          caption: '',
          options: [{ label: 'In Stock', value: 'in_stock=true' }],
        },
      ],
      review_filter: {
        min: 0,
        max: 5,
      },
    };
  },
  computed: {
    ...mapStores(useCatalogStore),
  },
  methods: {
    onReviewFilter() {
      // clear any existing review filters
      this.catalogStore.filters = this.catalogStore.filters.filter((query) => !query.includes('reviews_average'));

      this.catalogStore.filters.push(`reviews_average[gte]=${this.review_filter.min}`);
      this.catalogStore.filters.push(`reviews_average[lte]=${this.review_filter.max}`);
      this.catalogStore.getProducts();
    },
  },
  mounted() {
    this.catalogStore.getBrands().then(() => {
      this.filters.unshift({
        label: 'Brand',
        caption: '',
        options: [...this.catalogStore.brands],
        open: true,
      });
    });

    this.catalogStore.getCategories().then(() => {
      this.filters.unshift({
        label: 'Category',
        caption: '',
        options: [...this.catalogStore.categories],
        open: true,
      });
    });
  },
};
</script>

<style scoped></style>
