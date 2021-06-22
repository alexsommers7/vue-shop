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
        <p class="cart__total">${{ total | formatPrice }}</p>
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
                  type="text"
                  :value="cartItem.quantity || '1'"
                  class="quantity__value"
                  @change="onAdjustQuantity"
                  onkeydown="return false;"
                  tabindex="-1"
                />
                <button class="quantity__plus" :data-id="cartItem.id" @click="onAdjustQuantity">+</button>
              </div>
              <button class="cart__remove" :data-id="cartItem.id" @click="onRemoveFromCart">Remove</button>
            </div>
            <div class="columns small-3 large-offset-1 flex-center">
              <p class="cart__price" v-if="cartItem.quantity">
                ${{ (cartItem.price * cartItem.quantity) | formatPrice }}
              </p>
              <p class="cart__price" v-else>${{ cartItem.price | formatPrice }}</p>
              <img :src="cartItem.image" :alt="cartItem.title" />
            </div>
          </li>
        </ul>
        <ul class="cart__dropdown cart__dropdown--empty" v-else-if="showDropdown && itemsInCart.length === 0">
          <li>There are no items in your cart yet. When you add items, you'll see them here.</li>
        </ul>
      </transition>
      <div class="cart__backdrop" v-if="showDropdown" @click="showDropdown = false"></div>
      <transition name="fade" v-if="toastOn">
        <div class="cart-toast">
          <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 426.667 426.667"
            style="enable-background:new 0 0 426.667 426.667;"
            xml:space="preserve"
          >
            <g>
              <g>
                <path
                  d="M421.876,56.307c-6.548-6.78-17.352-6.968-24.132-0.42c-0.142,0.137-0.282,0.277-0.42,0.42L119.257,334.375
                    l-90.334-90.334c-6.78-6.548-17.584-6.36-24.132,0.42c-6.388,6.614-6.388,17.099,0,23.713l102.4,102.4
                    c6.665,6.663,17.468,6.663,24.132,0L421.456,80.44C428.236,73.891,428.424,63.087,421.876,56.307z"
                />
              </g>
            </g>
          </svg>
          <span v-if="!removingFromCart">Item added to cart!</span>
          <span v-else>Item removed from cart</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCart",
  props: {
    cartItems: Array,
    nonUniqueCartItems: Number,
    removingFromCart: Boolean,
    total: Number,
  },
  data() {
    return {
      showDropdown: false,
      toastOn: false,
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
        let that = this;
        this.showDropdown = this.toastOn = true;
        setTimeout(function() {
          that.toastOn = false;
        }, 1000);
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
    formatPrice: (price) => {
      const priceString = price.toString();
      return Number(priceString).toFixed(2);
    },
    truncTitle: (title) => {
      const maxChars = 100;
      return title.length > maxChars ? `${title.substring(0, maxChars)}...` : title;
    },
  },
};
</script>

<style scoped>
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
  transform: translate(-50%, 0);
}

@media screen and (min-width: 56.25em) {
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  .fade-enter-to,
  .fade-leave {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
