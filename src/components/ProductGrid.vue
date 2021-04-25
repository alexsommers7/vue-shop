<template>
  <div class="row products text-center">
    <article
      v-for="product in filteredProductList"
      :key="product.id"
      class="product columns"
      :data-category="product.category"
      :data-price="product.price"
    >
      <a href="#"><img class="product__img" :src="product.image" :alt="product.title"/></a>
      <div class="product__data">
        <p class="product__category">{{ product.category }}</p>
        <a href="#">
          <h3 class="product__name" :title="product.title">{{ product.title | truncTitle }}</h3>
        </a>
        <p class="product__price">${{ product.price | formatPrice }}</p>
        <a
          class="btn btn--primary product__btn"
          href=""
          :title="`See Details - ${product.title}`"
          :data-image="product.image"
          :data-description="product.description"
          @click="onDetailsSelect"
        >
          See Details
        </a>
      </div>
    </article>
    <div class="modal" @click="closeModal">
      <div class="modal__content">
        <button class="modal__close">x</button>
        <div class="modal__description">
          <img class="modal__image" :src="selectedImagePath" />
          <p class="modal__text">{{ selectedDescription }}</p>
        </div>
      </div>
    </div>
    <button v-if="isScrolling" @click="scrollToTop" class="toTop" aria-label="Return to the top of the page">
      <svg class="icon icon-chevron-thin-up">
        <use xlink:href="#icon-chevron-thin-up"></use>
        <symbol id="icon-chevron-thin-up" viewBox="0 0 20 20">
          <path
            d="M2.582 13.891c-0.272 0.268-0.709 0.268-0.979 0s-0.271-0.701 0-0.969l7.908-7.83c0.27-0.268 0.707-0.268 0.979 0l7.908 7.83c0.27 0.268 0.27 0.701 0 0.969s-0.709 0.268-0.978 0l-7.42-7.141-7.418 7.141z"
          ></path>
        </symbol>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: "ProductGrid",
  data() {
    return {
      selectedImagePath: "",
      selectedDescription: "",
      isScrolling: false,
    };
  },
  computed: {
    filteredProductList() {
      if (this.selectedCategory === "all") return this.products;
      const vm = this;
      return this.products.filter((product) => {
        return product.category === vm.selectedCategory;
      });
    },
  },
  props: {
    products: Array,
    selectedCategory: String,
  },
  methods: {
    onDetailsSelect(event) {
      event.preventDefault();
      this.selectedImagePath = event.target.dataset.image;
      this.selectedDescription = event.target.dataset.description;
      this.$el.querySelector(".modal").classList.add("active");
    },
    closeModal(event) {
      if (event.target.classList.contains("modal") || event.target.classList.contains("modal__close")) {
        this.$el.querySelector(".modal").classList.remove("active");
      }
    },
    detectScroll() {
      document.body.scrollTop > 700 || document.documentElement.scrollTop > 700
        ? (this.isScrolling = true)
        : (this.isScrolling = false);
    },
    scrollToTop() {
      document.body.scrollTop = 0; // safari
      document.documentElement.scrollTop = 0; // chrome, firefox, and Opera
    },
  },
  filters: {
    formatPrice: (price) => {
      const priceString = price.toString();
      const decimal = priceString.split(".")[1];
      const length = decimal && decimal.length > 2 ? decimal.length : 2;
      return Number(priceString).toFixed(length);
    },
    truncTitle: (title) => {
      const maxChars = 50;
      return title.length > maxChars ? `${title.substring(0, maxChars)}...` : title;
    },
  },
  mounted() {
    const vm = this;
    window.addEventListener("scroll", vm.detectScroll);
  },
};
</script>

<style lang="scss" scoped></style>
