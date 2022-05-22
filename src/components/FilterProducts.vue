<template>
  <div class="nav__filter">
    <ul class="row filter__categories">
      <li class="filter__category">
        <button class="btn btn--filter btn--primary" data-filter="all" @click="filter">
          Show All
        </button>
      </li>
      <li class="filter__category" v-for="category in categories" :key="category.name">
        <button class="btn btn--filter" :data-filter="category.name" @click="filter">{{ category.name }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'FilterProducts',
  props: {
    categories: Array,
  },
  emits: ['filterChange'],
  methods: {
    filter(event) {
      this.$el.querySelector('.btn--primary').classList.remove('btn--primary');
      event.target.classList.add('btn--primary');
      const filter = event.target.dataset.filter;
      this.$emit('filterChange', filter);
    },
  },
};
</script>

<style scoped></style>
