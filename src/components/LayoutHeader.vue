<template>
  <q-header bordered class="bg-white text-grey-8">
    <q-toolbar>
      <q-space />

      <div class="q-gutter-sm row items-center no-wrap q-px-sm">
        <q-btn round dense unelevated color="grey-8" icon="shopping_cart">
          <q-badge color="red" text-color="white" floating>{{
            cartStore.nonUniqueCartItemCount
          }}</q-badge>
          <q-menu style="width: min(400px, 80vw)">
            <q-toolbar
              class="row bg-primary text-white items-start justify-between q-px-md q-py-none"
              style="z-index: 1999"
            >
              <q-toolbar-title class="text-body1"
                >Cart ({{ cartStore.nonUniqueCartItemCount }})</q-toolbar-title
              >
              <q-toolbar-title class="text-right text-body1">{{
                prettyPriceUS(cartStore.total)
              }}</q-toolbar-title>
            </q-toolbar>
            <q-scroll-area
              :style="`height: ${cartStore.uniqueCartItemCount * 83}px; max-height: 300px;`"
              :thumb-style="{ width: '5px' }"
              v-if="cartStore.nonUniqueCartItemCount"
            >
              <q-list separator>
                <q-slide-item
                  v-for="item in cartItems"
                  :key="item.sku"
                  right-color="negative"
                  @right="cartStore.removeFromCart(item.sku)"
                >
                  <template v-slot:right>
                    <q-icon name="delete" />
                  </template>
                  <q-item class="q-py-md q-px-md">
                    <q-item-section thumbnail>
                      <q-avatar square size="45px">
                        <img :src="item.images[0]" alt="" draggable="false" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section class="column q-pr-md">
                      <q-item-label lines="2" :title="item.name">{{ item.name }}</q-item-label>
                      <q-item-label lines="1" class="font-11 font-muted">{{
                        prettyPriceUS(item.sale_price)
                      }}</q-item-label>
                    </q-item-section>

                    <q-select
                      class="product__qty-select"
                      v-model.number="item.quantity"
                      b
                      @update:model-value="cartStore.onQtyUpdated"
                      :options="qtyOptions"
                      outlined
                      dense
                    />

                    <q-btn
                      dense
                      unelevated
                      :ripple="false"
                      icon="delete"
                      aria-label="Remove item from cart"
                      class="btn--remove-from-cart self-center"
                      size="10px"
                      @click="cartStore.removeFromCart(item.sku)"
                    ></q-btn>
                  </q-item>
                </q-slide-item>
              </q-list>
            </q-scroll-area>

            <p class="text-center q-pa-lg" v-else>Your cart is empty</p>
          </q-menu>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
import { mapStores } from 'pinia';
import { useCartStore } from '../stores/cart.js';
import { prettyPriceUS } from '../utils/utilities';

export default {
  name: 'LayoutHeader',
  data() {
    return {
      search: '',
      showAdvanced: false,
      showDateOptions: false,
      exactPhrase: '',
      hasWords: '',
      excludeWords: '',
    };
  },
  computed: {
    ...mapStores(useCartStore),
    qtyOptions() {
      return this.cartStore.qtyOptions;
    },
    cartItems() {
      return this.cartStore.uniqueCartItems;
    },
  },
  methods: {
    prettyPriceUS,
    onClear() {
      this.exactPhrase = '';
      this.hasWords = '';
      this.excludeWords = '';
    },
  },
};
</script>
