import './styles/quasar.scss';
import '@quasar/extras/material-icons/material-icons.css';
import { Notify, Loading } from 'quasar';

export default {
  plugins: {
    Notify,
    Loading,
  },
  config: {
    notify: {
      type: 'positive',
      progress: true,
      progressClass: 'progress',
      timeout: 3500,
    },
  },
};
