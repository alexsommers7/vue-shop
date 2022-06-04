import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options';

const app = createApp({
  ...App,
});

app.use(Quasar, quasarUserOptions);
app.use(createPinia());
app.mount('#app');
