<template>
  <div class="modal" :class="{ active: modalOpen }" @click.self="modalOpen = false">
    <div class="modal__content">
      <button class="modal__close" @click.self="modalOpen = false">x</button>
      <div class="modal__description">
        <img class="modal__image" :src="modalData.selectedImagePath" :alt="modalData.selectedImageAlt" />
        <div class="modal__text-content">
          <div class="modal__title__price">
            <p class="modal__title">
              <strong>{{ modalData.selectedTitle }}</strong>
            </p>
            <p class="modal__price">
              {{ prettyPriceUS(modalData.selectedPrice) }}
            </p>
          </div>
          <p class="modal__text">
            {{ modalData.selectedDescription }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { prettyPriceUS } from '../utils/utilities';

export default {
  name: 'ProductModal',
  data() {
    return {
      modalOpen: false,
    };
  },
  props: {
    modalData: Object,
  },
  watch: {
    modalData: {
      handler: function (newObj) {
        if (newObj.openTriggered && !this.modalOpen) this.modalOpen = true;
      },
      deep: true,
    },
    modalOpen: {
      handler: function () {
        this.modalOpen ? document.body.classList.add('no-scroll') : document.body.classList.remove('no-scroll');
      },
    },
  },
  methods: {
    prettyPriceUS,
  },
};
</script>
