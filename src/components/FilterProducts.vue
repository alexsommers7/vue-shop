<template>
  <div class="nav__filter">
    <ul class="row filter__categories">
      <li class="filter__category">
        <button
          class="btn btn--filter"
          :class="{ 'btn--primary': catalogStore.selectedCategory === 'all' }"
          @click="filter('all')"
        >
          Show All
        </button>
      </li>
      <li class="filter__category" v-for="category in catalogStore.categories" :key="category.name">
        <button
          class="btn btn--filter"
          :class="{ 'btn--primary': catalogStore.selectedCategory === category.name }"
          @click="filter(category.name)"
        >
          {{ category.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useCartStore } from '../stores/cart.js';
import { useCatalogStore } from '../stores/catalog.js';

export default {
  name: 'FilterProducts',
  emits: ['visualReset'],
  computed: {
    ...mapStores(useCartStore, useCatalogStore),
  },
  methods: {
    filter(filterName) {
      this.catalogStore.selectedCategory = filterName;
      this.$emit('visualReset');
    },
  },
};
</script>

<style scoped></style>
