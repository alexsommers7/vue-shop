import './styles/quasar.scss';
import '@quasar/extras/material-icons/material-icons.css';
import { Notify } from 'quasar';

export default {
  config: {
    notify: {
      type: 'positive',
      progress: true,
      progressClass: 'progress',
      timeout: 3500,
    },
  },
  plugins: {
    Notify,
  },
};
