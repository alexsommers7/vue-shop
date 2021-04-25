<template>
  <div class="wrapper loading">
    <div class="loading__content">
      <div class="loading__spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div class="row align-middle align-justify padTopSides">
      <FilterProducts :categories="categories" @filterChange="onFilterChange"></FilterProducts>
      <SortProducts :products="products" @onProductSort="onProductSort"></SortProducts>
    </div>
    <ProductGrid :products="products" :selectedCategory="selectedCategory"> </ProductGrid>
  </div>
</template>

<script>
import ProductGrid from "./components/ProductGrid";
import FilterProducts from "./components/FilterProducts";
import SortProducts from "./components/SortProducts";

export default {
  name: "App",
  data() {
    return {
      products: [],
      categories: [],
      selectedCategory: "all",
    };
  },
  methods: {
    onFilterChange(filter) {
      this.selectedCategory = filter;
    },
    onProductSort(sortValue) {
      this.products =
        +sortValue === 0 // 0 is low-to-high, 1 is high-to-low
          ? this.products.sort((a, b) => a.price - b.price)
          : this.products.sort((a, b) => b.price - a.price);
    },
  },
  created() {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => {
        this.products = json;
        const allCategories = json.map((product) => product.category);
        const categoriesUnique = new Set(allCategories);
        this.categories = Array.from(categoriesUnique);
        this.$el.classList.remove("loading");
      })
      .catch(() =>
        alert("We're sorry, there was an issue with loading product data. Please refresh the page and try again.")
      );
  },
  components: {
    ProductGrid,
    FilterProducts,
    SortProducts,
  },
};
</script>

<style lang="scss">
@import "./scss/main";

// Zurb Foundation overrides
.row {
  max-width: 1920px;
}
a:hover,
a:active,
a:focus {
  color: $color-white;
}
</style>
