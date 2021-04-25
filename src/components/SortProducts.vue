<template>
  <div class="shop__sort columns small-12 large-1">
    <p>Sort by:</p>
    <form name="sort__form" action="">
      <select class="sort__select" name="sort__select" @change="onProductSort">
        <option value="" selected="" disabled="" hidden="">Choose here</option>
        <option value="0">Price, Low to High</option>
        <option value="1">Price, High to Low</option>
      </select>
    </form>
  </div>
</template>

<script>
export default {
  name: "SortProducts",
  props: {
    products: Array,
  },
  methods: {
    onProductSort(event) {
      this.$emit("onProductSort", event.target.value);
    },
  },
};
</script>

<style scoped>
.shop__sort {
  width: 13rem;
  max-width: 13rem;
  flex: 0 0 13rem;
}
</style>
