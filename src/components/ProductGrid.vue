<template>
  <div>
    <transition-group name="list" tag="div" class="row products text-center" mode="in-out">
      <article
        v-for="product in filteredProductList"
        :key="product.id"
        class="product columns list-item"
        :data-category="product.category"
        :data-price="product.price"
      >
        <a href="#"
          ><img
            class="product__img"
            :src="product.image"
            :alt="product.title"
            :title="`See details - ${product.title}`"
            :data-image="product.image"
            :data-title="product.title"
            :data-price="product.price"
            :data-description="product.description"
            @click="onDetailsSelect"
        /></a>
        <div class="product__data">
          <p class="product__category">{{ product.category }}</p>
          <a href="#">
            <h3
              class="product__name"
              :title="`See details - ${product.title}`"
              :data-image="product.image"
              :data-title="product.title"
              :data-price="product.price"
              :data-description="product.description"
              @click="onDetailsSelect"
            >
              {{ product.title | truncTitle }}
            </h3>
          </a>
          <p class="product__price">${{ product.price | formatPrice }}</p>
          <button
            class="btn columns small-8 btn--primary product__btn product__btn--add-to-cart"
            :title="`Add to cart - ${product.title}`"
            :data-id="product.id"
            @click="onAddToCart"
          >
            Add To Cart
          </button>
          <div class="quantity">
            <button class="quantity__minus" @click="onAdjustQuantity">-</button>
            <input
              type="text"
              value="1"
              class="quantity__value"
              @change="onAdjustQuantity"
              onkeydown="return false;"
              tabindex="-1"
            />
            <button class="quantity__plus" @click="onAdjustQuantity">+</button>
          </div>
        </div>
      </article>
    </transition-group>
    <div class="modal" @click="closeModal">
      <div class="modal__content">
        <button class="modal__close">x</button>
        <div class="modal__description">
          <img class="modal__image" :src="selectedImagePath" />
          <div class="modal__text-content">
            <div class="modal__title__price">
              <p class="modal__title">
                <strong>{{ selectedTitle }}</strong>
              </p>
              <p class="modal__price">${{ selectedPrice | formatPrice }}</p>
            </div>
            <p class="modal__text">{{ selectedDescription }}</p>
          </div>
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
      selectedTitle: "",
      selectedPrice: "",
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
    navHeight() {
      return `${this.renderedNavHeight}px`;
    },
  },
  watch: {
    navHeight: {
      handler: function() {
        const modal = this.$el.querySelector(".modal");
        modal.style.top = this.navHeight;
        modal.style.height = `calc(100% - ${this.navHeight})`;
      },
    },
  },
  props: {
    products: Array,
    selectedCategory: String,
    renderedNavHeight: Number,
  },
  methods: {
    onDetailsSelect(event) {
      event.preventDefault();
      this.selectedImagePath = event.target.dataset.image;
      this.selectedTitle = event.target.dataset.title;
      this.selectedPrice = event.target.dataset.price;
      this.selectedDescription = event.target.dataset.description;
      this.$el.querySelector(".modal").classList.add("active");
    },
    onAddToCart(event) {
      let cartItem = this.products.find((product) => product.id === +event.target.dataset.id);
      let itemQuantity = event.target.parentElement.querySelector(".quantity__value");
      this.$emit("addToCart", cartItem, itemQuantity.value);
      itemQuantity.value = 1; // reset
    },
    onAdjustQuantity(event) {
      if (event.target.classList.contains("quantity__plus")) this.incrementQuantity(event);
      else if (event.target.classList.contains("quantity__minus")) this.decrementQuantity(event);
    },
    incrementQuantity(event) {
      event.target.previousElementSibling.value++;
      event.target.previousElementSibling.previousElementSibling.disabled = false;
    },
    decrementQuantity(event) {
      event.target.nextElementSibling.value--;
      if (event.target.nextElementSibling.value <= 1) {
        event.target.nextElementSibling.value = 1;
        event.target.disabled = true;
      }
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
  filters: {
    formatPrice: (price) => {
      const priceString = price.toString();
      return Number(priceString).toFixed(2);
    },
    truncTitle: (title) => {
      const maxChars = 50;
      return title.length > maxChars ? `${title.substring(0, maxChars)}...` : title;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.detectScroll);
  },
};
</script>

<style lang="scss" scoped>
.list-item,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter-active {
  transition-delay: 0.75s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-move {
  transition: transform 0.5s;
}
</style>
