<template>
  <div class="align-self-start nav__cart cart__wrapper">
    <div class="cart">
      <button
        class="cart__button"
        aria-label="View your cart"
        title="View your cart"
        @click="showDropdown = !showDropdown"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="cart__icon icon-shopping-cart">
          <path class="primary" d="M7 4h14a1 1 0 0 1 .9 1.45l-4 8a1 1 0 0 1-.9.55H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
          <path
            class="secondary"
            d="M17.73 19a2 2 0 1 1-3.46 0H8.73a2 2 0 1 1-3.42-.08A3 3 0 0 1 5 13.17V4H3a1 1 0 1 1 0-2h3a1 1 0 0 1 1 1v10h11a1 1 0 0 1 0 2H6a1 1 0 0 0 0 2h12a1 1 0 0 1 0 2h-.27z"
          />
        </svg>
        <span class="cart__counter">{{ cartStore.nonUniqueCartItems }}</span>
        <p class="cart__total">{{ prettyPriceUS(cartStore.total) }}</p>
      </button>

      <transition name="fade-up">
        <ul class="cart__dropdown" v-if="showDropdown && cartStore.nonUniqueCartItems > 0">
          <li v-for="cartItem in cartStore.cartItems" :key="cartItem.sku" class="row cart__item">
            <div>
              <p :title="cartItem.name">
                {{ truncTitle(cartItem.name) }}
              </p>

              <div class="font-muted">Qty: {{ cartItem.quantity }}</div>

              <button class="cart__remove btn--text" @click="cartStore.removeFromCart(cartItem.sku)">Remove</button>
            </div>

            <div class="flex-center">
              <div class="text-center" v-if="cartItem.quantity > 1">
                <p class="cart__price">
                  <strong>
                    {{ prettyPriceUS(cartItem.sale_price * cartItem.quantity) }}
                  </strong>
                </p>

                <p class="font-muted cart__price--each">{{ prettyPriceUS(cartItem.sale_price) }} ea.</p>
              </div>

              <p class="cart__price" v-else>
                <strong>
                  {{ prettyPriceUS(cartItem.sale_price) }}
                </strong>
              </p>

              <img :src="cartItem.image_main" :alt="cartItem.name" />
            </div>
          </li>
        </ul>
        <ul class="cart__dropdown cart__dropdown--empty" v-else-if="showDropdown && cartStore.nonUniqueCartItems < 1">
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
import { mapStores } from 'pinia';
import { useCartStore } from '../stores/cart.js';
import { useCatalogStore } from '../stores/catalog.js';
import { prettyPriceUS, truncTitle } from '../utils/utilities';

export default {
  name: 'ProductCart',
  props: {
    renderedNavHeight: Number,
  },
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
    ...mapStores(useCartStore, useCatalogStore),
  },
  methods: {
    prettyPriceUS,
    truncTitle,
  },
};
</script>

<style scoped></style>
