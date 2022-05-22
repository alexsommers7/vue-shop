<template>
  <div class="align-self-start nav__cart cart__wrapper">
    <div class="cart">
      <button class="cart__button" aria-label="View your cart" title="View your cart" @click="onCartClick">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="cart__icon icon-shopping-cart">
          <path class="primary" d="M7 4h14a1 1 0 0 1 .9 1.45l-4 8a1 1 0 0 1-.9.55H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
          <path
            class="secondary"
            d="M17.73 19a2 2 0 1 1-3.46 0H8.73a2 2 0 1 1-3.42-.08A3 3 0 0 1 5 13.17V4H3a1 1 0 1 1 0-2h3a1 1 0 0 1 1 1v10h11a1 1 0 0 1 0 2H6a1 1 0 0 0 0 2h12a1 1 0 0 1 0 2h-.27z"
          />
        </svg>
        <span class="cart__counter">{{ uniqueCartItems }}</span>
        <p class="cart__total">{{ formatUSPrice(total) }}</p>
      </button>
      <transition name="fade-up">
        <ul class="cart__dropdown" v-if="showDropdown && itemsInCart.length > 0">
          <li v-for="cartItem in itemsInCart" :key="cartItem.sku" class="row cart__item" data-quantity="1">
            <div>
              <p :title="cartItem.name">{{ truncTitle(cartItem.name) }}</p>
              <div class="quantity">
                <button
                  class="quantity__minus"
                  :data-sku="cartItem.sku"
                  @click="onAdjustQuantity"
                  :disabled="cartItem.quantity == 1"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  :data-sku="cartItem.sku"
                  v-model="cartItem.quantity"
                  class="quantity__value"
                  @change="onAdjustQuantity"
                />
                <button class="quantity__plus" :data-sku="cartItem.sku" @click="onAdjustQuantity">+</button>
              </div>
              <button class="cart__remove btn--text" :data-sku="cartItem.sku" @click="onRemoveFromCart">Remove</button>
            </div>
            <div class="flex-center">
              <p class="cart__price" v-if="cartItem.quantity">
                {{ formatUSPrice(cartItem.sale_price * cartItem.quantity) }}
              </p>
              <p class="cart__price" v-else>{{ formatUSPrice(cartItem.sale_price) }}</p>
              <img :src="cartItem.image_main" :alt="cartItem.name" />
            </div>
          </li>
        </ul>
        <ul class="cart__dropdown cart__dropdown--empty" v-else-if="showDropdown && itemsInCart.length === 0">
          <li>There are no items in your cart yet. When you add items, you'll see them here.</li>
        </ul>
      </transition>
      <transition name="fade-backdrop">
        <div
          class="cart__backdrop"
          v-if="showDropdown"
          @click="showDropdown = false"
          :style="{ top: renderedNavHeight + 'px' }"
        ></div>
      </transition>
    </div>
  </div>
</template>

<script>
import { formatUSPrice, truncTitle } from '../utils/filters';

export default {
  name: 'ProductCart',
  props: {
    cartItems: Array,
    uniqueCartItems: Number,
    total: Number,
    renderedNavHeight: Number,
  },
  emits: ['onRemoveFromCart', 'onCartQuantityChange'],
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
    itemsInCart() {
      return this.cartItems;
    },
  },
  watch: {
    itemsInCart: {
      handler: function() {
        if (window.screen.width >= 1200) this.showDropdown = true;
      },
      deep: true,
    },
  },
  methods: {
    formatUSPrice,
    truncTitle,
    onCartClick() {
      this.showDropdown = this.showDropdown === true ? false : true;
    },
    onRemoveFromCart(e) {
      this.$emit('onRemoveFromCart', e.target.dataset.sku);
    },
    onAdjustQuantity(e) {
      if (e.target.classList.contains('quantity__plus')) {
        this.incrementQuantity(e);
        this.$emit('onCartQuantityChange', e.target.dataset.sku, e.target.previousElementSibling.value);
      } else if (e.target.classList.contains('quantity__minus')) {
        this.decrementQuantity(e);
        this.$emit('onCartQuantityChange', e.target.dataset.sku, e.target.nextElementSibling.value);
      } else {
        if (e.target.value > 0) this.$emit('onCartQuantityChange', e.target.dataset.sku, e.target.value);
      }
    },
    incrementQuantity(e) {
      e.target.previousElementSibling.value++;
      e.target.previousElementSibling.previousElementSibling.disabled = false;
    },
    decrementQuantity(e) {
      e.target.nextElementSibling.value--;
      if (e.target.nextElementSibling.value <= 1) e.target.disabled = true;
    },
  },
};
</script>

<style scoped></style>
