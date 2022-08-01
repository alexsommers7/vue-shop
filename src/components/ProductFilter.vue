<template>
  <q-drawer
    v-model="catalogStore.leftDrawerOpen"
    show-if-above
    no-swipe-open
    no-swipe-close
    no-swipe-backdrop
    bordered
    class="bg-white"
    :width="250"
  >
    <q-scroll-area class="fit">
      <div class="row justify-between items-center q-px-xs">
        <span class="text-h6 q-py-md q-px-sm">Filters</span>
        <q-btn unelevated label="Reset All" class="text-caption text-underline" @click="onFilterReset()"></q-btn>
      </div>

      <q-list padding class="text-grey-8 q-pt-none">
        <q-expansion-item
          class="filter__item"
          header-class="bg-default"
          label="Price"
          :caption="`${prettyPriceUS(price_filter.min)} - ${prettyPriceUS(price_filter.max)}`"
          default-opened
        >
          <q-card>
            <q-range
              class="q-py-lg q-px-md"
              v-model="price_filter"
              @change="$nextTick(() => onRangeFilter('sale_price', 'price_filter'))"
              color="primary"
              label-always
              vertical
              :min="0"
              :max="catalogStore.mostExpensiveItemPrice"
              :step="100"
            />
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          class="filter__item"
          header-class="bg-default"
          label="Average Rating"
          :caption="`${review_filter.min} - ${review_filter.max} Stars`"
          default-opened
        >
          <q-card>
            <q-range
              class="q-py-lg q-px-md"
              v-model="review_filter"
              @change="$nextTick(() => onRangeFilter('reviews_average', 'review_filter'))"
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
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          v-for="filter in filters"
          class="filter__item"
          header-class="bg-default"
          :label="filter.label"
          :caption="getFilterCaption(filter)"
          :key="filter.label"
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
                  @update:model-value="
                    $nextTick(() => {
                      catalogStore.resetPagination();
                      catalogStore.getProducts();
                    })
                  "
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
import { prettyPriceUS } from '../utils/utilities';

export default {
  name: 'ProductFilter',
  data() {
    return {
      filters: [
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
      price_filter: {
        min: 0,
        max: 10000,
      },
    };
  },
  computed: {
    ...mapStores(useCatalogStore),
  },
  methods: {
    prettyPriceUS,
    onRangeFilter(queryName, modelObj) {
      // clear any existing filters of the same type
      this.catalogStore.filters = this.catalogStore.filters.filter((query) => !query.includes(queryName));

      this.catalogStore.filters.push(`${queryName}[gte]=${this[modelObj].min}`);
      this.catalogStore.filters.push(`${queryName}[lte]=${this[modelObj].max}`);
      this.catalogStore.getProducts();
    },
    onFilterReset() {
      this.catalogStore.clearFilters();
      this.review_filter = { min: 0, max: 5 };
      this.price_filter = { min: 0, max: this.catalogStore.mostExpensiveItemPrice };
    },
    getFilterCaption({ options }) {
      return options
        .filter((option) => this.catalogStore.filters.find((query) => query === option.value))
        .map((filter) => filter.label)
        .join(', ');
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

    this.catalogStore.getMostExpensiveProduct().then((maxPrice) => {
      this.price_filter.max = Math.round(100 * maxPrice) / 100;
    });
  },
};
</script>

<style scoped></style>
