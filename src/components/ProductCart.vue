<template>
  <div class="columns small-4 large-1 align-self-start nav__cart cart__wrapper">
    <div class="cart">
      <button class="cart__button" @click="onCartClick">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="cart__icon icon-shopping-cart">
          <path class="primary" d="M7 4h14a1 1 0 0 1 .9 1.45l-4 8a1 1 0 0 1-.9.55H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
          <path
            class="secondary"
            d="M17.73 19a2 2 0 1 1-3.46 0H8.73a2 2 0 1 1-3.42-.08A3 3 0 0 1 5 13.17V4H3a1 1 0 1 1 0-2h3a1 1 0 0 1 1 1v10h11a1 1 0 0 1 0 2H6a1 1 0 0 0 0 2h12a1 1 0 0 1 0 2h-.27z"
          />
        </svg>
        <span class="cart__counter">{{ nonUniqueCartItems }}</span>
        <p class="cart__total">{{ total | formatUSPrice }}</p>
      </button>
      <transition name="fade">
        <ul class="cart__dropdown" v-if="showDropdown && itemsInCart.length > 0">
          <li v-for="cartItem in itemsInCart" :key="cartItem.id" class="row cart__item" data-quantity="1">
            <div class="columns small-8">
              <p :title="cartItem.title">{{ cartItem.title | truncTitle }}</p>
              <div class="quantity">
                <button
                  class="quantity__minus"
                  :data-id="cartItem.id"
                  @click="onAdjustQuantity"
                  :disabled="(cartItem.quantity || '1') == 1"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  :data-id="cartItem.id"
                  :value="cartItem.quantity || '1'"
                  class="quantity__value"
                  @change="onAdjustQuantity"
                />
                <button class="quantity__plus" :data-id="cartItem.id" @click="onAdjustQuantity">+</button>
              </div>
              <button class="cart__remove" :data-id="cartItem.id" @click="onRemoveFromCart">Remove</button>
            </div>
            <div class="columns small-3 large-offset-1 flex-center">
              <p class="cart__price" v-if="cartItem.quantity">
                {{ (cartItem.price * cartItem.quantity) | formatUSPrice }}
              </p>
              <p class="cart__price" v-else>{{ cartItem.price | formatUSPrice }}</p>
              <img :src="cartItem.image" :alt="cartItem.title" />
            </div>
          </li>
        </ul>
        <ul class="cart__dropdown cart__dropdown--empty" v-else-if="showDropdown && itemsInCart.length === 0">
          <li>There are no items in your cart yet. When you add items, you'll see them here.</li>
        </ul>
      </transition>
      <div
        class="cart__backdrop"
        v-if="showDropdown"
        @click="showDropdown = false"
        :style="{ top: renderedNavHeight + 'px' }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCart",
  props: {
    cartItems: Array,
    nonUniqueCartItems: Number,
    total: Number,
    renderedNavHeight: Number,
  },
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
    },
  },
  methods: {
    onCartClick() {
      this.showDropdown === true ? (this.showDropdown = false) : (this.showDropdown = true);
    },
    onRemoveFromCart(event) {
      this.$emit("onRemoveFromCart", event.target.dataset.id);
    },
    onAdjustQuantity(event) {
      if (event.target.classList.contains("quantity__plus")) {
        this.incrementQuantity(event);
        this.$emit("onCartQuantityChange", event.target.dataset.id, event.target.previousElementSibling.value);
      } else if (event.target.classList.contains("quantity__minus")) {
        this.decrementQuantity(event);
        this.$emit("onCartQuantityChange", event.target.dataset.id, event.target.nextElementSibling.value);
      } else {
        if (event.target.value > 0) this.$emit("onCartQuantityChange", event.target.dataset.id, event.target.value);
      }
    },
    incrementQuantity(event) {
      event.target.previousElementSibling.value++;
      event.target.previousElementSibling.previousElementSibling.disabled = false;
    },
    decrementQuantity(event) {
      event.target.nextElementSibling.value--;
      if (event.target.nextElementSibling.value <= 1) event.target.disabled = true;
    },
  },
  filters: {
    formatUSPrice: (price) => {
      const priceString = price.toString();
      const priceRounded = Number(priceString).toFixed(2);
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(priceRounded);
    },
    truncTitle: (title) => {
      const maxChars = 100;
      return title.length > maxChars ? `${title.substring(0, maxChars)}...` : title;
    },
  },
};
</script>

<style scoped></style>
