<template>
  <q-select
    v-model.number="val"
    class="sort"
    bg-color="white"
    :options="sortOptions"
    label="Sort By"
    aria-label="Sort products"
    emit-value
    map-options
    outlined
    dense
  />
</template>

<script>
import { useCatalogStore } from '../stores/catalog.js';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'ProductSort',
  data() {
    return {
      val: '',
    };
  },
  computed: {
    ...mapState(useCatalogStore, ['sortOptions']),
  },
  methods: {
    ...mapActions(useCatalogStore, ['setSort']),
  },
  watch: {
    val() {
      this.setSort(this.val);
    },
  },
};
</script>
