<template>
  <div class="columns small-11 medium-10 large-8 nav__filter">
    <ul class="row align-middle filter__categories">
      <li class="filter__category">
        <button class="btn btn--filter btn--primary" data-filter="all" @click="filter">
          Show All
        </button>
      </li>
      <li class="filter__category" v-for="category in categories" :key="category">
        <button class="btn btn--filter" :data-filter="category" @click="filter">{{ category }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FilterProducts",
  props: {
    categories: Array,
  },
  methods: {
    filter(event) {
      this.$el.querySelector(".btn--primary").classList.remove("btn--primary");
      event.target.classList.add("btn--primary");
      const filter = event.target.dataset.filter;
      this.$emit("filterChange", filter);
    },
  },
};
</script>

<style lang="scss" scoped>
.shop__categories {
  list-style: none;
  padding: 0 1rem;
}
</style>
