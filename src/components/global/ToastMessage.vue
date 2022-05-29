<template>
  <div class="toast" v-if="toast.show" @click="toast.show = false">
    <svg x="0px" y="0px" viewBox="0 0 426.667 426.667" style="enable-background: new 0 0 426.667 426.667">
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
    <span v-if="removingFromCart">Item removed from cart</span>
    <span v-else>Item added to cart</span>
  </div>
</template>

<script>
import { mapWritableState } from 'pinia';
import { useCartStore } from '../../stores/cart.js';

export default {
  name: 'ToastMessage',
  computed: {
    ...mapWritableState(useCartStore, ['toast', 'removingFromCart']),
  },
};
</script>

<style scoped></style>
