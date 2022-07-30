<template>
  <q-header bordered class="bg-white text-grey-8">
    <q-toolbar>
      <q-toolbar-title shrink class="row items-center no-wrap">
        <span class="q-ml-sm">Vue Shop</span>
      </q-toolbar-title>

      <q-space />

      <!-- <q-input
          class="GNL__toolbar-input"
          outlined
          dense
          v-model="search"
          color="bg-grey-7 shadow-1"
          placeholder="Search for topics, locations & sources"
        >
          <template v-slot:prepend>
            <q-icon v-if="search === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
          </template>
          <template v-slot:append>
            <q-btn flat dense round aria-label="Menu" icon="arrow_drop_down">
              <q-menu anchor="bottom end" self="top end">
                <div class="q-pa-md" style="width: 400px">
                  <div class="text-body2 text-grey q-mb-md">Narrow your search results</div>

                  <div class="row items-center">
                    <div class="col-3 text-subtitle2 text-grey">Exact phrase</div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="exactPhrase" />
                    </div>

                    <div class="col-3 text-subtitle2 text-grey">Has words</div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="hasWords" />
                    </div>

                    <div class="col-3 text-subtitle2 text-grey">Exclude words</div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="excludeWords" />
                    </div>

                    <div class="col-3 text-subtitle2 text-grey">Website</div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="byWebsite" />
                    </div>

                    <div class="col-12 q-pt-lg row justify-end">
                      <q-btn
                        flat
                        dense
                        no-caps
                        color="grey-7"
                        size="md"
                        style="min-width: 68px"
                        label="Search"
                        v-close-popup
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        color="grey-7"
                        size="md"
                        style="min-width: 68px"
                        @click="onClear"
                        label="Clear"
                        v-close-popup
                      />
                    </div>
                  </div>
                </div>
              </q-menu>
            </q-btn>
          </template>
        </q-input>

        <q-space /> -->

      <div class="q-gutter-sm row items-center no-wrap q-px-sm">
        <q-btn round dense unelevated color="grey-8" icon="shopping_cart">
          <q-badge color="red" text-color="white" floating>{{ cartStore.nonUniqueCartItemCount }}</q-badge>
          <q-menu style="width: min(400px, 80vw)">
            <q-toolbar class="row bg-primary text-white items-start justify-between q-px-md q-py-none">
              <q-toolbar-title class="text-body1">Cart ({{ cartStore.nonUniqueCartItemCount }})</q-toolbar-title>
              <q-toolbar-title class="text-right text-body1">{{ prettyPriceUS(cartStore.total) }}</q-toolbar-title>
            </q-toolbar>
            <q-scroll-area
              :style="`height: ${cartStore.uniqueCartItemCount * 83}px; max-height: 300px;`"
              :thumb-style="{ width: '5px' }"
              v-if="cartStore.nonUniqueCartItemCount"
            >
              <q-list class="q-py-xs q-px-md" separator>
                <q-slide-item
                  v-for="item in cartItems"
                  :key="item.sku"
                  right-color="negative"
                  @right="cartStore.removeFromCart(item.sku)"
                >
                  <template v-slot:right>
                    <q-icon name="delete" />
                  </template>
                  <q-item class="q-py-md q-px-none">
                    <q-item-section thumbnail>
                      <q-avatar square size="45px">
                        <img :src="item.image_main" alt="" draggable="false" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section class="column q-pr-md">
                      <q-item-label lines="2" :title="item.name">{{ item.name }}</q-item-label>
                      <q-item-label lines="1" class="font-11 font-muted">{{
                        prettyPriceUS(item.sale_price)
                      }}</q-item-label>
                      <!-- <q-item-label class="font-10" caption>QTY: {{ item.quantity }}</q-item-label> -->
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

        <!-- <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn> -->
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
