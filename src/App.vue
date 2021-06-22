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
    <nav class="row stick align-middle align-justify padTopSides nav full-width">
      <FilterProducts :categories="categories" @filterChange="onFilterChange"></FilterProducts>
      <SortProducts :products="products" @onProductSort="onProductSort"></SortProducts>
      <ProductCart
        :cartItems="cartItems"
        :removingFromCart="removingFromCart"
        :total="total"
        :nonUniqueCartItems="nonUniqueCartItems"
        @onRemoveFromCart="onRemoveFromCart"
        @onCartQuantityChange="onCartQuantityChange"
      ></ProductCart>
      <button class="nav__button" aria-label="navigation" @click="toggleNav">
        <span class="nav__icon">&nbsp;</span>
      </button>
    </nav>
    <div class="nav__backdrop"></div>
    <ProductGrid :products="products" :selectedCategory="selectedCategory" @addToCart="onAddToCart"></ProductGrid>
  </div>
</template>

<script>
import ProductGrid from "./components/ProductGrid";
import FilterProducts from "./components/FilterProducts";
import SortProducts from "./components/SortProducts";
import ProductCart from "./components/ProductCart";

export default {
  name: "App",
  data() {
    return {
      products: [],
      categories: [],
      selectedCategory: "all",
      cartItems: [],
      nonUniqueCartItems: 0,
      removingFromCart: false,
      total: 0,
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
    onAddToCart(cartItem, quantity) {
      this.nonUniqueCartItems += +quantity;
      this.removingFromCart = false; // for toast
      this.total += parseFloat((cartItem.price * quantity).toFixed(2));
      let matchingItems = this.cartItems.filter((item) => item.id === +cartItem.id);
      if (matchingItems.length === 0) {
        cartItem.quantity = quantity;
        this.cartItems.unshift(cartItem);
      } else {
        let index = this.findIndexByID(matchingItems[0].id);
        if (this.cartItems[index].quantity) {
          this.cartItems[index].quantity = +this.cartItems[index].quantity + +quantity;
        } else {
          this.cartItems[index].quantity = +quantity;
        }
        this.reRenderCart();
      }
      this.toggleNav();
    },
    onCartQuantityChange(id, newQuantity) {
      let index = this.findIndexByID(id);
      this.removingFromCart = newQuantity < this.cartItems[index].quantity ? true : false;
      this.cartItems[index].quantity = +newQuantity;
      this.calculateTotal();
      this.calculateNonUniqueItems();
      this.reRenderCart();
    },
    onRemoveFromCart(id) {
      this.removingFromCart = true; // for toast
      let index = this.findIndexByID(id);
      this.cartItems.splice(index, 1);
      this.calculateTotal();
      this.calculateNonUniqueItems();
    },
    findIndexByID(id) {
      return this.cartItems.findIndex((item) => item.id === +id);
    },
    calculateTotal() {
      let total = this.cartItems.reduce((acc, el) => acc + el.price * el.quantity || el.price, 0);
      this.total = parseFloat(total.toFixed(2));
    },
    calculateNonUniqueItems() {
      let items = this.cartItems.reduce((acc, el) => acc + +el.quantity || 1, 0);
      this.nonUniqueCartItems = parseFloat(items);
    },
    reRenderCart() {
      // force re-render by momentarily altering array
      this.cartItems.push("");
      this.cartItems.pop();
    },
    toggleNav() {
      let navWrapper = this.$el.querySelector("nav.nav");
      let navContent = this.$el.querySelectorAll(".nav > *:not(.nav__button)");
      let navButton = this.$el.querySelector(".nav > .nav__button");
      let mobileNavBackdrop = this.$el.querySelector(".nav__backdrop");

      navWrapper.classList.toggle("in");
      navButton.classList.toggle("open");
      navContent.forEach((item) => item.classList.toggle("show"));
      mobileNavBackdrop.addEventListener("click", function() {
        navWrapper.classList.remove("in");
        navButton.classList.remove("open");
        navContent.forEach((item) => item.classList.remove("show"));
      });
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
    ProductCart,
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
