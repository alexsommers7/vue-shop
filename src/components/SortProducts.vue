<template>
  <div class="nav__sort">
    <p>Sort by:</p>
    <form name="sort__form" action="">
      <select
        class="sort__select"
        name="sort__select"
        @change="onProductSort"
        v-model.number="sortValue"
        aria-label="Sort products"
      >
        <option value="" selected="" disabled hidden>Choose here</option>
        <option value="0">Price, Low to High</option>
        <option value="1">Price, High to Low</option>
      </select>
    </form>
  </div>
</template>

<script>
import { mapWritableState, mapActions } from 'pinia';
import { useCatalogStore } from '../stores/catalog.js';

export default {
  name: 'SortProducts',
  emits: ['visualReset'],
  computed: {
    ...mapWritableState(useCatalogStore, ['sortValue']),
  },
  methods: {
    ...mapActions(useCatalogStore, ['sortProducts']),
    onProductSort() {
      this.sortProducts();
      this.$emit('visualReset');
    },
  },
};
</script>

<style scoped></style>
