<template>
  <div class="columns small-6 large-1 nav__sort">
    <p>Sort by:</p>
    <form name="sort__form" action="">
      <select class="sort__select" name="sort__select" @change="onProductSort" aria-label="Sort Products">
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

<style scoped></style>
