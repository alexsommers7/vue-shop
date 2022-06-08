<template>
  <div class="nav__sort">
    <form name="sort__form" action="">
      <q-select
        v-model.number="val"
        class="product__qty-select"
        :options="sortOptions"
        label="Sort By"
        aria-label="Sort products"
        emit-value
        map-options
        outlined
        dense
      />
    </form>
  </div>
</template>

<script>
import { mapWritableState, mapActions } from 'pinia';
import { useCatalogStore } from '../stores/catalog.js';

export default {
  name: 'ProductSort',
  emits: ['visualReset'],
  data() {
    return {
      val: '',
    };
  },
  computed: {
    ...mapWritableState(useCatalogStore, ['sortOptions']),
  },
  methods: {
    ...mapActions(useCatalogStore, ['setSort']),
  },
  watch: {
    val() {
      this.setSort(this.val);
      this.$emit('visualReset');
    },
  },
};
</script>

<style scoped></style>
