<template>
  <q-drawer v-model="catalogStore.leftDrawerOpen" show-if-above bordered class="bg-white" :width="280">
    <q-scroll-area class="fit">
      <q-list padding class="text-grey-8 q-pt-none">
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
          open: true,
        },
        {
          label: 'Availability',
          caption: '',
          options: [{ label: 'In Stock', value: 'in_stock=true' }],
        },
        // {
        //   label: 'Rating',
        //   caption: '',
        //   options: [
        //     { label: 'Battery too low', value: 'bat' },
        //     { label: 'Friend request', value: 'friend' },
        //     { label: 'Picture uploaded', value: 'upload' },
        //   ],
        // },
      ],
    };
  },
  computed: {
    ...mapStores(useCatalogStore),
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

    this.catalogStore.$subscribe((mutation) => {
      if (mutation.events.key === 'filters') this.catalogStore.getProducts();
    });
  },
};
</script>

<style scoped></style>
