<template>
  <section>
    <h1 class="screen-reader-only">Shop Products</h1>
    <transition-group name="list" tag="div" class="row products text-center" mode="out-in">
      <article
        v-for="product in filteredProductList"
        :key="product.sku"
        class="product list-item"
        :data-category="product.category.name"
        :data-price="product.sale_price"
      >
        <button :aria-label="`See Details: ${product.name}`" :title="`See Details: ${product.name}`">
          <img
            class="product__img"
            :src="product.image_main"
            :alt="`${product.name}`"
            :data-sku="product.sku"
            @click="updateModal(product)"
          />
        </button>
        <div class="product__data">
          <p class="product__category">{{ product.category.name }}</p>
          <button class="btn--text" aria-label="View item details">
            <h2 class="product__name" :title="`See Details: ${product.name}`" @click="updateModal(product)">
              {{ truncTitle(product.name) }}
            </h2>
          </button>
          <p class="product__price">{{ prettyPriceUS(product.sale_price) }}</p>
          <div class="quantity">
            <label :for="product.sku" class="screen-reader-only">Quantity</label>
            <button class="quantity__minus" @click="product.quantity > 1 && product.quantity--">-</button>
            <input
              type="number"
              min="1"
              class="quantity__value"
              :id="product.sku"
              :disabled="typeof product.quantity === 'Number' && product.quantity < 1"
              v-model.number="product.quantity"
              @change="product.quantity = typeof product.quantity === 'String' ? 1 : product.quantity"
            />
            <button class="quantity__plus" @click="product.quantity++">+</button>
          </div>
          <div class="product__btn-wrapper">
            <button
              class="btn btn--primary product__btn product__btn--add-to-cart"
              :title="`Add to cart - ${product.name}`"
              @click="onAddToCart(product)"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </article>
    </transition-group>
    <transition name="fade-scale" mode="out-in">
      <Modal :modalData="modalData"></Modal>
    </transition>

    <transition v-if="isScrolling" name="fade">
      <button
        aria-label="Return to the top of the page"
        title="Return to the top of the page"
        class="toTop"
        @click="scrollToTop"
      >
        <svg class="icon icon-chevron-thin-up">
          <use xlink:href="#icon-chevron-thin-up"></use>
          <symbol id="icon-chevron-thin-up" viewBox="0 0 20 20">
            <path
              d="M2.582 13.891c-0.272 0.268-0.709 0.268-0.979 0s-0.271-0.701 0-0.969l7.908-7.83c0.27-0.268 0.707-0.268 0.979 0l7.908 7.83c0.27 0.268 0.27 0.701 0 0.969s-0.709 0.268-0.978 0l-7.42-7.141-7.418 7.141z"
            ></path>
          </symbol>
        </svg>
      </button>
    </transition>
  </section>
</template>

<script>
import Modal from './ProductModal';
import { prettyPriceUS, truncTitle } from '../utils/utilities';
import { mapStores } from 'pinia';
import { useCartStore } from '../stores/cart.js';
import { useCatalogStore } from '../stores/catalog.js';

export default {
  name: 'ProductGrid',
  data() {
    return {
      modalData: {
        openTriggered: false,
        selectedImagePath: '',
        selectedImageAlt: '',
        selectedTitle: '',
        selectedPrice: '',
        selectedDescription: '',
      },
      isScrolling: false,
    };
  },
  computed: {
    ...mapStores(useCartStore, useCatalogStore),
    productsLocal() {
      return [...this.catalogStore.items];
    },
    filteredProductList() {
      return this.catalogStore.selectedCategory === 'all'
        ? this.productsLocal
        : this.productsLocal.filter((product) => product.category.name === this.catalogStore.selectedCategory);
    },
    navHeight() {
      return `${this.renderedNavHeight}px`;
    },
  },
  watch: {
    navHeight: {
      handler: function () {
        const modal = this.$el.querySelector('.modal');
        modal.style.top = this.navHeight;
        modal.style.height = `calc(100% - ${this.navHeight})`;
      },
    },
  },
  props: {
    renderedNavHeight: Number,
  },
  methods: {
    prettyPriceUS,
    truncTitle,
    findItemBySKU(sku) {
      return this.filteredProductList.find((item) => item.sku == sku);
    },
    updateModal(item) {
      this.modalData = {}; // reset in case same item is clicked on
      this.modalData.selectedImagePath = item.image_main;
      this.modalData.selectedImageAlt = `Image of ${item.name}`;
      this.modalData.selectedTitle = item.name;
      this.modalData.selectedPrice = item.sale_price;
      this.modalData.selectedDescription = item.description;
      this.modalData.openTriggered = true;
    },
    onAddToCart(item) {
      this.cartStore.addToCart(item.sku, item.quantity);
      item.quantity = 1; // reset
    },
    detectScroll() {
      document.body.scrollTop > 700 || document.documentElement.scrollTop > 700
        ? (this.isScrolling = true)
        : (this.isScrolling = false);
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  mounted() {
    window.addEventListener('scroll', this.detectScroll, { passive: true });
    let scrollbarWidth = window.innerWidth - document.body.clientWidth + 'px';
    document.documentElement.style.setProperty('--scrollbarWidth', scrollbarWidth);
  },
  components: {
    Modal,
  },
};
</script>

<style scoped>
.list-item,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter-active {
  transition-delay: 0.75s;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-move {
  transition: transform 0.5s;
}
</style>
